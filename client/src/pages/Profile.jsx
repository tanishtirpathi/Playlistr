import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThreeDCardDemo from "../components/3d-card-demo";
function Profile() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen flex  justify-center px-6 transition-colors border-l border-r ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`w-1/2 p-8 space-y-6 border-l border-r  ${
          isDark ? "bg-transparent text-white border-white/15" : "bg-transparent border-black/15 text-black"
        }`}
      >
     <ThreeDCardDemo/>
      </div>
    </div>
  );
}

export default Profile;