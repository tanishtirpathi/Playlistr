x   import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Mock song data for demo - replace with actual Spotify API in production
const MOCK_SONGS = [
	{
		id: "1",
		name: "Blinding Lights",
		artist: "The Weeknd",
		album: "After Hours",
		duration: 200000,
		albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
	},
	{
		id: "2",
		name: "Shape of You",
		artist: "Ed Sheeran",
		album: "÷ (Divide)",
		duration: 233713,
		albumArt: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
	},
	{
		id: "3",
		name: "Someone Like You",
		artist: "Adele",
		album: "21",
		duration: 285000,
		albumArt: "https://i.scdn.co/image/ab67616d0000b273372eb0b6f6c0aecc26e96956",
	},
	{
		id: "4",
		name: "Bohemian Rhapsody",
		artist: "Queen",
		album: "A Night at the Opera",
		duration: 354000,
		albumArt: "https://i.scdn.co/image/ab67616d0000b2731e0e9564e1fba38c7f1c16fd",
	},
	{
		id: "5",
		name: "Levitating",
		artist: "Dua Lipa",
		album: "Future Nostalgia",
		duration: 203064,
		albumArt: "https://i.scdn.co/image/ab67616d0000b273be841ba4bc24340152e3a79a",
	},
	{
		id: "6",
		name: "Starboy",
		artist: "The Weeknd",
		album: "Starboy",
		duration: 230453,
		albumArt: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
	},
	{
		id: "7",
		name: "Thinking Out Loud",
		artist: "Ed Sheeran",
		album: "x",
		duration: 281560,
		albumArt: "https://i.scdn.co/image/ab67616d0000b273ba7fe7dd76cd4307e57dd75f",
	},
	{
		id: "8",
		name: "Rolling in the Deep",
		artist: "Adele",
		album: "21",
		duration: 228000,
		albumArt: "https://i.scdn.co/image/ab67616d0000b273372eb0b6f6c0aecc26e96956",
	},
];

export default function SongSearch({ onAddSong, existingSongs = [] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const { isDark } = useTheme();

	const formatDuration = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setSearching(true);

		// Simulate API delay
		setTimeout(() => {
			// Filter mock songs based on search query
			const results = MOCK_SONGS.filter(
				(song) =>
					song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
					song.album.toLowerCase().includes(searchQuery.toLowerCase())
			);

			setSearchResults(results);
			setSearching(false);
		}, 500);

		// For real Spotify API integration:
		// try {
		//   const results = await spotifyAPI.searchTracks(searchQuery, accessToken);
		//   setSearchResults(results);
		// } catch (error) {
		//   console.error("Search error:", error);
		// } finally {
		//   setSearching(false);
		// }
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
								<img
									src={song.albumArt}
									alt={song.album}
									className="w-12 h-12 rounded object-cover"
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

			{searchQuery && searchResults.length === 0 && !searching && (
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
