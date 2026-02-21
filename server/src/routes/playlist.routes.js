import { Router } from "express";
import {
	createPlaylist,
	deletePlaylist,
	getAllPlaylists,
	getTopPlaylists,
} from "../controller/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createPlaylist);
router.delete("/delete/:playlistId", verifyJWT, deletePlaylist);
router.get("/all", verifyJWT, getAllPlaylists);
router.get("/top", getTopPlaylists);

export default router;
