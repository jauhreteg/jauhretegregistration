import { FormData, PlayerData, PlayerType, TeamData } from "@/types/form-types";

// Validation utility functions
export const validateEmail = (email: string): string | null => {
  if (!email) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : "Please enter a valid email address";
};

export const validatePhoneNumber = (
  phone: string,
  countryCode: string
): string | null => {
  if (!phone) return null;

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, "");

  // Basic phone number validation based on country code
  const phoneValidation = {
    "+1": { min: 10, max: 10, name: "US/Canada" }, // (XXX) XXX-XXXX
    "+44": { min: 10, max: 11, name: "UK" },
    "+91": { min: 10, max: 10, name: "India" },
    "+61": { min: 9, max: 9, name: "Australia" },
    "+33": { min: 9, max: 9, name: "France" },
    "+49": { min: 10, max: 12, name: "Germany" },
    "+81": { min: 10, max: 11, name: "Japan" },
    "+86": { min: 11, max: 11, name: "China" },
  };

  const validation =
    phoneValidation[countryCode as keyof typeof phoneValidation];
  if (!validation) {
    // Generic validation for other countries
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return "Phone number should be between 7-15 digits";
    }
    return null;
  }

  if (
    cleanPhone.length < validation.min ||
    cleanPhone.length > validation.max
  ) {
    return `Phone number for ${validation.name} should be ${validation.min}${
      validation.min !== validation.max ? `-${validation.max}` : ""
    } digits`;
  }

  return null;
};

// Helper functions to extract player data from form data
export const getPlayerData = (
  formData: FormData,
  playerType: PlayerType
): PlayerData => {
  const prefix = playerType === "backup" ? "backup" : playerType;

  return {
    firstName: formData[`${prefix}FirstName` as keyof FormData] as string,
    middleName: formData[`${prefix}MiddleName` as keyof FormData] as string,
    lastName: formData[`${prefix}LastName` as keyof FormData] as string,
    singhKaur: formData[`${prefix}SinghKaur` as keyof FormData] as string,
    email: formData[`${prefix}Email` as keyof FormData] as string,
    phone: formData[`${prefix}Phone` as keyof FormData] as string,
    countryCode: formData[`${prefix}CountryCode` as keyof FormData] as string,
    dob: formData[`${prefix}DOB` as keyof FormData] as string,
    proofOfAge: formData[
      `${prefix}ProofOfAge` as keyof FormData
    ] as File | null,
    emergencyContactFirstName: formData[
      `${prefix}EmergencyContactFirstName` as keyof FormData
    ] as string,
    emergencyContactMiddleName: formData[
      `${prefix}EmergencyContactMiddleName` as keyof FormData
    ] as string,
    emergencyContactLastName: formData[
      `${prefix}EmergencyContactLastName` as keyof FormData
    ] as string,
    emergencyContactPhone: formData[
      `${prefix}EmergencyContactPhone` as keyof FormData
    ] as string,
    emergencyContactCountryCode: formData[
      `${prefix}EmergencyContactCountryCode` as keyof FormData
    ] as string,
    fatherFirstName: formData[
      `${prefix}FatherFirstName` as keyof FormData
    ] as string,
    fatherMiddleName: formData[
      `${prefix}FatherMiddleName` as keyof FormData
    ] as string,
    fatherLastName: formData[
      `${prefix}FatherLastName` as keyof FormData
    ] as string,
    motherFirstName: formData[
      `${prefix}MotherFirstName` as keyof FormData
    ] as string,
    motherMiddleName: formData[
      `${prefix}MotherMiddleName` as keyof FormData
    ] as string,
    motherLastName: formData[
      `${prefix}MotherLastName` as keyof FormData
    ] as string,
    pindVillage: formData[`${prefix}PindVillage` as keyof FormData] as string,
    gatkaExperience: formData[
      `${prefix}GatkaExperience` as keyof FormData
    ] as string,
  };
};

// Helper function to extract team data from form data
export const getTeamData = (formData: FormData): TeamData => {
  return {
    teamName: formData.teamName,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    ustadName: formData.ustadName,
    ustadEmail: formData.ustadEmail,
    seniorGatkaiName: formData.seniorGatkaiName,
    seniorGatkaiEmail: formData.seniorGatkaiEmail,
    division: formData.division,
    playerOrder1: formData.playerOrder1,
    playerOrder2: formData.playerOrder2,
    playerOrder3: formData.playerOrder3,
    teamPhotos: formData.teamPhotos,
  };
};

// Helper function to get player names for order selection
export const getPlayerNames = (formData: FormData) => {
  const getPlayerDisplayName = (playerType: PlayerType) => {
    const playerData = getPlayerData(formData, playerType);
    const firstName = playerData.firstName.trim();
    const lastName = playerData.lastName.trim();
    const singhKaur = playerData.singhKaur.trim();

    // Build the full name with Singh/Kaur suffix
    const nameParts = [];
    if (firstName) nameParts.push(firstName);
    if (lastName) nameParts.push(lastName);
    if (singhKaur) nameParts.push(singhKaur);

    if (nameParts.length > 0) {
      return nameParts.join(" ");
    }

    // Fallback to generic names
    switch (playerType) {
      case "player1":
        return "Player 1";
      case "player2":
        return "Player 2";
      case "player3":
        return "Player 3";
      default:
        return "Player";
    }
  };

  return {
    player1: getPlayerDisplayName("player1"),
    player2: getPlayerDisplayName("player2"),
    player3: getPlayerDisplayName("player3"),
  };
};

// Scroll to top utility function
export const scrollToTop = (behavior: "auto" | "smooth" = "smooth") => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
};
