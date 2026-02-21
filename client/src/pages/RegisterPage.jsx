import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login, user } = useAuth();
	const { isDark } = useTheme();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await authAPI.register(formData);
			if (response.data.success) {
				login(response.data.data.user);
				navigate("/");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDark ? "bg-gradient-to-br from-black via-gray-900 to-purple-900" : "bg-gradient-to-br from-purple-100 via-white to-blue-100"}`}>
			<div className={`rounded-lg shadow-lg p-8 w-full max-w-md transition-colors ${isDark ? "bg-gray-800" : "bg-white"}`}>
				<h2 className={`text-3xl font-bold text-center mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>Register</h2>

				{error && (
				<div className={`mb-4 p-3 border rounded ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
							Name
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
							required
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
							required
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-white text-gray-900"}`}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<p className={`text-center mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
					Already have an account?{" "}
					<Link to="/login" className="text-purple-600 font-semibold hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
