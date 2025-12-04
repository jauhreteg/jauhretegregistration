"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  email?: string;
}

export async function updateUserProfile(profileData: UpdateProfileData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not found" };
  }

  try {
    // Update metadata (full_name and phone)
    if (profileData.fullName !== undefined || profileData.phone !== undefined) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          ...(profileData.fullName !== undefined && {
            full_name: profileData.fullName,
          }),
          ...(profileData.phone !== undefined && { phone: profileData.phone }),
        },
      });

      if (metadataError) {
        return { error: metadataError.message };
      }
    }

    // Update email separately if provided
    if (profileData.email && profileData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email,
      });

      if (emailError) {
        return { error: emailError.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" };
  }
}

export async function updateUserPassword(newPassword: string) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not found" };
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
