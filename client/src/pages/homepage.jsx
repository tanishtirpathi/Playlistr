import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function HomePage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex justify-center px-6 transition-colors ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`w-full md:w-1/2 border-l border-r px-10 md:p-14  backdrop-blur-md transition ${
          isDark ? "border-white/9 bg-black/60" : "border-black/5 bg-white/70"
        }`}
      >
        <h1 className="text-5xl md:text-6xl instrument-serif-regular-italic tracking-tight mb-5 text-center">
          Playlistr
        </h1>

        <p
          className={`text-base md:text-lg text-center mb-10 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <span>
            {" "}
            Discover and explore{" "}
            <span className="instrument-serif-regular-italic text-[#13a25d]">
              Spotify{" "}
            </span>{" "}
            playlist scurated by real people, not algorithms.
          </span>
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/login"
            className={`px-6 py-3 rounded-md border font-bold transition-all duration-300 ${
              isDark
                ? "bg-white/90  text-black hover:bg-white shadow-xl backdrop-blur-md"
                : "bg-transparent  text-black border-transparent"
            }`}
          >
            Login
          </Link>

          <Link
            to="/register"
            className={`px-6 py-3 rounded-md border shadow-xl backdrop-blur-md  transition-all duration-300 ${
              isDark
                ? "bg-transparent text-white hover:bg-white/30 border-transparent "
                : "bg-black/90 text-white hover:bg-black"
            }`}
          >
            Create Account
          </Link>
        </div>

        <div
          className={`border rounded-lg overflow-hidden ${
            isDark ? "border-gray-800" : "border-gray-300"
          }`}
        >
          <iframe
            src="https://www.youtube.com/embed/3tHOChskWl8?si=VkUBySClK7rvgtN2"
            title="Playlistr intro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-54 md:h-70"
          />
        </div>

        <div className="flex flex-col justify-center items-center mt-10 text-sm text-gray-500">
          <span>
            Design & Developed by
            <a
              href="https://tanishtirpathi.me"
              target="_blank"
              className={`ml-1 font-bold transition-colors  instrument-serif-regular-italic ${
                isDark
                  ? "text-white "
                  : "text-black "
              }`}
            >
              Tanish Tiprpathi
            </a>
          </span>
          <span>© 2026. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
