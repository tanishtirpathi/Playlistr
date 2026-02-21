import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePlaylistPage from "./pages/CreatePlaylistPage";
import TopPlaylistsPage from "./pages/TopPlaylistsPage";

function AppRoutes() {
	const { user } = useAuth();

	return (
		<Routes>
			{/* Home route - shows Dashboard if logged in, HomePage if not */}
			<Route path="/" element={user ? <DashboardPage /> : <HomePage />} />
			
			{/* Auth routes */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			
			{/* Playlist routes */}
			<Route path="/create-playlist" element={<CreatePlaylistPage />} />
			<Route path="/top-playlists" element={<TopPlaylistsPage />} />
			
			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AuthProvider>
					<Navbar />
					<AppRoutes />
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
