import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { playlistAPI } from "../services/api";

export default function SongSearch({ onAddSong, existingSongs = [] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState("");
	const { isDark } = useTheme();

	const formatDuration = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setSearching(true);
		setError("");

		try {
			const response = await playlistAPI.searchSpotifyTracks(searchQuery);
			if (response.data.success) {
				setSearchResults(response.data.data);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to search tracks");
			setSearchResults([]);
		} finally {
			setSearching(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const isSongAdded = (songId) => {
		return existingSongs.some((s) => s.spotifyId === songId);
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Search for songs by name, artist, or album..."
					className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
						isDark
							? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
							: "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
					}`}
				/>
				<button
					onClick={handleSearch}
					disabled={searching || !searchQuery.trim()}
					className={`px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${
						isDark
							? "bg-purple-600 text-white hover:bg-purple-700"
							: "bg-purple-600 text-white hover:bg-purple-700"
					}`}
				>
					{searching ? "Searching..." : "Search"}
				</button>
			</div>

			{error && (
				<div
					className={`p-3 rounded-lg ${
						isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"
					}`}
				>
					{error}
				</div>
			)}

			{searchResults.length > 0 && (
				<div
					className={`rounded-lg border ${
						isDark ? "border-gray-700" : "border-gray-300"
					} max-h-96 overflow-y-auto`}
				>
					{searchResults.map((song) => (
						<div
							key={song.id}
							className={`p-3 border-b last:border-b-0 flex items-center justify-between transition ${
								isDark
									? "border-gray-700 hover:bg-gray-800"
									: "border-gray-200 hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center gap-3 flex-1">
								{song.albumArt && (
									<img
										src={song.albumArt}
										alt={song.album}
										className="w-12 h-12 rounded object-cover"
									/>
								)}
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
										{song.artist} • {song.album}
									</p>
									<p
										className={`text-xs ${
											isDark ? "text-gray-500" : "text-gray-500"
										}`}
									>
										{formatDuration(song.duration)}
									</p>
								</div>
							</div>
							<button
								onClick={() => onAddSong(song)}
								disabled={isSongAdded(song.id)}
								className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
									isSongAdded(song.id)
										? "bg-gray-500 text-white cursor-not-allowed opacity-50"
										: isDark
										? "bg-green-600 text-white hover:bg-green-700"
										: "bg-green-500 text-white hover:bg-green-600"
								}`}
							>
								{isSongAdded(song.id) ? "Added" : "Add"}
							</button>
						</div>
					))}
				</div>
			)}

			{searchQuery && searchResults.length === 0 && !searching && !error && (
				<p
					className={`text-center py-4 ${
						isDark ? "text-gray-400" : "text-gray-600"
					}`}
				>
					No songs found matching "{searchQuery}"
				</p>
			)}
		</div>
	);
}
