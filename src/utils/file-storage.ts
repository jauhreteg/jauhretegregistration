import { supabase } from "@/lib/supabase";
import { FileUploadInsert } from "@/types/database";

type FileType =
  | "team_photo"
  | "player1_dob_proof"
  | "player2_dob_proof"
  | "player3_dob_proof"
  | "backup_dob_proof";

/**
 * Generates a unique filename for storage
 * Format: {timestamp}_{random}_{originalName}
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${timestamp}_${random}_${sanitizedName}`;
}

/**
 * Gets the storage path for a file based on type and current year
 * Creates the folder structure: jet-documents/jet-YYYY/folder-type/
 */
export function getStoragePath(fileType: FileType): string {
  const currentYear = new Date().getFullYear();

  if (fileType === "team_photo") {
    return `jet-documents/jet-${currentYear}/team-photos/`;
  } else if (fileType.includes("dob_proof")) {
    return `jet-documents/jet-${currentYear}/dob-proof/`;
  }

  throw new Error(`Unknown file type: ${fileType}`);
}

/**
 * Uploads a single file to Supabase Storage
 * Returns the public URL if successful, null if failed
 */
export async function uploadFile(
  file: File,
  fileType: FileType
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate unique filename and path
    const fileName = generateUniqueFileName(file.name);
    const storagePath = getStoragePath(fileType);
    const fullPath = `${storagePath}${fileName}`;

    console.log(`📁 Uploading file to: ${fullPath}`);

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from("jet-documents")
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ File upload failed:", error.message);
      return { url: null, error: error.message };
    }

    // Get the public URL (now that bucket is public)
    const { data: publicUrlData } = supabase.storage
      .from("jet-documents")
      .getPublicUrl(fullPath);

    console.log("✅ File uploaded successfully:", publicUrlData.publicUrl);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown upload error";
    console.error("❌ Upload error:", errorMessage);
    return { url: null, error: errorMessage };
  }
}

/**
 * Uploads multiple files and returns their URLs
 * Useful for team photos (multiple files)
 */
export async function uploadMultipleFiles(
  files: File[],
  fileType: FileType
): Promise<{ urls: string[]; errors: string[] }> {
  console.log(`📁 Uploading ${files.length} files of type: ${fileType}`);

  const urls: string[] = [];
  const errors: string[] = [];

  // Upload files in parallel for better performance
  const uploadPromises = files.map((file) => uploadFile(file, fileType));
  const results = await Promise.all(uploadPromises);

  results.forEach((result, index) => {
    if (result.url) {
      urls.push(result.url);
    } else {
      errors.push(`File ${index + 1}: ${result.error}`);
    }
  });

  console.log(`✅ Uploaded ${urls.length}/${files.length} files successfully`);
  return { urls, errors };
}

/**
 * Generates a signed URL for a file path (for admin dashboard use)
 * This creates fresh URLs on demand that won't expire during admin sessions
 */
export async function getSignedUrl(
  filePath: string,
  expiresInSeconds: number = 7200 // 2 hours default
): Promise<{ signedUrl: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from("jet-documents")
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error("❌ Failed to create signed URL:", error.message);
      return { signedUrl: null, error: error.message };
    }

    return { signedUrl: data.signedUrl, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown signed URL error";
    console.error("❌ Signed URL error:", errorMessage);
    return { signedUrl: null, error: errorMessage };
  }
}

/**
 * Creates file metadata for database storage
 */
export function createFileMetadata(
  file: File,
  fileType: FileType,
  fileUrl: string,
  registrationId: string
): FileUploadInsert {
  return {
    registration_id: registrationId,
    file_type: fileType,
    file_path: fileUrl,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
  };
}

// Test function (only runs in development)
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  console.log("🗂️  Storage Path Examples:");
  console.log("- Team photos:", getStoragePath("team_photo"));
  console.log("- DOB proofs:", getStoragePath("player1_dob_proof"));
  console.log(
    "- Unique filename example:",
    generateUniqueFileName("my-photo.jpg")
  );
}
