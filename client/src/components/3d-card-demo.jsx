import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function ProfileCard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex justify-center items-center min-h-full">
      <CardContainer className="inter-var">
        <CardBody
          className={`relative group/card w-[30rem] rounded-2xl overflow-hidden border transition-all duration-300
          ${
            isDark
              ? "bg-white/80 border-zinc-800 shadow-2xl shadow-black/40"
              : "bg-black/90 border-gray-200 shadow-xl shadow-gray-300"
          }`}
        >
          {/* Cover Banner */}
          <CardItem translateZ="80" className="relative h-40 w-full">
            <img
              src={isDark ? "/covern.jpg" : "/coverm.jpg"}
              alt="cover"
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </CardItem>

          {/* Content */}
          <div className="p-8 -mt-6 relative z-10">
            {/* Name */}
            <CardItem
              translateZ="60"
              className={`text-2xl  instrument-serif-regular-italic ${
                isDark ? "text-black" : "text-white/90"
              }`}
            >
              {user?.name || "Unknown User"}
            </CardItem>

            {/* Email */}
            <CardItem
              as="p"
              translateZ="50"
              className={`text-sm mt-1 instrument-serif-regular-italic ${
                isDark ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {user?.email || "No email available"}
            </CardItem>

            {/* Divider */}
            <div
              className={`my-6 border-t ${
                isDark ? "border-zinc-700" : "border-gray-300"
              }`}
            ></div>

            {/* Buttons */}
            <div className="flex gap-4">
              <CardItem
                translateZ={30}
                as="button"
                onClick={toggleTheme}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105
                ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </CardItem>

              <CardItem
                translateZ={30}
                as="button"
                onClick={logout}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-105"
              >
                Logout
              </CardItem>
            </div>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
