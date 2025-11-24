"use client";

import { useTheme } from "@/contexts/theme-context";
import { activeConfig } from "@/config/website";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

export default function ThemeSelector() {
  const { isDarkMode, themeMode, setThemeMode } = useTheme();

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const getCurrentIcon = () => {
    switch (themeMode) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
      default:
        return isDarkMode ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        );
    }
  };

  // Don't render if dark mode is completely disabled or theme toggle is disabled
  if (
    !activeConfig.theme.enableDarkMode ||
    !activeConfig.theme.enableThemeToggle ||
    !activeConfig.theme.showThemeSelectorButton
  ) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`
            rounded-full transition-all font-montserrat ${
              activeConfig.effects.enableFastTransitions
                ? "duration-75"
                : "duration-300"
            } hover:scale-110
            ${
              isDarkMode
                ? "bg-white/10 text-white hover:bg-white/20 hover:text-white"
                : "bg-black/10 text-black hover:bg-black/20 hover:text-black"
            }
          `}
          aria-label="Change theme"
        >
          {getCurrentIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className={`w-40 ${
          isDarkMode
            ? "bg-black border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={`flex items-center gap-2 cursor-pointer ${
            themeMode === "light"
              ? "bg-[#F5A623]/20 text-[#F5A623]"
              : isDarkMode
              ? "hover:bg-white hover:text-black"
              : "hover:bg-gray-100"
          }`}
        >
          <Sun className="w-4 h-4" />
          Light
        </DropdownMenuItem>
        {activeConfig.theme.enableDarkMode && (
          <DropdownMenuItem
            onClick={() => handleThemeChange("dark")}
            className={`flex items-center gap-2 cursor-pointer ${
              themeMode === "dark"
                ? "bg-[#F5A623]/20 text-[#F5A623]"
                : isDarkMode
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            }`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </DropdownMenuItem>
        )}
        {activeConfig.theme.enableAutoThemeDetection && (
          <DropdownMenuItem
            onClick={() => handleThemeChange("system")}
            className={`flex items-center gap-2 cursor-pointer ${
              themeMode === "system"
                ? "bg-[#F5A623]/20 text-[#F5A623]"
                : isDarkMode
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            }`}
          >
            <Monitor className="w-4 h-4" />
            System
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
