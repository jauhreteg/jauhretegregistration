import { Ustad } from "@/types/database";

/**
 * Utility functions for handling multiple ustads functionality
 */

/**
 * Formats ustads array for display in tables/lists as comma-separated names
 * Used for tooltips and condensed display formats
 * @param ustads Array of ustad objects
 * @returns Comma-separated string of ustad names
 */
export const formatUstadsDisplay = (ustads: Ustad[] | null): string => {
  if (!ustads || ustads.length === 0) {
    return "None";
  }

  return ustads.map((ustad) => ustad.name).join(", ");
};

/**
 * Formats ustads array for PDF generation as "Name (email)" format with line breaks
 * @param ustads Array of ustad objects
 * @returns HTML string formatted as "Name1 (email1)<br>Name2 (email2)" or "None" if empty
 */
export const formatUstadsForPDF = (ustads: Ustad[] | null): string => {
  if (!ustads || ustads.length === 0) {
    return "None";
  }

  return ustads.map((ustad) => `${ustad.name} (${ustad.email})`).join("<br>");
};

/**
 * Creates tooltip content for ustads display showing names and emails
 * @param ustads Array of ustad objects
 * @returns HTML string for tooltip content
 */
export const formatUstadsTooltip = (ustads: Ustad[] | null): string => {
  if (!ustads || ustads.length === 0) {
    return "No ustads assigned";
  }

  return ustads.map((ustad) => `${ustad.name}: ${ustad.email}`).join("\n");
};

/**
 * Formats ustads array for CSV export using comma separator
 * @param ustads Array of ustad objects
 * @returns Comma-separated string formatted as "Name1 (email1), Name2 (email2)" or "None" if empty
 */
export const formatUstadsForCSV = (ustads: Ustad[] | null): string => {
  if (!ustads || ustads.length === 0) {
    return "None";
  }

  return ustads.map((ustad) => `${ustad.name} (${ustad.email})`).join(", ");
};

/**
 * Validates an array of ustads for frontend form validation
 * @param ustads Array of ustad objects to validate
 * @returns Array of validation error messages (empty if valid)
 */
export const validateUstadsArray = (ustads: Ustad[]): string[] => {
  const errors: string[] = [];

  // Check maximum limit
  if (ustads.length > 5) {
    errors.push("Maximum 5 ustads allowed per registration");
  }

  // Check for empty ustads
  if (ustads.length === 0) {
    errors.push("At least one ustad is required");
  }

  // Track emails for uniqueness validation
  const emailSet = new Set<string>();
  const nameSet = new Set<string>();

  ustads.forEach((ustad, index) => {
    const ustadPosition = `Ustad ${index + 1}`;

    // Validate name
    if (!ustad.name || ustad.name.trim() === "") {
      errors.push(`${ustadPosition}: Name is required`);
    } else if (ustad.name.trim().length < 2) {
      errors.push(`${ustadPosition}: Name must be at least 2 characters long`);
    } else {
      const trimmedName = ustad.name.trim().toLowerCase();
      if (nameSet.has(trimmedName)) {
        errors.push(`${ustadPosition}: Duplicate name "${ustad.name}"`);
      }
      nameSet.add(trimmedName);
    }

    // Validate email
    if (!ustad.email || ustad.email.trim() === "") {
      errors.push(`${ustadPosition}: Email is required`);
    } else if (!isValidEmail(ustad.email)) {
      errors.push(`${ustadPosition}: Invalid email format`);
    } else {
      const normalizedEmail = ustad.email.trim().toLowerCase();
      if (emailSet.has(normalizedEmail)) {
        errors.push(`${ustadPosition}: Duplicate email "${ustad.email}"`);
      }
      emailSet.add(normalizedEmail);
    }
  });

  return errors;
};

/**
 * Validates a single ustad object
 * @param ustad Ustad object to validate
 * @returns Validation error message or null if valid
 */
export const validateSingleUstad = (ustad: Ustad): string | null => {
  if (!ustad.name || ustad.name.trim() === "") {
    return "Name is required";
  }

  if (ustad.name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!ustad.email || ustad.email.trim() === "") {
    return "Email is required";
  }

  if (!isValidEmail(ustad.email)) {
    return "Invalid email format";
  }

  return null;
};

/**
 * Checks if an email address is valid
 * @param email Email string to validate
 * @returns True if email is valid format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Creates an empty ustad object for form initialization
 * @returns Empty Ustad object with default values
 */
export const createEmptyUstad = (): Ustad => ({
  name: "",
  email: "",
});

/**
 * Normalizes ustads array by trimming whitespace and filtering out completely empty entries
 * @param ustads Array of ustad objects
 * @returns Cleaned array of ustads
 */
export const normalizeUstadsArray = (ustads: Ustad[]): Ustad[] => {
  return ustads
    .map((ustad) => ({
      name: ustad.name?.trim() || "",
      email: ustad.email?.trim() || "",
    }))
    .filter((ustad) => ustad.name !== "" || ustad.email !== "");
};

/**
 * Checks if two ustads arrays are equal (for change detection)
 * @param ustads1 First ustads array
 * @param ustads2 Second ustads array
 * @returns True if arrays contain the same ustads in same order
 */
export const areUstadsEqual = (
  ustads1: Ustad[] | null,
  ustads2: Ustad[] | null,
): boolean => {
  // Handle null cases
  if (ustads1 === null && ustads2 === null) return true;
  if (ustads1 === null || ustads2 === null) return false;

  // Check length
  if (ustads1.length !== ustads2.length) return false;

  // Check each ustad
  return ustads1.every((ustad1, index) => {
    const ustad2 = ustads2[index];
    return ustad1.name === ustad2.name && ustad1.email === ustad2.email;
  });
};

/**
 * Converts legacy ustad_name/ustad_email format to new ustads array
 * Used during migration and for backward compatibility
 * @param ustadName Legacy ustad name
 * @param ustadEmail Legacy ustad email
 * @returns Array with single ustad object or empty array if no data
 */
export const convertLegacyUstadToArray = (
  ustadName: string | null,
  ustadEmail: string | null,
): Ustad[] => {
  // If both name and email are provided, create ustad object
  if (ustadName && ustadName.trim() && ustadEmail && ustadEmail.trim()) {
    return [
      {
        name: ustadName.trim(),
        email: ustadEmail.trim(),
      },
    ];
  }

  // If only name is provided (email is empty/null), still create entry with empty email
  if (ustadName && ustadName.trim()) {
    return [
      {
        name: ustadName.trim(),
        email: ustadEmail?.trim() || "",
      },
    ];
  }

  // No valid ustad data
  return [];
};

/**
 * Gets email validation error for uniqueness check within a registration
 * @param email Email to check
 * @param currentIndex Current ustad index (to exclude from uniqueness check)
 * @param ustads Current ustads array
 * @returns Error message if email is duplicate, null if unique
 */
export const validateEmailUniqueness = (
  email: string,
  currentIndex: number,
  ustads: Ustad[],
): string | null => {
  if (!email || email.trim() === "") return null;

  const normalizedEmail = email.trim().toLowerCase();
  const isDuplicate = ustads.some(
    (ustad, index) =>
      index !== currentIndex &&
      ustad.email.trim().toLowerCase() === normalizedEmail,
  );

  return isDuplicate ? "This email is already used by another ustad" : null;
};
