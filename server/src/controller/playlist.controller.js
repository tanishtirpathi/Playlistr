import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResp.js";
import { AsyncHandler } from "../config/Asynchandler.js";

export const createPlaylist = AsyncHandler(async (req, res) => {
	const { title, spotifyId, description, tags, ownerId } = req.body;

	if (!title || !ownerId) {
		throw new ApiError(400, "title and ownerId are required");
	}

	 const owner = await User.findById(ownerId);
	// if (!owner) {
	// 	throw new ApiError(404, "Owner user not found");
	// }

	const playlist = await Playlist.create({
		title,
		spotifyId,
		description,
		tags: tags || [],
		owner: ownerId,
	});

	if (!playlist) {
		throw new ApiError(500, "Failed to create playlist");
	}

	owner.playlistsUploadedCount += 1;
	await owner.save({ validateBeforeSave: false });

	const populatedPlaylist = await Playlist.findById(playlist._id).populate(
		"owner",
		"name email",
	);

	return res
		.status(201)
		.json(
			new ApiResponse(201, "Playlist created successfully", populatedPlaylist),
		);
});

export const deletePlaylist = AsyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	const { ownerId } = req.body;

	if (!playlistId) {
		throw new ApiError(400, "playlistId is required");
	}

	if (!ownerId) {
		throw new ApiError(400, "ownerId is required");
	}

	const playlist = await Playlist.findById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found");
	}

	if (playlist.owner.toString() !== ownerId) {
		throw new ApiError(403, "You are not authorized to delete this playlist");
	}

	await Playlist.findByIdAndDelete(playlistId);

	const owner = await User.findById(ownerId);
	if (owner && owner.playlistsUploadedCount > 0) {
		owner.playlistsUploadedCount -= 1;
		await owner.save({ validateBeforeSave: false });
	}

	return res
		.status(200)
		.json(new ApiResponse(200, "Playlist deleted successfully", null));
});

export const getAllPlaylists = AsyncHandler(async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);
	const skip = (pageNum - 1) * limitNum;

	const sortOrder = order === "asc" ? 1 : -1;
	const sortOptions = { [sortBy]: sortOrder };

	const playlists = await Playlist.find()
		.populate("owner", "name email")
		.sort(sortOptions)
		.skip(skip)
		.limit(limitNum);

	const totalPlaylists = await Playlist.countDocuments();
	const totalPages = Math.ceil(totalPlaylists / limitNum);

	return res.status(200).json(
		new ApiResponse(200, "Playlists fetched successfully", {
			playlists,
			pagination: {
				currentPage: pageNum,
				totalPages,
				totalPlaylists,
				limit: limitNum,
			},
		}),
	);
});

export const getTopPlaylists = AsyncHandler(async (req, res) => {
	const { minLikes = 10, limit = 20 } = req.query;

	const minLikesNum = parseInt(minLikes);
	const limitNum = parseInt(limit);

	const topPlaylists = await Playlist.find({ like: { $gte: minLikesNum } })
		.populate("owner", "name email")
		.sort({ like: -1 })
		.limit(limitNum);

	return res.status(200).json(
		new ApiResponse(200, "Top playlists fetched successfully", {
			playlists: topPlaylists,
			minLikes: minLikesNum,
			count: topPlaylists.length,
		}),
	);
});
