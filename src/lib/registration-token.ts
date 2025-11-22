/**
 * Generate a secure registration token in the format JET-2025-XXXXXX
 * where XXXXXX is a cryptographically secure random alphanumeric string
 */
export function generateRegistrationToken(): string {
  const currentYear = new Date().getFullYear();
  const randomString = generateSecureAlphanumeric(6);
  return `JET-${currentYear}-${randomString}`;
}

/**
 * Generate a cryptographically secure random alphanumeric string
 * Uses uppercase letters and digits (A-Z, 0-9) for better readability
 */
function generateSecureAlphanumeric(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const array = new Uint8Array(length);

  // Use crypto.getRandomValues for cryptographically secure randomness
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    window.crypto.getRandomValues(array);
  } else if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.getRandomValues
  ) {
    globalThis.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto API (shouldn't happen in modern browsers)
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Validate registration token format
 */
export function isValidRegistrationToken(token: string): boolean {
  const tokenPattern = /^JET-\d{4}-[A-Z0-9]{6}$/;
  return tokenPattern.test(token);
}
