import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { authAPI } from "../services/api";

export default function Navbar() {
	const { user, logout } = useAuth();
	const { isDark, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			if (refreshToken) {
				await authAPI.logout({ refreshToken });
			}
			logout();
			navigate("/");
		} catch (err) {
			console.error("Logout failed:", err);
			logout();
			navigate("/");
		}
	};

	return (
		<nav
			className={` transition-colors duration-300 ${
				isDark
					? "bg-black text-white"
					: "bg-white text-black"
			}`}
		>
			<div className="w-1/2  mx-auto px-6 h-16 flex items-center justify-between">
				
				{/* Logo */}
				<Link
					to="/"
					className="text-xl font-semibold tracking-tight hover:opacity-80 transition"
				>
					Playlistr
				</Link>

				{/* Right Side */}
				<div className="flex items-center gap-8 text-sm font-medium">
					{user ? (
						<>
							<Link
								to="/"
								className="hover:opacity-70 transition"
							>
								Dashboard
							</Link>

							<Link
								to="/create-playlist"
								className="hover:opacity-70 transition"
							>
								Create
							</Link>

							<Link
								to="/top-playlists"
								className="hover:opacity-70 transition"
							>
								Trending
							</Link>

							<span className="text-gray-400">
								{user.name}
							</span>

							<button
								onClick={handleLogout}
								className="px-4 py-1.5 rounded-md border border-gray-700 hover:bg-gray-800 transition"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="hover:opacity-70 transition bg-white text-black px-4 py-1.5 rounded-md "
							>
								Login
							</Link>

							<Link
								to="/register"
								className="px-4 py-1.5 rounded-md bg-black text-white hover:opacity-90 transition"
							>
								Register
							</Link>
						</>
					)}

					{/* Theme Toggle */}
					<button
						onClick={toggleTheme}
						className={`w-9 h-9 flex items-center justify-center rounded-md border transition ${
							isDark
								? "border-gray-700 hover:bg-gray-800"
								: "border-gray-100 hover:bg-gray-100"
						}`}
					>
						{isDark ? "☀" : "☾"}
					</button>
				</div>
			</div>
		</nav>
	);
}