import { useState, useEffect } from "react";
import { playlistAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function TopPlaylistsPage() {
	const [playlists, setPlaylists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [minLikes, setMinLikes] = useState(10);
	const { isDark } = useTheme();

	useEffect(() => {
		const fetchTopPlaylists = async () => {
			try {
				setLoading(true);
				const response = await playlistAPI.getTopPlaylists({
					minLikes,
					limit: 20,
				});
				if (response.data.success) {
					setPlaylists(response.data.data.playlists);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Failed to fetch top playlists");
			} finally {
				setLoading(false);
			}
		};

		fetchTopPlaylists();
	}, [minLikes]);

	return (
		<div className={`min-h-screen p-8 transition-colors ${isDark ? "bg-gradient-to-br from-black via-gray-900 to-purple-900" : "bg-gradient-to-br from-purple-100 via-white to-blue-100"}`}>
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Top Playlists</h1>
					<div className="flex gap-4">
						<div className={`rounded-lg p-4 transition ${isDark ? "bg-gray-800" : "bg-white"}`}>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Min Likes:
							</label>
							<input
								type="number"
								value={minLikes}
								onChange={(e) => setMinLikes(parseInt(e.target.value) || 0)}
								className={`px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
								min="0"
							/>
						</div>
						<Link
							to="/playlists"
							className={`px-6 py-2 rounded-lg font-semibold transition h-fit ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
						>
							My Playlists
						</Link>
					</div>
				</div>

				{error && (
				<div className={`mb-4 p-3 border rounded ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}>
					</div>
				)}

				{loading ? (
				<div className={`text-center text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>Loading top playlists...</div>
			) : playlists.length === 0 ? (
				<div className={`text-center text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
						No playlists found with {minLikes}+ likes
					</div>
				) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{playlists.map((playlist) => (
						<div key={playlist._id} className={`rounded-lg shadow-lg p-6 transition ${isDark ? "bg-gray-800" : "bg-white"}`}>
							<h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
								{playlist.title}
							</h2>
							<p className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									By {playlist.owner?.name || "Unknown"}
								</p>
								{playlist.description && (
									<p className={`mb-3 line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										{playlist.description}
									</p>
								)}
								<div className="flex gap-2 mb-3">
									{playlist.tags?.map((tag) => (
										<span
											key={tag}
											className={`text-xs px-2 py-1 rounded transition ${isDark ? "bg-purple-900 text-purple-300" : "bg-purple-200 text-purple-800"}`}
										>
											{tag}
										</span>
									))}
								</div>
								<p className={`text-sm font-semibold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
									❤️ {playlist.like || 0} Likes
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
