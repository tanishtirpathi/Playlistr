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
};

export default apiClient;
