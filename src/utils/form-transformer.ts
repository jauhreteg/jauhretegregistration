import { FormData } from "@/types/form-types";
import { RegistrationInsert, DivisionType } from "@/types/database";
import { generateFormToken } from "@/utils/form-token";
import {
  concatenateName,
  combineLocation,
  combinePhoneNumber,
  combinePlayerOrder,
} from "@/utils/name-transforms";

/**
 * Transforms form data into database registration format
 * This is the main transformation function that converts the flat form structure
 * into the database-ready format with all concatenations and combinations
 */
// Helper function to get date from localStorage if form state is empty
function getDateFromStorageOrForm(
  formValue: string,
  storageKey: string
): string | null {
  if (formValue && formValue.trim()) {
    return formValue;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const date = new Date(stored);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      } catch (e) {
        console.warn(`Invalid date in localStorage for ${storageKey}:`, stored);
      }
    }
  }

  return null;
}

export function transformFormDataToRegistration(
  formData: FormData
): RegistrationInsert {
  // Generate unique form token
  const formToken = generateFormToken();

  // Transform team data
  const teamLocation = combineLocation(
    formData.city,
    formData.state,
    formData.country
  );
  const playerOrder = combinePlayerOrder(
    formData.playerOrder1,
    formData.playerOrder2,
    formData.playerOrder3
  );

  // Transform Player 1 data
  const player1Name = concatenateName(
    formData.player1FirstName,
    formData.player1MiddleName,
    formData.player1LastName
  );
  const player1PhoneNumber = combinePhoneNumber(
    formData.player1CountryCode,
    formData.player1Phone
  );
  const player1EmergencyContactName = concatenateName(
    formData.player1EmergencyContactFirstName,
    formData.player1EmergencyContactMiddleName,
    formData.player1EmergencyContactLastName
  );
  const player1EmergencyContactPhone = combinePhoneNumber(
    formData.player1EmergencyContactCountryCode,
    formData.player1EmergencyContactPhone
  );
  const player1FatherName =
    concatenateName(
      formData.player1FatherFirstName,
      formData.player1FatherMiddleName,
      formData.player1FatherLastName
    ) || null;
  const player1MotherName =
    concatenateName(
      formData.player1MotherFirstName,
      formData.player1MotherMiddleName,
      formData.player1MotherLastName
    ) || null;

  // Transform Player 2 data
  const player2Name = concatenateName(
    formData.player2FirstName,
    formData.player2MiddleName,
    formData.player2LastName
  );
  const player2PhoneNumber = combinePhoneNumber(
    formData.player2CountryCode,
    formData.player2Phone
  );
  const player2EmergencyContactName = concatenateName(
    formData.player2EmergencyContactFirstName,
    formData.player2EmergencyContactMiddleName,
    formData.player2EmergencyContactLastName
  );
  const player2EmergencyContactPhone = combinePhoneNumber(
    formData.player2EmergencyContactCountryCode,
    formData.player2EmergencyContactPhone
  );
  const player2FatherName =
    concatenateName(
      formData.player2FatherFirstName,
      formData.player2FatherMiddleName,
      formData.player2FatherLastName
    ) || null;
  const player2MotherName =
    concatenateName(
      formData.player2MotherFirstName,
      formData.player2MotherMiddleName,
      formData.player2MotherLastName
    ) || null;

  // Transform Player 3 data
  const player3Name = concatenateName(
    formData.player3FirstName,
    formData.player3MiddleName,
    formData.player3LastName
  );
  const player3PhoneNumber = combinePhoneNumber(
    formData.player3CountryCode,
    formData.player3Phone
  );
  const player3EmergencyContactName = concatenateName(
    formData.player3EmergencyContactFirstName,
    formData.player3EmergencyContactMiddleName,
    formData.player3EmergencyContactLastName
  );
  const player3EmergencyContactPhone = combinePhoneNumber(
    formData.player3EmergencyContactCountryCode,
    formData.player3EmergencyContactPhone
  );
  const player3FatherName =
    concatenateName(
      formData.player3FatherFirstName,
      formData.player3FatherMiddleName,
      formData.player3FatherLastName
    ) || null;
  const player3MotherName =
    concatenateName(
      formData.player3MotherFirstName,
      formData.player3MotherMiddleName,
      formData.player3MotherLastName
    ) || null;

  // Transform Backup Player data (only if backup player exists)
  const hasBackupPlayer = formData.hasBackupPlayer === true;

  // If backup player is No, send all backup fields as null regardless of what's stored
  const backupName = hasBackupPlayer
    ? concatenateName(
        formData.backupFirstName,
        formData.backupMiddleName,
        formData.backupLastName
      )
    : null;
  const backupPhoneNumber = hasBackupPlayer
    ? combinePhoneNumber(formData.backupCountryCode, formData.backupPhone)
    : null;
  const backupEmergencyContactName = hasBackupPlayer
    ? concatenateName(
        formData.backupEmergencyContactFirstName,
        formData.backupEmergencyContactMiddleName,
        formData.backupEmergencyContactLastName
      )
    : null;
  const backupEmergencyContactPhone = hasBackupPlayer
    ? combinePhoneNumber(
        formData.backupEmergencyContactCountryCode,
        formData.backupEmergencyContactPhone
      )
    : null;
  const backupFatherName = hasBackupPlayer
    ? concatenateName(
        formData.backupFatherFirstName,
        formData.backupFatherMiddleName,
        formData.backupFatherLastName
      )
    : null;
  const backupMotherName = hasBackupPlayer
    ? concatenateName(
        formData.backupMotherFirstName,
        formData.backupMotherMiddleName,
        formData.backupMotherLastName
      )
    : null;

  // Build the registration object
  const registration: RegistrationInsert = {
    // Form metadata
    status: "new submission",
    submission_date_time: new Date().toISOString(),
    form_token: formToken,

    // Team data
    division: formData.division as DivisionType,
    team_name: formData.teamName,
    ustad_name: formData.ustadName,
    ustad_email: formData.ustadEmail || null,
    coach_name: formData.seniorGatkaiName,
    coach_email: formData.seniorGatkaiEmail || null,
    team_location: teamLocation,
    player_order: playerOrder,
    team_photo: null, // Will be set after file upload

    // Player 1
    player1_name: player1Name,
    player1_singh_kaur: formData.player1SinghKaur,
    player1_dob: getDateFromStorageOrForm(formData.player1DOB, "player1-dob"),
    player1_dob_proof: null, // Will be set after file upload
    player1_email: formData.player1Email,
    player1_phone_number: player1PhoneNumber,
    player1_emergency_contact_name: player1EmergencyContactName,
    player1_emergency_contact_phone: player1EmergencyContactPhone,
    player1_father_name: player1FatherName,
    player1_mother_name: player1MotherName,
    player1_city: formData.player1PindVillage,
    player1_gatka_experience: formData.player1GatkaExperience,

    // Player 2
    player2_name: player2Name,
    player2_singh_kaur: formData.player2SinghKaur,
    player2_dob: getDateFromStorageOrForm(formData.player2DOB, "player2-dob"),
    player2_dob_proof: null, // Will be set after file upload
    player2_email: formData.player2Email,
    player2_phone_number: player2PhoneNumber,
    player2_emergency_contact_name: player2EmergencyContactName,
    player2_emergency_contact_phone: player2EmergencyContactPhone,
    player2_father_name: player2FatherName,
    player2_mother_name: player2MotherName,
    player2_city: formData.player2PindVillage,
    player2_gatka_experience: formData.player2GatkaExperience,

    // Player 3
    player3_name: player3Name,
    player3_singh_kaur: formData.player3SinghKaur,
    player3_dob: getDateFromStorageOrForm(formData.player3DOB, "player3-dob"),
    player3_dob_proof: null, // Will be set after file upload
    player3_email: formData.player3Email,
    player3_phone_number: player3PhoneNumber,
    player3_emergency_contact_name: player3EmergencyContactName,
    player3_emergency_contact_phone: player3EmergencyContactPhone,
    player3_father_name: player3FatherName,
    player3_mother_name: player3MotherName,
    player3_city: formData.player3PindVillage,
    player3_gatka_experience: formData.player3GatkaExperience,

    // Backup player - all fields null if hasBackupPlayer is false
    backup_player: hasBackupPlayer,
    backup_name: backupName,
    backup_singh_kaur: hasBackupPlayer ? formData.backupSinghKaur : null,
    backup_dob: hasBackupPlayer
      ? getDateFromStorageOrForm(formData.backupDOB || "", "backup-dob")
      : null,
    backup_dob_proof: null, // Will be set after file upload
    backup_email: hasBackupPlayer ? formData.backupEmail : null,
    backup_phone_number: backupPhoneNumber,
    backup_emergency_contact_name: backupEmergencyContactName,
    backup_emergency_contact_phone: backupEmergencyContactPhone,
    backup_father_name: backupFatherName,
    backup_mother_name: backupMotherName,
    backup_city: hasBackupPlayer ? formData.backupPindVillage : null,
    backup_gatka_experience: hasBackupPlayer
      ? formData.backupGatkaExperience
      : null,

    // User-Editable Field Tracking (all false for new registrations)
    // Team Data fields
    division_needs_update: false,
    team_name_needs_update: false,
    ustad_name_needs_update: false,
    ustad_email_needs_update: false,
    coach_name_needs_update: false,
    coach_email_needs_update: false,
    team_location_needs_update: false,
    player_order_needs_update: false,
    team_photo_needs_update: false,

    // Player 1 Data fields
    player1_name_needs_update: false,
    player1_singh_kaur_needs_update: false,
    player1_dob_needs_update: false,
    player1_dob_proof_needs_update: false,
    player1_email_needs_update: false,
    player1_phone_number_needs_update: false,
    player1_emergency_contact_name_needs_update: false,
    player1_emergency_contact_phone_needs_update: false,
    player1_father_name_needs_update: false,
    player1_mother_name_needs_update: false,
    player1_city_needs_update: false,
    player1_gatka_experience_needs_update: false,

    // Player 2 Data fields
    player2_name_needs_update: false,
    player2_singh_kaur_needs_update: false,
    player2_dob_needs_update: false,
    player2_dob_proof_needs_update: false,
    player2_email_needs_update: false,
    player2_phone_number_needs_update: false,
    player2_emergency_contact_name_needs_update: false,
    player2_emergency_contact_phone_needs_update: false,
    player2_father_name_needs_update: false,
    player2_mother_name_needs_update: false,
    player2_city_needs_update: false,
    player2_gatka_experience_needs_update: false,

    // Player 3 Data fields
    player3_name_needs_update: false,
    player3_singh_kaur_needs_update: false,
    player3_dob_needs_update: false,
    player3_dob_proof_needs_update: false,
    player3_email_needs_update: false,
    player3_phone_number_needs_update: false,
    player3_emergency_contact_name_needs_update: false,
    player3_emergency_contact_phone_needs_update: false,
    player3_father_name_needs_update: false,
    player3_mother_name_needs_update: false,
    player3_city_needs_update: false,
    player3_gatka_experience_needs_update: false,

    // Backup Player Data fields
    backup_player_needs_update: false,
    backup_name_needs_update: false,
    backup_singh_kaur_needs_update: false,
    backup_dob_needs_update: false,
    backup_dob_proof_needs_update: false,
    backup_email_needs_update: false,
    backup_phone_number_needs_update: false,
    backup_emergency_contact_name_needs_update: false,
    backup_emergency_contact_phone_needs_update: false,
    backup_father_name_needs_update: false,
    backup_mother_name_needs_update: false,
    backup_city_needs_update: false,
    backup_gatka_experience_needs_update: false,

    // Admin Review
    admin_notes: null,
  };

  return registration;
}

