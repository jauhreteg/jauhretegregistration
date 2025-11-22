// Form Configuration
export const FORM_CONSTANTS = {
  TOTAL_STEPS: 5,
  STEP_LABELS: [
    "PLAYER 1",
    "PLAYER 2",
    "PLAYER 3",
    "BACKUP PLAYER",
    "TEAM INFO",
  ],
  DEFAULT_COUNTRY_CODE: "+1",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  THEME_SELECTOR_POSITION: "fixed bottom-6 right-6 z-50",
  BRAND_COLOR: "#F5A623",
  ANIMATION_DURATION: {
    FAST: "duration-75",
    NORMAL: "duration-300",
  },
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  BACKUP_DECISION_REQUIRED: "Backup Player Decision",
  FORM_SUBMISSION_SUCCESS: "Form submitted successfully!",
  FORM_SUBMISSION_ERROR: "Form submission failed. Please try again.",
} as const;

// Step Configuration
export const FORM_STEPS = {
  PLAYER_1: 1,
  PLAYER_2: 2,
  PLAYER_3: 3,
  BACKUP_PLAYER: 4,
  TEAM_INFO: 5,
} as const;
