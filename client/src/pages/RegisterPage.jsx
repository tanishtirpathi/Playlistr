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
  <div
    className={`min-h-screen w-full flex  justify-center px-6 transition-colors ${
      isDark ? "bg-black" : "bg-white"
    }`}
  >
    <div className={`w-1/2 px-10  border-r border-l ${isDark ? "border-white/10" : "border-black/10"}`}>
      <h2
        className={`text-4xl font-bold text-center mt-8 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        Create Account
      </h2>

      {error && (
        <div className="mb-6 text-sm text-red-500 border border-red-500/40 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-15" >
        {/* Name */}
        <div>
          <label
            className={`block text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tony stark"
            required
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none ${
              isDark
                ? "bg-black border-white/20 text-white focus:border-white"
                : "bg-white border-gray-300 text-black focus:border-black"
            }`}
          />
        </div>

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
             placeholder="Ironman@gamil.com"
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none ${
              isDark
                 ? "bg-black border-white/20 text-white focus:border-white"
                : "bg-white border-gray-300 text-black focus:border-black"
            }`}
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
             placeholder="tauofbatman"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none ${
              isDark
                ? "bg-black border-white/20 text-white focus:border-white"
                : "bg-white border-gray-300 text-black focus:border-black"
            }`}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            isDark
              ? "bg-white text-black hover:opacity-90"
              : "bg-black text-white hover:opacity-90"
          } disabled:opacity-50`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>   <p
        className={`text-center mt-8 text-sm ${
          isDark ? "text-gray-500" : "text-gray-600"
        }`}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className={`font-semibold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Login
        </Link>
      </p>
      </form>

   
    </div>
  </div>
);
}
