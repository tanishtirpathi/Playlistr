import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../config/ApiError.js";
import { AsyncHandler } from "../config/Asynchandler.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
	const token =
		req.cookies?.accessToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		throw new ApiError(401, "Unauthorized - Access token is required");
	}

	let decodedToken;
	try {
		decodedToken = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET || "access_secret_dev",
		);
	} catch (error) {
		throw new ApiError(401, "Invalid or expired access token");
	}

	const user = await User.findById(decodedToken?.id).select("-password -refreshToken");

	if (!user) {
		throw new ApiError(401, "Invalid access token - User not found");
	}

	req.user = user;
	next();
});
