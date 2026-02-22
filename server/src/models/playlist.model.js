import mongoose from "mongoose";

const allowedTags = ["pop", "rock", "hiphop", "jazz", "chill", "workout"];

const songSchema = new mongoose.Schema({
	spotifyId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	artist: {
		type: String,
		required: true,
	},
	album: String,
	duration: Number,
	previewUrl: String,
	albumArt: String,
	addedAt: {
		type: Date,
		default: Date.now,
	},
});

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
	songs: {
		type: [songSchema],
		default: [],
	},
	like: {
		type: Number,
		default: 0,
	},
	dislike: {
		type: Number,
		default: 0,
	},
	likedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	}],
	dislikedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	}],
	isPublic: {
		type: Boolean,
		default: true,
	},
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
