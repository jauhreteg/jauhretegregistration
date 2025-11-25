/**
 * Utility functions for combining names and other field transformations
 */

/**
 * Concatenates first, middle, and last names into a single string
 * Handles cases where middle name might be empty or undefined
 */
export function concatenateName(
  firstName: string,
  middleName: string | undefined | null,
  lastName: string
): string {
  const parts = [
    firstName?.trim(),
    middleName?.trim(),
    lastName?.trim(),
  ].filter((part) => part && part.length > 0); // Remove empty/null/undefined parts

  return parts.join(" ");
}

/**
 * Combines location fields into a single location string
 * Format: "City, State, Country"
 */
export function combineLocation(
  city: string,
  state: string,
  country: string
): string {
  const parts = [city?.trim(), state?.trim(), country?.trim()].filter(
    (part) => part && part.length > 0
  );

  return parts.join(", ");
}

/**
 * Combines country code and phone number
 * Format: "+1 555-123-4567"
 */
export function combinePhoneNumber(
  countryCode: string,
  phoneNumber: string
): string {
  const cleanCountryCode = countryCode?.trim().replace(/^\+/, ""); // Remove existing + if present
  const cleanPhone = phoneNumber?.trim();

  if (!cleanCountryCode || !cleanPhone) {
    return cleanPhone || "";
  }

  return `+${cleanCountryCode} ${cleanPhone}`;
}

/**
 * Combines player order into comma-separated string
 * Example: "John Singh, Mary Kaur, Bob Singh"
 */
export function combinePlayerOrder(
  player1: string,
  player2: string,
  player3: string
): string {
  const players = [player1?.trim(), player2?.trim(), player3?.trim()].filter(
    (player) => player && player.length > 0
  );

  return players.join(", ");
}

// Test functions (only run in development)
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  console.log("Name Transformation Examples:");

  // Test name concatenation
  console.log("Names:");
  console.log("- " + concatenateName("John", "Singh", "Doe")); // "John Singh Doe"
  console.log("- " + concatenateName("Mary", "", "Smith")); // "Mary Smith"
  console.log("- " + concatenateName("Bob", null, "Jones")); // "Bob Jones"

  // Test location combination
  console.log("\\nLocations:");
  console.log("- " + combineLocation("Toronto", "Ontario", "Canada")); // "Toronto, Ontario, Canada"
  console.log("- " + combineLocation("New York", "NY", "USA")); // "New York, NY, USA"

  // Test phone combination
  console.log("\\nPhone Numbers:");
  console.log("- " + combinePhoneNumber("1", "555-123-4567")); // "+1 555-123-4567"
  console.log("- " + combinePhoneNumber("+44", "20-1234-5678")); // "+44 20-1234-5678"

  // Test player order
  console.log("\\nPlayer Orders:");
  console.log(
    "- " + combinePlayerOrder("John Singh", "Mary Kaur", "Bob Singh")
  ); // "John Singh, Mary Kaur, Bob Singh"
}
