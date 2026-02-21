import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResp.js";
import { AsyncHandler } from "../config/Asynchandler.js";

const sanitizeUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	googleId: user.googleId || null,
	createdAt: user.createdAt,
	playlistsUploadedCount: user.playlistsUploadedCount,
});

export const registerUser = AsyncHandler(async (req, res , next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new ApiError(400, "data is required");
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new ApiError(409, "User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
	});
    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }
	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	user.refreshToken = refreshToken;
	await user.save();

	return res.status(201).json(
		new ApiResponse(201, "User registered successfully", {
			user: sanitizeUser(user),
			accessToken,
			refreshToken,
		}),
	);
});

export const loginUser = AsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ApiError(400, "email and password are required");
	}

	const user = await User.findOne({ email}).select(
		"+password +refreshToken",
	);
	if (!user) {
		throw new ApiError(401, "Invalid credentials");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid credentials");
	}

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });

	return res.status(200).json(
		new ApiResponse(200, "Login successful", {
			user: sanitizeUser(user),
			accessToken,
			refreshToken,
		}),
	);
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
	const incomingRefreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(401, "Refresh token is required");
	}

	let payload;
	try {
		payload = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET || "refresh_secret_dev",
		);
	} catch {
		throw new ApiError(401, "Invalid or expired refresh token");
	}

	const user = await User.findById(payload.id).select("+refreshToken");
	if (!user || user.refreshToken !== incomingRefreshToken) {
		throw new ApiError(401, "Refresh token is invalid");
	}

	const newAccessToken = user.generateAccessToken();
	const newRefreshToken = user.generateRefreshToken();

	user.refreshToken = newRefreshToken;
	await user.save({ validateBeforeSave: false });

	return res.status(200).json(
		new ApiResponse(200, "Token refreshed", {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		}),
	);
});

export const logoutUser = AsyncHandler(async (req, res) => {
	const incomingRefreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(400, "Refresh token is required to logout");
	}

	const user = await User.findOne({ refreshToken: incomingRefreshToken }).select(
		"+refreshToken",
	);
	if (!user) {
		return res.status(200).json(new ApiResponse(200, "Already logged out", null));
	}

	user.refreshToken = null;
	await user.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(new ApiResponse(200, "Logout successful", null));
});
