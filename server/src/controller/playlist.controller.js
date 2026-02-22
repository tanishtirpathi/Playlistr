import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResp.js";
import { AsyncHandler } from "../config/Asynchandler.js";
import { getSpotifyToken } from "../config/spotify.js";
import axios from "axios";
export const createPlaylist = AsyncHandler(async (req, res) => {
  const { title, spotifyId, description, tags } = req.body;

  if (!title) {
    throw new ApiError(400, "title is required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.create({
    title,
    spotifyId,
    description,
    tags: tags || [],
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  req.user.playlistsUploadedCount += 1;
  await req.user.save({ validateBeforeSave: false });

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

  if (!playlistId) {
    throw new ApiError(400, "playlistId is required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);

  if (req.user.playlistsUploadedCount > 0) {
    req.user.playlistsUploadedCount -= 1;
    await req.user.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist deleted successfully", null));
});

export const getAllPlaylists = AsyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

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

export const addSongToPlaylist = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { spotifyId, name, artist, album, duration, previewUrl, albumArt } =
    req.body;

  if (!playlistId || !spotifyId || !name || !artist) {
    throw new ApiError(
      400,
      "playlistId, spotifyId, name, and artist are required",
    );
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  // Check if song already exists in playlist
  const songExists = playlist.songs.some(
    (song) => song.spotifyId === spotifyId,
  );
  if (songExists) {
    throw new ApiError(400, "Song already exists in playlist");
  }

  playlist.songs.push({
    spotifyId,
    name,
    artist,
    album,
    duration,
    previewUrl,
    albumArt,
  });

  await playlist.save();

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "owner",
    "name email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Song added to playlist successfully",
        updatedPlaylist,
      ),
    );
});

export const removeSongFromPlaylist = AsyncHandler(async (req, res) => {
  const { playlistId, songId } = req.params;

  if (!playlistId || !songId) {
    throw new ApiError(400, "playlistId and songId are required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  playlist.songs = playlist.songs.filter(
    (song) => song._id.toString() !== songId,
  );
  await playlist.save();

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "owner",
    "name email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Song removed from playlist successfully",
        updatedPlaylist,
      ),
    );
});

export const likePlaylist = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlistId is required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const userId = req.user._id;
  const hasLiked = playlist.likedBy.includes(userId);
  const hasDisliked = playlist.dislikedBy.includes(userId);

  if (hasLiked) {
    // Unlike
    playlist.likedBy = playlist.likedBy.filter(
      (id) => id.toString() !== userId.toString(),
    );
    playlist.like = Math.max(0, playlist.like - 1);
  } else {
    // Like
    playlist.likedBy.push(userId);
    playlist.like += 1;

    // Remove dislike if exists
    if (hasDisliked) {
      playlist.dislikedBy = playlist.dislikedBy.filter(
        (id) => id.toString() !== userId.toString(),
      );
      playlist.dislike = Math.max(0, playlist.dislike - 1);
    }
  }

  await playlist.save();

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "owner",
    "name email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hasLiked ? "Playlist unliked" : "Playlist liked",
        updatedPlaylist,
      ),
    );
});

export const dislikePlaylist = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlistId is required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const userId = req.user._id;
  const hasLiked = playlist.likedBy.includes(userId);
  const hasDisliked = playlist.dislikedBy.includes(userId);

  if (hasDisliked) {
    // Remove dislike
    playlist.dislikedBy = playlist.dislikedBy.filter(
      (id) => id.toString() !== userId.toString(),
    );
    playlist.dislike = Math.max(0, playlist.dislike - 1);
  } else {
    // Dislike
    playlist.dislikedBy.push(userId);
    playlist.dislike += 1;

    // Remove like if exists
    if (hasLiked) {
      playlist.likedBy = playlist.likedBy.filter(
        (id) => id.toString() !== userId.toString(),
      );
      playlist.like = Math.max(0, playlist.like - 1);
    }
  }

  await playlist.save();

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "owner",
    "name email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hasDisliked ? "Dislike removed" : "Playlist disliked",
        updatedPlaylist,
      ),
    );
});

export const getPlaylistById = AsyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlistId is required");
  }

  const playlist = await Playlist.findById(playlistId).populate(
    "owner",
    "name email",
  );
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});
export const fetchSpotifyPlaylists = AsyncHandler(async (req, res) => {
  const { playlistUrl } = req.body;
  if (!playlistUrl) {
    throw new ApiError(400, "playlistUrl is required");
  }
  const playlistId = playlistUrl.split("/playlist/")[1].split("?")[0];
  if (!playlistId) {
    throw new ApiError(400, "Invalid Spotify playlist URL");
  }
  const token = await getSpotifyToken();
  if (!token) {
    throw new ApiError(500, "Failed to get Spotify access token");
  }
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  res.json(response.data);
});
