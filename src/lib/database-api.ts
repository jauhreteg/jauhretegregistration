import { supabase } from "@/lib/supabase";
import { FileUploadInsert, RegistrationSummary } from "@/types/database";
import { FormData } from "@/types/form-types";
import {
  transformFormDataToRegistration,
  extractFilesFromFormData,
} from "@/utils/form-transformer";
import { uploadFile, createFileMetadata } from "@/utils/file-storage";

/**
 * Response type for registration submission
 */
export interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId?: string;
  formToken?: string;
  errors?: string[];
}

/**
 * Main function to submit a complete registration
 * Handles form data transformation, file uploads, and database insertion
 */
export async function submitRegistration(
  formData: FormData
): Promise<RegistrationResponse> {
  try {
    console.log("🚀 Starting registration submission...");

    // Step 1: Transform form data to database format
    console.log("📝 Transforming form data...");
    const registrationData = transformFormDataToRegistration(formData);

    // Step 2: Insert registration record first (to get ID)
    console.log("💾 Inserting registration record...");
    const { data: registrationRecord, error: registrationError } =
      await supabase
        .from("registrations")
        .insert(registrationData)
        .select("id, form_token")
        .single();

    if (registrationError) {
      console.error(
        "❌ Registration insertion failed:",
        registrationError.message
      );
      return {
        success: false,
        message: "Failed to create registration record",
        errors: [registrationError.message],
      };
    }

    const registrationId = registrationRecord.id;
    const formToken = registrationRecord.form_token;
    console.log(`✅ Registration created with ID: ${registrationId}`);

    // Step 3: Extract and upload files
    console.log("📁 Processing file uploads...");
    const files = extractFilesFromFormData(formData);
    const fileUploadRecords: FileUploadInsert[] = [];
    const uploadErrors: string[] = [];

    // Group files by type to handle multiple files per field
    const fileGroups: { [key: string]: string[] } = {};

    for (const fileInfo of files) {
      if (fileInfo.file) {
        console.log(`📤 Uploading ${fileInfo.type}...`);
        const { url, error } = await uploadFile(
          fileInfo.file,
          fileInfo.type,
          formToken
        );

        if (url) {
          // Create file metadata for database
          const fileMetadata = createFileMetadata(
            fileInfo.file,
            fileInfo.type,
            url,
            registrationId
          );
          fileUploadRecords.push(fileMetadata);

          // Group URLs by type for batch update
          const baseType = fileInfo.type
            ? fileInfo.type.replace(/_\d+$/, "")
            : fileInfo.type; // Remove _1, _2 suffixes if any
          if (!fileGroups[baseType]) {
            fileGroups[baseType] = [];
          }
          fileGroups[baseType].push(url);
        } else {
          uploadErrors.push(`${fileInfo.type}: ${error}`);
        }
      }
    }

    // Update registration record with file URL arrays
    for (const [fileType, urls] of Object.entries(fileGroups)) {
      await updateRegistrationWithFileUrls(registrationId, fileType, urls);
    }

    // Step 4: Insert file metadata records
    if (fileUploadRecords.length > 0) {
      console.log(`💾 Inserting ${fileUploadRecords.length} file records...`);
      const { error: fileError } = await supabase
        .from("file_uploads")
        .insert(fileUploadRecords);

      if (fileError) {
        console.error("⚠️  File metadata insertion failed:", fileError.message);
        uploadErrors.push("Failed to save file metadata");
      }
    }

    // Step 5: Return success response
    const successMessage =
      uploadErrors.length > 0
        ? `Registration submitted successfully, but some files failed to upload: ${uploadErrors.join(
            ", "
          )}`
        : "Registration submitted successfully!";

    console.log("🎉 Registration submission completed!");
    return {
      success: true,
      message: successMessage,
      registrationId,
      formToken,
      errors: uploadErrors.length > 0 ? uploadErrors : undefined,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Registration submission failed:", errorMessage);

    return {
      success: false,
      message: "Registration submission failed",
      errors: [errorMessage],
    };
  }
}

/**
 * Updates registration record with uploaded file URLs (supports multiple files)
 */
async function updateRegistrationWithFileUrls(
  registrationId: string,
  fileType: string,
  fileUrls: string[]
): Promise<void> {
  let updateField: string;

  // Map file type to database field
  switch (fileType) {
    case "team_photo":
      updateField = "team_photo";
      break;
    case "player1_dob_proof":
      updateField = "player1_dob_proof";
      break;
    case "player2_dob_proof":
      updateField = "player2_dob_proof";
      break;
    case "player3_dob_proof":
      updateField = "player3_dob_proof";
      break;
    case "backup_dob_proof":
      updateField = "backup_dob_proof";
      break;
    default:
      console.warn(`Unknown file type: ${fileType}`);
      return;
  }

  const { error } = await supabase
    .from("registrations")
    .update({ [updateField]: fileUrls })
    .eq("id", registrationId);

  if (error) {
    console.error(`Failed to update ${updateField}:`, error.message);
  }
}

/**
 * Retrieves a registration by form token
 */
export async function getRegistrationByToken(
  formToken: string
): Promise<RegistrationSummary | null> {
  try {
    const { data, error } = await supabase
      .from("registration_summary")
      .select("*")
      .eq("form_token", formToken)
      .single();

    if (error) {
      console.error("Failed to fetch registration:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching registration:", error);
    return null;
  }
}

/**
 * Gets all registrations (for admin use)
 */
export async function getAllRegistrations(): Promise<RegistrationSummary[]> {
  try {
    const { data, error } = await supabase
      .from("registration_summary")
      .select("*")
      .order("submission_date_time", { ascending: false });

    if (error) {
      console.error("Failed to fetch registrations:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
}
