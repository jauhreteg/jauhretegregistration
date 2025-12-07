/**
 * Utility function to get admin user name consistently across the app.
 * This ensures the same logic is used both for setting admin names
 * and for filtering notifications.
 */
export function getAdminUserName(user: any): string {
  if (!user) return "Admin";

  const emailPrefix = user.email?.split("@")[0];
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.user_metadata?.name ||
    // Capitalize first letter of email prefix as last resort
    (emailPrefix
      ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
      : "") ||
    "Admin";

  return name;
}
