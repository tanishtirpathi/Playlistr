import { useState, useEffect } from "react";
import { playlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await playlistAPI.getAllPlaylists({ page, limit: 10 });
        if (response.data.success) {
          setPlaylists(response.data.data.playlists);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [page]);

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

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${isDark ? "bg-gradient-to-br from-black via-gray-900 to-purple-900" : "bg-gradient-to-br from-purple-100 via-white to-blue-100"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            My Playlists
          </h1>
          <Link
            to="/create-playlist"
            className={`px-6 py-2 rounded-lg font-semibold transition ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}
            Create
            Playlist
          />
        </div>
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
        {loading ? (
          <div
            className={`text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Loading playlists...
          </div>
        ) : playlists.length === 0 ? (
          <div
            className={`text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            <p className="text-xl mb-4">No playlists yet</p>
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
                <h2
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  {playlist.title}
                </h2>
                <p
                  className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  By {playlist.owner?.name || "Unknown"}
                </p>
                {playlist.description && (
                  <p
                    className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
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
                <p
                  className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Likes: {playlist.like || 0}
                </p>
                {user?.id === playlist.owner?._id && (
                  <button
                    onClick={() => handleDelete(playlist._id)}
                    className={`w-full py-2 rounded transition ${isDark ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
