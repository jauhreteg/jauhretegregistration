"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { activeConfig } from "@/config/website";

type Theme = "light" | "dark";
type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  false: boolean;
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    activeConfig.theme.defaultTheme
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    activeConfig.theme.defaultTheme
  );

  useEffect(() => {
    // If dark mode functionality is disabled, force light theme
    if (!activeConfig.theme.enableDarkMode) {
      setThemeState("light");
      setThemeModeState("light");
      return;
    }

    // Check for saved theme mode preference
    const savedMode = localStorage.getItem(
      "jauhr-e-teg-theme-mode"
    ) as ThemeMode;

    if (savedMode && activeConfig.theme.enableThemeToggle) {
      setThemeModeState(savedMode);

      if (
        savedMode === "system" &&
        activeConfig.theme.enableAutoThemeDetection
      ) {
        // Follow system preference
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setThemeState(mediaQuery.matches ? "dark" : "light");

        const handleChange = (e: MediaQueryListEvent) => {
          const currentMode = localStorage.getItem("jauhr-e-teg-theme-mode");
          if (currentMode === "system") {
            setThemeState(e.matches ? "dark" : "light");
          }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else if (savedMode === "light" || savedMode === "dark") {
        // Manual theme mode (light or dark)
        setThemeState(savedMode);
      }
    } else if (activeConfig.theme.enableAutoThemeDetection) {
      // Default to system preference
      setThemeModeState("system");
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setThemeState(mediaQuery.matches ? "dark" : "light");

      const handleChange = (e: MediaQueryListEvent) => {
        const currentMode = localStorage.getItem("jauhr-e-teg-theme-mode");
        if (!currentMode || currentMode === "system") {
          setThemeState(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Use config default
      setThemeState(activeConfig.theme.defaultTheme);
      setThemeModeState(activeConfig.theme.defaultTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    // Don't allow theme changes if dark mode is disabled or theme toggle is disabled
    if (
      !activeConfig.theme.enableDarkMode ||
      !activeConfig.theme.enableThemeToggle
    ) {
      return;
    }

    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setThemeModeState(newTheme);
    localStorage.setItem("jauhr-e-teg-theme-mode", newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    // Don't allow theme changes if dark mode is disabled or theme toggle is disabled
    if (
      !activeConfig.theme.enableDarkMode ||
      !activeConfig.theme.enableThemeToggle
    ) {
      return;
    }

    setThemeState(newTheme);
    setThemeModeState(newTheme);
    localStorage.setItem("jauhr-e-teg-theme-mode", newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    // Don't allow theme changes if dark mode is disabled or theme toggle is disabled
    if (
      !activeConfig.theme.enableDarkMode ||
      !activeConfig.theme.enableThemeToggle
    ) {
      return;
    }

    setThemeModeState(mode);
    localStorage.setItem("jauhr-e-teg-theme-mode", mode);

    if (mode === "system" && activeConfig.theme.enableAutoThemeDetection) {
      // Clear any saved theme and follow system
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setThemeState(mediaQuery.matches ? "dark" : "light");
    } else if (mode === "light" || mode === "dark") {
      // Set specific theme
      setThemeState(mode);
    }
  };

  const value = {
    false: theme === "dark",
    theme,
    themeMode,
    toggleTheme,
    setTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
