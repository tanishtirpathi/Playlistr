import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
	const [formData, setFormData] = useState({
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
			const response = await authAPI.login(formData);
			if (response.data.success) {
				login(response.data.data.user);
				navigate("/");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
  <div
    className={`min-h-screen w-full flex items-center justify-center px-6 ${
      isDark ? "bg-black" : "bg-white"
    }`}
  >
    <div className="w-full max-w-md">
      <h2
        className={`text-4xl font-bold text-center mb-10 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        Welcome Back
      </h2>

      {error && (
        <div className="mb-6 text-sm text-red-500 border border-red-500/40 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label
            className={`block text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              isDark
                ? "bg-black border-white/20 text-white focus:border-white"
                : "bg-white border-gray-300 text-black focus:border-black"
            } focus:outline-none`}
          />
        </div>

        {/* Password */}
        <div>
          <label
            className={`block text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              isDark
                ? "bg-black border-white/20 text-white focus:border-white"
                : "bg-white border-gray-300 text-black focus:border-black"
            } focus:outline-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            isDark
              ? "bg-white text-black hover:opacity-90"
              : "bg-black text-white hover:opacity-90"
          } disabled:opacity-50`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        className={`text-center mt-8 text-sm ${
          isDark ? "text-gray-500" : "text-gray-600"
        }`}
      >
        Don’t have an account?{" "}
        <Link
          to="/register"
          className={`font-semibold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Register
        </Link>
      </p>
    </div>
  </div>
);
}
