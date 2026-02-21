import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true,
		trim: true,
	},
	password: {
		type: String,
		required: function () {
			return !this.googleId;
		},
		minlength: 6,
		select: false,
	},
	refreshToken: {
		type: String,
		default: null,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	playlistsUploadedCount: {
		type: Number,
		default: 0,
		min: 0,
	},
});

userSchema.pre("save", async function () {
	if (!this.isModified("password") || !this.password) return;
	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{ id: this._id, email: this.email },
		process.env.ACCESS_TOKEN_SECRET || "access_secret_dev",
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" },
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{ id: this._id },
		process.env.REFRESH_TOKEN_SECRET || "refresh_secret_dev",
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" },
	);
};

const User = mongoose.model("User", userSchema);

export default User;
