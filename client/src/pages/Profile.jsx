import { useTheme } from "../context/ThemeContext";
import ProfileCard from "../components/3d-card-demo";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { isDark } = useTheme();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div
      className={`min-h-screen flex  justify-center px-6 transition-colors border-l border-r ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`w-1/2 p-8 space-y-6 border-l border-r  ${
          isDark
            ? "bg-transparent text-white border-white/15"
            : "bg-transparent border-black/15 text-black"
        }`}
      >
        <ProfileCard />
      </div>
    </div>
  );
}

export default Profile;
