import mongoose from "mongoose";

const allowedTags = ["pop", "rock", "hiphop", "jazz", "chill", "workout"];

const playlistSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	spotifyId: {
		type: String,
		trim: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	tags: {
		type: [String],
		enum: allowedTags,
		default: [],
	},
	description: {
		type: String,
		trim: true,
		maxlength: 300,
	},
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
