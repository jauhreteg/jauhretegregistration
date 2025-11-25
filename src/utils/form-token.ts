/**
 * Generates a unique form token in the format: jet-YYYY-ZZZZZ
 * where YYYY is the current year and ZZZZZ is a 5-character alphanumeric string
 */
export function generateFormToken(): string {
  const currentYear = new Date().getFullYear();

  // Generate 5-character alphanumeric string (uppercase letters and numbers)
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < 5; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `jet-${currentYear}-${randomString}`;
}

/**
 * Validates if a token matches the expected format
 */
export function isValidFormToken(token: string): boolean {
  // Pattern: jet-YYYY-ZZZZZ where YYYY is 4 digits and ZZZZZ is 5 alphanumeric
  const tokenPattern = /^jet-\d{4}-[A-Z0-9]{5}$/;
  return tokenPattern.test(token);
}

// Example usage and testing
if (typeof window === "undefined") {
  // Only run tests in Node.js environment (not in browser)
  console.log("Form Token Examples:");
  for (let i = 0; i < 3; i++) {
    const token = generateFormToken();
    console.log(`- ${token} (Valid: ${isValidFormToken(token)})`);
  }
}
