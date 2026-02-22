import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SongSearch from "../components/SongSearch";

const ALLOWED_TAGS = ["pop", "rock", "hiphop", "jazz", "chill", "workout"];

export default function CreatePlaylistPage() {
	const [formData, setFormData] = useState({
		title: "",
		spotifyId: "",
		description: "",
		tags: [],
	});
	const [songs, setSongs] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [spotifyUrl, setSpotifyUrl] = useState("");
	const [importingSpotify, setImportingSpotify] = useState(false);
	const [showImport, setShowImport] = useState(false);
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

	const handleAddSong = (song) => {
		// Check if song already exists
		const exists = songs.some((s) => s.spotifyId === song.id);
		if (exists) {
			setError("Song already added to playlist");
			setTimeout(() => setError(""), 3000);
			return;
		}

		setSongs((prev) => [
			...prev,
			{
				spotifyId: song.id,
				name: song.name,
				artist: song.artist,
				album: song.album,
				duration: song.duration,
				albumArt: song.albumArt,
			},
		]);
	};

	const handleRemoveSong = (spotifyId) => {
		setSongs((prev) => prev.filter((s) => s.spotifyId !== spotifyId));
	};

	const formatDuration = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// First create the playlist
			const playlistResponse = await playlistAPI.createPlaylist({
				...formData,
				ownerId: user.id,
			});

			if (playlistResponse.data.success) {
				const playlistId = playlistResponse.data.data._id;

				// Then add all songs to the playlist
				for (const song of songs) {
					await playlistAPI.addSongToPlaylist(playlistId, song);
				}

				navigate("/playlists");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create playlist");
		} finally {
			setLoading(false);
		}
	};

	const handleImportSpotify = async () => {
		if (!spotifyUrl) {
			setError("Please enter a Spotify playlist URL");
			return;
		}

		setImportingSpotify(true);
		setError("");

		try {
			const response = await playlistAPI.importSpotifyPlaylist(
				spotifyUrl,
				// formData.tags
			);
			if(!response){
				setError("Failed to import playlist. Please check the URL and try again.");
				return;
			}
			console.log(response
			)
			if (response.data.success) {
				navigate("/playlists");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to import Spotify playlist");
		} finally {
			setImportingSpotify(false);
		}
	};

	return (
		<div
			className={`min-h-screen p-8 transition-colors ${
				isDark
					? "bg-gradient-to-br from-black via-gray-900 to-purple-900"
					: "bg-gradient-to-br from-purple-100 via-white to-blue-100"
			}`}
		>
			<div className="max-w-4xl mx-auto">
				<div
					className={`rounded-lg shadow-lg p-8 transition ${
						isDark ? "bg-gray-800" : "bg-white"
					}`}
				>
					<h1
						className={`text-3xl font-bold mb-6 ${
							isDark ? "text-white" : "text-gray-800"
						}`}
					>
						Create Playlist
					</h1>

					{error && (
						<div
							className={`mb-4 p-3 border rounded ${
								isDark
									? "bg-red-900 border-red-700 text-red-200"
									: "bg-red-100 border-red-400 text-red-700"
							}`}
						>
							{error}
						</div>
					)}

				{/* Toggle between Manual and Spotify Import */}
				<div className="flex gap-4 mb-6">
					<button
						type="button"
						onClick={() => setShowImport(false)}
						className={`flex-1 py-3 rounded-lg font-semibold transition ${
							!showImport
								? isDark
									? "bg-purple-600 text-white"
									: "bg-purple-600 text-white"
								: isDark
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Manual Creation
					</button>
					<button
						type="button"
						onClick={() => setShowImport(true)}
						className={`flex-1 py-3 rounded-lg font-semibold transition ${
							showImport
								? isDark
									? "bg-purple-600 text-white"
									: "bg-purple-600 text-white"
								: isDark
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Import from Spotify
					</button>
				</div>

				{/* Spotify Import Section */}
				{showImport && (
					<div className={`p-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
						<h2
							className={`text-xl font-semibold mb-4 ${
								isDark ? "text-white" : "text-gray-800"
							}`}
						>
							Import Spotify Playlist
						</h2>
						<p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
							Paste a Spotify playlist URL to import all tracks automatically.
						</p>
						<div className="space-y-4">
							<input
								type="text"
								placeholder="https://open.spotify.com/playlist/..."
								value={spotifyUrl}
								onChange={(e) => setSpotifyUrl(e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
									isDark
										? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
										: "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
								}`}
							/>
							<button
								type="button"
								onClick={handleImportSpotify}
								disabled={importingSpotify}
								className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
									isDark
										? "bg-green-600 text-white hover:bg-green-700"
										: "bg-green-600 text-white hover:bg-green-700"
								}`}
							>
								{importingSpotify ? "Importing..." : "Import Playlist"}
							</button>
						</div>
					</div>
				)}

				{/* Manual Creation Form */}
				{!showImport && (
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Playlist Details */}
						<div className="space-y-4">
							<h2
								className={`text-xl font-semibold ${
									isDark ? "text-white" : "text-gray-800"
								}`}
							>
								Playlist Details
							</h2>

							<div>
								<label
									className={`block text-sm font-medium mb-1 ${
										isDark ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Playlist Title *
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
										isDark
											? "bg-gray-700 border-gray-600 text-white"
											: "border-gray-300 bg-white text-gray-900"
									}`}
									required
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-1 ${
										isDark ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Spotify ID
								</label>
								<input
									type="text"
									name="spotifyId"
									value={formData.spotifyId}
									onChange={handleChange}
									className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
										isDark
											? "bg-gray-700 border-gray-600 text-white"
											: "border-gray-300 bg-white text-gray-900"
									}`}
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-1 ${
										isDark ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Description
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
										isDark
											? "bg-gray-700 border-gray-600 text-white"
											: "border-gray-300 bg-white text-gray-900"
									}`}
									rows="4"
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-3 ${
										isDark ? "text-gray-300" : "text-gray-700"
									}`}
								>
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
											<span className={isDark ? "text-gray-300" : "text-gray-700"}>
												{tag}
											</span>
										</label>
									))}
								</div>
							</div>
						</div>

						{/* Song Search Section */}
						<div className="space-y-4">
							<h2
								className={`text-xl font-semibold ${
									isDark ? "text-white" : "text-gray-800"
								}`}
							>
								Add Songs
							</h2>
							<SongSearch onAddSong={handleAddSong} existingSongs={songs} />
						</div>

						{/* Added Songs List */}
						{songs.length > 0 && (
							<div className="space-y-4">
								<h2
									className={`text-xl font-semibold ${
										isDark ? "text-white" : "text-gray-800"
									}`}
								>
									Playlist Songs ({songs.length})
								</h2>
								<div
									className={`rounded-lg border ${
										isDark ? "border-gray-700" : "border-gray-300"
									} max-h-80 overflow-y-auto`}
								>
									{songs.map((song, index) => (
										<div
											key={song.spotifyId}
											className={`p-3 border-b last:border-b-0 flex items-center justify-between ${
												isDark
													? "border-gray-700"
													: "border-gray-200"
											}`}
										>
											<div className="flex items-center gap-3 flex-1">
												<span
													className={`font-semibold ${
														isDark ? "text-gray-400" : "text-gray-500"
													}`}
												>
													{index + 1}.
												</span>
												<img
													src={song.albumArt}
													alt={song.album}
													className="w-10 h-10 rounded object-cover"
												/>
												<div className="flex-1 min-w-0">
													<p
														className={`font-semibold truncate ${
															isDark ? "text-white" : "text-gray-900"
														}`}
													>
														{song.name}
													</p>
													<p
														className={`text-sm truncate ${
															isDark ? "text-gray-400" : "text-gray-600"
														}`}
													>
														{song.artist} • {formatDuration(song.duration)}
													</p>
												</div>
											</div>
											<button
												type="button"
												onClick={() => handleRemoveSong(song.spotifyId)}
												className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
													isDark
														? "bg-red-600 text-white hover:bg-red-700"
														: "bg-red-500 text-white hover:bg-red-600"
												}`}
											>
												Remove
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
								isDark
									? "bg-purple-600 text-white hover:bg-purple-700"
									: "bg-purple-600 text-white hover:bg-purple-700"
							}`}
						>
							{loading ? "Creating Playlist..." : "Create Playlist"}
						</button>
					</form>
				)}
				</div>
			</div>
		</div>
	);
}
