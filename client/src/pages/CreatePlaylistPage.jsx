import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ALLOWED_TAGS = ["pop", "rock", "hiphop", "jazz", "chill", "workout"];

export default function CreatePlaylistPage() {
	const [formData, setFormData] = useState({
		title: "",
		spotifyId: "",
		description: "",
		tags: [],
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuth();
	const { isDark } = useTheme();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleTagToggle = (tag) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.includes(tag)
				? prev.tags.filter((t) => t !== tag)
				: [...prev.tags, tag],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await playlistAPI.createPlaylist({
				...formData,
				ownerId: user.id,
			});
			if (response.data.success) {
				navigate("/playlists");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create playlist");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`min-h-screen p-8 transition-colors ${isDark ? "bg-gradient-to-br from-black via-gray-900 to-purple-900" : "bg-gradient-to-br from-purple-100 via-white to-blue-100"}`}>
			<div className="max-w-2xl mx-auto">
				<div className={`rounded-lg shadow-lg p-8 transition ${isDark ? "bg-gray-800" : "bg-white"}`}>
					<h1 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>Create Playlist</h1>

					{error && (
					<div className={`mb-4 p-3 border rounded ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Playlist Title *
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
								required
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Spotify ID
							</label>
							<input
								type="text"
								name="spotifyId"
								value={formData.spotifyId}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
								rows="4"
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Tags
							</label>
							<div className="grid grid-cols-2 gap-2">
								{ALLOWED_TAGS.map((tag) => (
									<label key={tag} className="flex items-center">
										<input
											type="checkbox"
											checked={formData.tags.includes(tag)}
											onChange={() => handleTagToggle(tag)}
											className="mr-2"
										/>
										<span className={isDark ? "text-gray-300" : "text-gray-700"}>{tag}</span>
									</label>
								))}
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full py-2 rounded-lg font-semibold transition disabled:opacity-50 ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
						>
							{loading ? "Creating..." : "Create Playlist"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
