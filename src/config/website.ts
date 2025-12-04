// Website Configuration
// Toggle various UI/UX features on and off

export interface WebsiteConfig {
  // Background Features
  background: {
    enableBinaryAnimation: boolean;
    enableRadialFade: boolean;
    binaryText: string;
    animationSpeed: number; // milliseconds between glow effects
    glowIntensity: number; // number of simultaneous glowing digits
  };

  // Theme Features
  // To completely disable dark mode: set enableDarkMode to false
  // To hide theme selector but keep programmatic theme switching: set showThemeSelectorButton to false
  // To disable user theme changes entirely: set enableThemeToggle to false
  theme: {
    enableDarkMode: boolean; // Master switch for all dark mode functionality
    enableThemeToggle: boolean; // Allow users to manually change themes
    enableAutoThemeDetection: boolean; // Auto-detect user's system preference
    defaultTheme: "light" | "dark"; // Default theme when auto-detection is off
    showThemeSelectorButton: boolean; // Control visibility of theme selector UI
  };

  // Registration Features
  registration: {
    enableTermsPopup: boolean;
    requireBothAgreements: boolean;
    showFullTermsLinks: boolean;
  };

  // Visual Effects
  effects: {
    enableButtonHoverAnimation: boolean;
    enableLogoInversion: boolean;
    enableFastTransitions: boolean; // 75ms vs 300ms transitions
  };

  // Layout
  layout: {
    showCopyrightText: boolean;
    enableResponsiveSizing: boolean;
    centerContent: boolean;
  };
}

// Default configuration - modify these values to change website behavior
export const websiteConfig: WebsiteConfig = {
  background: {
    enableBinaryAnimation: true,
    enableRadialFade: true,
    binaryText: "JAUHR E TEG",
    animationSpeed: 200,
    glowIntensity: 8,
  },

  theme: {
    enableDarkMode: false, // Master switch for all dark theme functionality
    enableThemeToggle: false, // Enable theme switching capability
    enableAutoThemeDetection: false, // Auto-detect system preference
    defaultTheme: "light", // Default theme
    showThemeSelectorButton: false, // Show the theme selector button in UI
  },

  registration: {
    enableTermsPopup: true,
    requireBothAgreements: true,
    showFullTermsLinks: true,
  },

  effects: {
    enableButtonHoverAnimation: true,
    enableLogoInversion: true,
    enableFastTransitions: true,
  },

  layout: {
    showCopyrightText: true,
    enableResponsiveSizing: true,
    centerContent: true,
  },
};

// Quick presets for different configurations
export const configPresets = {
  // Full-featured experience
  full: websiteConfig,

  // Minimal - no animations or extra features
  minimal: {
    ...websiteConfig,
    background: {
      ...websiteConfig.background,
      enableBinaryAnimation: false,
      enableRadialFade: false,
    },
    effects: {
      ...websiteConfig.effects,
      enableButtonHoverAnimation: false,
      enableFastTransitions: false,
    },
  },

  // Performance - faster load times
  performance: {
    ...websiteConfig,
    background: {
      ...websiteConfig.background,
      enableBinaryAnimation: false,
    },
    effects: {
      ...websiteConfig.effects,
      enableFastTransitions: true,
    },
  },

  // Demo mode - all features visible
  demo: {
    ...websiteConfig,
    background: {
      ...websiteConfig.background,
      animationSpeed: 100,
      glowIntensity: 15,
    },
  },
};

// Use this to switch between presets quickly
export const activeConfig = configPresets.full;