type FileType =
  | "team_photo"
  | "player1_dob_proof"
  | "player2_dob_proof"
  | "player3_dob_proof"
  | "backup_dob_proof";

/**
 * Gets file information from form data for upload processing
 */
export function extractFilesFromFormData(formData: FormData) {
  const files: { type: FileType; file: File | null }[] = [];

  // Team photos (can be multiple)
  if (formData.teamPhotos && formData.teamPhotos.length > 0) {
    formData.teamPhotos.forEach((photo) => {
      if (photo && photo.size > 0) {
        files.push({ type: "team_photo" as FileType, file: photo });
      }
    });
  }

  // Player DOB proofs (now all arrays)
  if (formData.player1ProofOfAge && formData.player1ProofOfAge.length > 0) {
    formData.player1ProofOfAge.forEach((file) => {
      if (file && file.size > 0) {
        files.push({
          type: "player1_dob_proof" as FileType,
          file: file,
        });
      }
    });
  }

  if (formData.player2ProofOfAge && formData.player2ProofOfAge.length > 0) {
    formData.player2ProofOfAge.forEach((file) => {
      if (file && file.size > 0) {
        files.push({
          type: "player2_dob_proof" as FileType,
          file: file,
        });
      }
    });
  }

  if (formData.player3ProofOfAge && formData.player3ProofOfAge.length > 0) {
    formData.player3ProofOfAge.forEach((file) => {
      if (file && file.size > 0) {
        files.push({
          type: "player3_dob_proof" as FileType,
          file: file,
        });
      }
    });
  }

  if (
    formData.hasBackupPlayer &&
    formData.backupProofOfAge &&
    formData.backupProofOfAge.length > 0
  ) {
    formData.backupProofOfAge.forEach((file) => {
      if (file && file.size > 0) {
        files.push({
          type: "backup_dob_proof" as FileType,
          file: file,
        });
      }
    });
  }

  // Filter out any files that might be null or invalid
  return files.filter((f) => f.file && f.type && f.file.size > 0);
}
