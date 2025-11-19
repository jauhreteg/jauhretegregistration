"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AnimatedBinaryBackground from "@/components/animated-binary-background";

// Modern Theme Toggle Icons
const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Automatically detect and follow system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleStartRegistration = () => {
    router.push("/register");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Animated Binary Background */}
      <AnimatedBinaryBackground
        textToConvert="JAUHR E TEG REGISTRATION"
        textColor={
          isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
        }
        glowColors={[
          isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(245, 166, 35, 0.8)",
          isDarkMode ? "rgba(245, 166, 35, 0.8)" : "rgba(0, 0, 0, 0.8)",
        ]}
        fontSize="10px"
        glowIntensity={8}
        glowInterval={200}
        glowDuration={800}
      />

      {/* Theme Toggle Button - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={toggleTheme}
          className={`
            p-3 rounded-full transition-all duration-75 hover:scale-110
            ${
              isDarkMode
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/10 text-black hover:bg-black/20"
            }
          `}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="flex items-center gap-12 max-w-4xl">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/jet-black.svg"
              alt="Jauhr E Teg Logo"
              width={200}
              height={200}
              className={`w-40 h-40 md:w-56 md:h-56 transition-all duration-75 ${
                isDarkMode ? "invert" : ""
              }`}
            />
          </div>

          {/* Content - Left Aligned */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase font-montserrat transition-colors duration-75">
                JAUHR E TEG
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase font-montserrat opacity-80 transition-colors duration-75">
                REGISTRATION
              </h2>
            </div>

            <Button
              onClick={handleStartRegistration}
              className={`
                px-6 py-3 text-base font-medium rounded-lg uppercase font-montserrat
                transition-all duration-75 transform hover:scale-105
                ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-[#F5A623] hover:text-white"
                    : "bg-black text-white hover:bg-[#F5A623] hover:text-white"
                }
              `}
            >
              START REGISTRATION
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p
          className={`text-xs text-center opacity-20 transition-colors duration-75 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          © 2017-{new Date().getFullYear()} Jauhr E Teg
        </p>
      </div>
    </div>
  );
}
