import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function PlaylistSongs({ playlist, onRemoveSong }) {
	const { isDark } = useTheme();
	const { user } = useAuth();
	const isOwner = user?.id === playlist?.owner?._id || user?.id === playlist?.owner?.id;

	const formatDuration = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	if (!playlist?.songs || playlist.songs.length === 0) {
		return (
			<div
				className={`text-center py-8 ${
					isDark ? "text-gray-400" : "text-gray-600"
				}`}
			>
				<p>No songs in this playlist yet</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<h3
				className={`text-lg font-semibold mb-4 ${
					isDark ? "text-white" : "text-gray-800"
				}`}
			>
				Songs ({playlist.songs.length})
			</h3>
			<div
				className={`rounded-lg border ${
					isDark ? "border-gray-700" : "border-gray-300"
				} overflow-hidden`}
			>
				{playlist.songs.map((song, index) => (
					<div
						key={song._id || song.spotifyId}
						className={`p-3 border-b last:border-b-0 flex items-center justify-between transition ${
							isDark
								? "border-gray-700 hover:bg-gray-800"
								: "border-gray-200 hover:bg-gray-50"
						}`}
					>
						<div className="flex items-center gap-3 flex-1">
							<span
								className={`font-semibold text-sm w-6 text-center ${
									isDark ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{index + 1}
							</span>
							{song.albumArt && (
								<img
									src={song.albumArt}
									alt={song.album || "Album"}
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
									{song.artist}
									{song.album && ` • ${song.album}`}
								</p>
							</div>
							<span
								className={`text-sm ${
									isDark ? "text-gray-500" : "text-gray-500"
								}`}
							>
								{formatDuration(song.duration)}
							</span>
						</div>
						{isOwner && onRemoveSong && (
							<button
								onClick={() => onRemoveSong(song._id || song.spotifyId)}
								className={`ml-3 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
									isDark
										? "bg-red-600 text-white hover:bg-red-700"
										: "bg-red-500 text-white hover:bg-red-600"
								}`}
							>
								Remove
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
