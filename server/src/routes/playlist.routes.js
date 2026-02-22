import { Router } from "express";
import {
	createPlaylist,
	deletePlaylist,
	getAllPlaylists,
	getTopPlaylists,
	addSongToPlaylist,
	removeSongFromPlaylist,
	likePlaylist,
	dislikePlaylist,
	getPlaylistById,
} from "../controller/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createPlaylist);
router.delete("/delete/:playlistId", verifyJWT, deletePlaylist);
router.get("/all", verifyJWT, getAllPlaylists);
router.get("/top", getTopPlaylists);
router.get("/:playlistId", getPlaylistById);
router.post("/:playlistId/add-song", verifyJWT, addSongToPlaylist);
router.delete("/:playlistId/remove-song/:songId", verifyJWT, removeSongFromPlaylist);
router.post("/:playlistId/like", verifyJWT, likePlaylist);
router.post("/:playlistId/dislike", verifyJWT, dislikePlaylist);

export default router;
