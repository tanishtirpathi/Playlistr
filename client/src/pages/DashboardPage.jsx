import { useState, useEffect } from "react";
import { playlistAPI } from "../services/api";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
	const [playlists, setPlaylists] = useState([]);
	const [topPlaylists, setTopPlaylists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [minLikes, setMinLikes] = useState(10);
	const { isDark } = useTheme();
	const { user } = useAuth();

	useEffect(() => {
		const fetchPlaylists = async () => {
			try {
				setLoading(true);
				const [userPlaylistsRes, topPlaylistsRes] = await Promise.all([
					playlistAPI.getAllPlaylists({ page, limit: 10 }),
					playlistAPI.getTopPlaylists({ minLikes, limit: 5 }),
				]);

				if (userPlaylistsRes.data.success) {
					setPlaylists(userPlaylistsRes.data.data.playlists);
				}
				if (topPlaylistsRes.data.success) {
					setTopPlaylists(topPlaylistsRes.data.data.playlists);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Failed to fetch playlists");
			} finally {
				setLoading(false);
			}
		};

		fetchPlaylists();
	}, [page, minLikes]);

	const handleDelete = async (playlistId) => {
		if (window.confirm("Are you sure you want to delete this playlist?")) {
			try {
				await playlistAPI.deletePlaylist(playlistId);
				setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
			} catch (err) {
				setError(err.response?.data?.message || "Failed to delete playlist");
			}
		}
	};

	const handleLike = async (playlistId, isTopPlaylist = false) => {
		try {
			const response = await playlistAPI.likePlaylist(playlistId);
			if (response.data.success) {
				if (isTopPlaylist) {
					setTopPlaylists((prev) =>
						prev.map((p) => (p._id === playlistId ? response.data.data : p))
					);
				} else {
					setPlaylists((prev) =>
						prev.map((p) => (p._id === playlistId ? response.data.data : p))
					);
				}
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to like playlist");
		}
	};

	const handleDislike = async (playlistId, isTopPlaylist = false) => {
		try {
			const response = await playlistAPI.dislikePlaylist(playlistId);
			if (response.data.success) {
				if (isTopPlaylist) {
					setTopPlaylists((prev) =>
						prev.map((p) => (p._id === playlistId ? response.data.data : p))
					);
				} else {
					setPlaylists((prev) =>
						prev.map((p) => (p._id === playlistId ? response.data.data : p))
					);
				}
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to dislike playlist");
		}
	};

	const hasUserLiked = (playlist) => {
		return playlist.likedBy?.includes(user?.id);
	};

	const hasUserDisliked = (playlist) => {
		return playlist.dislikedBy?.includes(user?.id);
	};

	return (
		<div className={`min-h-screen transition-colors ${isDark ? "bg-gradient-to-br from-black via-gray-900 to-purple-900" : "bg-gradient-to-br from-purple-100 via-white to-blue-100"}`}>
			{/* Welcome Section */}
			<div className="p-8">
				<div className="max-w-6xl mx-auto">
					<h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
						Welcome, {user?.name}! 🎵
					</h1>
					<p className={`text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
						Manage your playlists and discover new hits
					</p>
				</div>
			</div>

			{/* Quick Action Button */}
			<div className="px-8 pb-8">
				<div className="max-w-6xl mx-auto">
					<Link
						to="/create-playlist"
						className={`inline-block px-6 py-3 rounded-lg font-semibold transition ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
					>
						+ Create New Playlist
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-8 pb-8">
				<div className="max-w-6xl mx-auto space-y-12">
					{error && (
						<div className={`p-3 border rounded ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}>
							{error}
						</div>
					)}

					{/* Your Playlists Section */}
					<div>
						<h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
							Your Playlists
						</h2>
						{loading ? (
							<div className={`text-center text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Loading your playlists...
							</div>
						) : playlists.length === 0 ? (
							<div className={`text-center p-8 border-2 border-dashed rounded-lg ${isDark ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-600"}`}>
								<p className="text-lg mb-4">No playlists yet</p>
								<Link
									to="/create-playlist"
									className={`inline-block px-6 py-2 rounded-lg font-semibold transition ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
								>
									Create Your First Playlist
								</Link>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{playlists.map((playlist) => (
									<div
										key={playlist._id}
										className={`rounded-lg shadow-lg p-6 transition ${isDark ? "bg-gray-800" : "bg-white"}`}
									>
										<h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
											{playlist.title}
										</h3>
										<p className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											By {playlist.owner?.name || user?.name}
										</p>
										{playlist.description && (
											<p className={`mb-3 line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
												{playlist.description}
											</p>
										)}
										<div className="flex gap-2 mb-3 flex-wrap">
											{playlist.tags?.map((tag) => (
												<span
													key={tag}
													className={`text-xs px-2 py-1 rounded transition ${isDark ? "bg-purple-900 text-purple-300" : "bg-purple-200 text-purple-800"}`}
												>
													{tag}
												</span>
											))}
										</div>
										<p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
											🎵 Songs: {playlist.songs?.length || 0}
										</p>

										{/* Like/Dislike buttons */}
										<div className="flex gap-2 mb-4">
											<button
												onClick={() => handleLike(playlist._id, false)}
												className={`flex-1 py-2 rounded transition font-semibold flex items-center justify-center gap-1 ${
													hasUserLiked(playlist)
														? isDark
															? "bg-purple-600 text-white"
															: "bg-purple-600 text-white"
														: isDark
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												<span>👍</span>
												<span>{playlist.like || 0}</span>
											</button>
											<button
												onClick={() => handleDislike(playlist._id, false)}
												className={`flex-1 py-2 rounded transition font-semibold flex items-center justify-center gap-1 ${
													hasUserDisliked(playlist)
														? isDark
															? "bg-red-600 text-white"
															: "bg-red-600 text-white"
														: isDark
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												<span>👎</span>
												<span>{playlist.dislike || 0}</span>
											</button>
										</div>

										<button
											onClick={() => handleDelete(playlist._id)}
											className={`w-full py-2 rounded transition font-semibold ${isDark ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}
										>
											Delete
										</button>
									</div>
								))}
							</div>
						)}

						{/* Pagination */}
						{playlists.length > 0 && (
							<div className="flex gap-4 justify-center mt-8">
								<button
									onClick={() => setPage((p) => Math.max(p - 1, 1))}
									disabled={page === 1}
									className={`px-4 py-2 rounded font-semibold transition disabled:opacity-50 ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
								>
									Previous
								</button>
								<span className={`py-2 px-4 ${isDark ? "text-white" : "text-gray-800"}`}>
									Page {page}
								</span>
								<button
									onClick={() => setPage((p) => p + 1)}
									className={`px-4 py-2 rounded font-semibold transition ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
								>
									Next
								</button>
							</div>
						)}
					</div>

					{/* Top Playlists Section */}
					<div>
						<div className="flex justify-between items-center mb-6">
							<h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
								Top Trending Playlists
							</h2>
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
						</div>

						{topPlaylists.length === 0 ? (
							<div className={`text-center p-8 border-2 border-dashed rounded-lg ${isDark ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-600"}`}>
								No playlists found with {minLikes}+ likes
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{topPlaylists.map((playlist) => (
									<div
										key={playlist._id}
										className={`rounded-lg shadow-lg p-6 transition ${isDark ? "bg-gray-800" : "bg-white"}`}
									>
										<h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
											{playlist.title}
										</h3>
										<p className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											By {playlist.owner?.name || "Unknown"}
										</p>
										{playlist.description && (
											<p className={`mb-3 line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
												{playlist.description}
											</p>
										)}
										<div className="flex gap-2 mb-3 flex-wrap">
											{playlist.tags?.map((tag) => (
												<span
													key={tag}
													className={`text-xs px-2 py-1 rounded transition ${isDark ? "bg-purple-900 text-purple-300" : "bg-purple-200 text-purple-800"}`}
												>
													{tag}
												</span>
											))}
										</div>
										<p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
											🎵 Songs: {playlist.songs?.length || 0}
										</p>

										{/* Like/Dislike buttons for top playlists */}
										<div className="flex gap-2">
											<button
												onClick={() => handleLike(playlist._id, true)}
												className={`flex-1 py-2 rounded transition font-semibold flex items-center justify-center gap-1 ${
													hasUserLiked(playlist)
														? isDark
															? "bg-purple-600 text-white"
															: "bg-purple-600 text-white"
														: isDark
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												<span>👍</span>
												<span>{playlist.like || 0}</span>
											</button>
											<button
												onClick={() => handleDislike(playlist._id, true)}
												className={`flex-1 py-2 rounded transition font-semibold flex items-center justify-center gap-1 ${
													hasUserDisliked(playlist)
														? isDark
															? "bg-red-600 text-white"
															: "bg-red-600 text-white"
														: isDark
														? "bg-gray-700 text-gray-300 hover:bg-gray-600"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												<span>👎</span>
												<span>{playlist.dislike || 0}</span>
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
