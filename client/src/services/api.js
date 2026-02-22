import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

export const authAPI = {
	register: (data) => apiClient.post("/users/register", data),
	login: (data) => apiClient.post("/users/login", data),
	logout: (data) => apiClient.post("/users/logout", data),
	refreshToken: (data) => apiClient.post("/users/refresh-token", data),
};

export const playlistAPI = {
	createPlaylist: (data) => apiClient.post("/playlists/create", data),
	deletePlaylist: (playlistId) =>
		apiClient.delete(`/playlists/delete/${playlistId}`),
	getAllPlaylists: (params) => apiClient.get("/playlists/all", { params }),
	getTopPlaylists: (params) => apiClient.get("/playlists/top", { params }),
	getPlaylistById: (playlistId) => apiClient.get(`/playlists/${playlistId}`),
	addSongToPlaylist: (playlistId, songData) =>
		apiClient.post(`/playlists/${playlistId}/add-song`, songData),
	removeSongFromPlaylist: (playlistId, songId) =>
		apiClient.delete(`/playlists/${playlistId}/remove-song/${songId}`),
	likePlaylist: (playlistId) =>
		apiClient.post(`/playlists/${playlistId}/like`),
	dislikePlaylist: (playlistId) =>
		apiClient.post(`/playlists/${playlistId}/dislike`),
};

// Spotify Search API (client-side only, for demo purposes)
// In production, this should go through your backend
export const spotifyAPI = {
	searchTracks: async (query, accessToken) => {
		try {
			const response = await axios.get(
				`https://api.spotify.com/v1/search`,
				{
					params: {
						q: query,
						type: "track",
						limit: 10,
					},
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			return response.data.tracks.items;
		} catch (error) {
			console.error("Spotify search error:", error);
			throw error;
		}
	},
};

export default apiClient;
