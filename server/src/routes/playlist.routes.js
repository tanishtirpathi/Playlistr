import { Router } from "express";
import {
	createPlaylist,
	deletePlaylist,
	getAllPlaylists,
	getTopPlaylists,
} from "../controller/playlist.controller.js";

const router = Router();

router.post("/create", createPlaylist);
router.delete("/delete/:playlistId", deletePlaylist);
router.get("/all", getAllPlaylists);
router.get("/top", getTopPlaylists);

export default router;
