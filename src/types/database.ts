// Database types that match our Supabase schema
// These types ensure type safety when working with the database

// Field name mapping for user-friendly display
export const FIELD_DISPLAY_NAMES: Record<string, string> = {
  // Team fields
  team_name: "Team Name",
  ustad_name: "Ustad Name",
  ustad_email: "Ustad Email",
  coach_name: "Senior Gatkai Coach",
  coach_email: "Senior Gatkai Coach Email",
  team_location: "Team Location",
  player_order: "Player Order",
  team_photo: "Team Photos",

  // Player 1 fields
  player1_name: "Name (Player 1)",
  player1_singh_kaur: "Singh/Kaur (Player 1)",
  player1_dob: "Date of Birth (Player 1)",
  player1_dob_proof: "DOB Proof (Player 1)",
  player1_email: "Email (Player 1)",
  player1_phone_number: "Phone (Player 1)",
  player1_emergency_contact_name: "Emergency Contact Name (Player 1)",
  player1_emergency_contact_phone: "Emergency Contact Phone (Player 1)",
  player1_father_name: "Father Name (Player 1)",
  player1_mother_name: "Mother Name (Player 1)",
  player1_city: "City (Player 1)",
  player1_gatka_experience: "Gatka Experience (Player 1)",

  // Player 2 fields
  player2_name: "Name (Player 2)",
  player2_singh_kaur: "Singh/Kaur (Player 2)",
  player2_dob: "Date of Birth (Player 2)",
  player2_dob_proof: "DOB Proof (Player 2)",
  player2_email: "Email (Player 2)",
  player2_phone_number: "Phone (Player 2)",
  player2_emergency_contact_name: "Emergency Contact Name (Player 2)",
  player2_emergency_contact_phone: "Emergency Contact Phone (Player 2)",
  player2_father_name: "Father Name (Player 2)",
  player2_mother_name: "Mother Name (Player 2)",
  player2_city: "City (Player 2)",
  player2_gatka_experience: "Gatka Experience (Player 2)",

  // Player 3 fields
  player3_name: "Name (Player 3)",
  player3_singh_kaur: "Singh/Kaur (Player 3)",
  player3_dob: "Date of Birth (Player 3)",
  player3_dob_proof: "DOB Proof (Player 3)",
  player3_email: "Email (Player 3)",
  player3_phone_number: "Phone (Player 3)",
  player3_emergency_contact_name: "Emergency Contact Name (Player 3)",
  player3_emergency_contact_phone: "Emergency Contact Phone (Player 3)",
  player3_father_name: "Father Name (Player 3)",
  player3_mother_name: "Mother Name (Player 3)",
  player3_city: "City (Player 3)",
  player3_gatka_experience: "Gatka Experience (Player 3)",

  // Backup player fields
  backup_player: "Has Backup Player",
  backup_name: "Name (Backup Player)",
  backup_singh_kaur: "Singh/Kaur (Backup Player)",
  backup_dob: "Date of Birth (Backup Player)",
  backup_dob_proof: "DOB Proof (Backup Player)",
  backup_phone_number: "Phone (Backup Player)",
  backup_emergency_contact_name: "Emergency Contact Name (Backup Player)",
  backup_emergency_contact_phone: "Emergency Contact Phone (Backup Player)",
  backup_father_name: "Father Name (Backup Player)",
  backup_mother_name: "Mother Name (Backup Player)",
  backup_city: "City (Backup Player)",
  backup_gatka_experience: "Gatka Experience (Backup Player)",
};

export type StatusType =
  | "new submission"
  | "in review"
  | "information requested"
  | "updated information"
  | "approved"
  | "denied"
  | "dropped";

export type DivisionType =
  | "Junior Kaurs"
  | "Junior Singhs"
  | "Open Kaurs"
  | "Open Singhs";

// Main registration table type (matches the registrations table)
export interface Registration {
  // Form Data
  id: string;
  status: StatusType;
  submission_date_time: string;
  form_token: string;

  // Team Data
  division: DivisionType;
  team_name: string;
  ustad_name: string;
  ustad_email: string | null;
  coach_name: string;
  coach_email: string | null;
  team_location: string;
  player_order: string;
  team_photo: string[] | null;

  // Player 1 Data
  player1_name: string;
  player1_singh_kaur: string;
  player1_dob: string | null;
  player1_dob_proof: string[] | null;
  player1_email: string;
  player1_phone_number: string;
  player1_emergency_contact_name: string;
  player1_emergency_contact_phone: string;
  player1_father_name: string | null;
  player1_mother_name: string | null;
  player1_city: string | null;
  player1_gatka_experience: string;

  // Player 2 Data
  player2_name: string;
  player2_singh_kaur: string;
  player2_dob: string | null;
  player2_dob_proof: string[] | null;
  player2_email: string;
  player2_phone_number: string;
  player2_emergency_contact_name: string;
  player2_emergency_contact_phone: string;
  player2_father_name: string | null;
  player2_mother_name: string | null;
  player2_city: string | null;
  player2_gatka_experience: string;

  // Player 3 Data
  player3_name: string;
  player3_singh_kaur: string;
  player3_dob: string | null;
  player3_dob_proof: string[] | null;
  player3_email: string;
  player3_phone_number: string;
  player3_emergency_contact_name: string;
  player3_emergency_contact_phone: string;
  player3_father_name: string | null;
  player3_mother_name: string | null;
  player3_city: string | null;
  player3_gatka_experience: string;

  // Backup Player Data
  backup_player: boolean;
  backup_name: string | null;
  backup_singh_kaur: string | null;
  backup_dob: string | null;
  backup_dob_proof: string[] | null;
  backup_email: string | null;
  backup_phone_number: string | null;
  backup_emergency_contact_name: string | null;
  backup_emergency_contact_phone: string | null;
  backup_father_name: string | null;
  backup_mother_name: string | null;
  backup_city: string | null;
  backup_gatka_experience: string | null;

  // User-Editable Field Tracking (for admin to mark what needs user updates)
  // Team Data fields
  division_needs_update: boolean;
  team_name_needs_update: boolean;
  ustad_name_needs_update: boolean;
  ustad_email_needs_update: boolean;
  coach_name_needs_update: boolean;
  coach_email_needs_update: boolean;
  team_location_needs_update: boolean;
  player_order_needs_update: boolean;
  team_photo_needs_update: boolean;

  // Player 1 Data fields
  player1_name_needs_update: boolean;
  player1_singh_kaur_needs_update: boolean;
  player1_dob_needs_update: boolean;
  player1_dob_proof_needs_update: boolean;
  player1_email_needs_update: boolean;
  player1_phone_number_needs_update: boolean;
  player1_emergency_contact_name_needs_update: boolean;
  player1_emergency_contact_phone_needs_update: boolean;
  player1_father_name_needs_update: boolean;
  player1_mother_name_needs_update: boolean;
  player1_city_needs_update: boolean;
  player1_gatka_experience_needs_update: boolean;

  // Player 2 Data fields
  player2_name_needs_update: boolean;
  player2_singh_kaur_needs_update: boolean;
  player2_dob_needs_update: boolean;
  player2_dob_proof_needs_update: boolean;
  player2_email_needs_update: boolean;
  player2_phone_number_needs_update: boolean;
  player2_emergency_contact_name_needs_update: boolean;
  player2_emergency_contact_phone_needs_update: boolean;
  player2_father_name_needs_update: boolean;
  player2_mother_name_needs_update: boolean;
  player2_city_needs_update: boolean;
  player2_gatka_experience_needs_update: boolean;

  // Player 3 Data fields
  player3_name_needs_update: boolean;
  player3_singh_kaur_needs_update: boolean;
  player3_dob_needs_update: boolean;
  player3_dob_proof_needs_update: boolean;
  player3_email_needs_update: boolean;
  player3_phone_number_needs_update: boolean;
  player3_emergency_contact_name_needs_update: boolean;
  player3_emergency_contact_phone_needs_update: boolean;
  player3_father_name_needs_update: boolean;
  player3_mother_name_needs_update: boolean;
  player3_city_needs_update: boolean;
  player3_gatka_experience_needs_update: boolean;

  // Backup Player Data fields
  backup_player_needs_update: boolean;
  backup_name_needs_update: boolean;
  backup_singh_kaur_needs_update: boolean;
  backup_dob_needs_update: boolean;
  backup_dob_proof_needs_update: boolean;
  backup_email_needs_update: boolean;
  backup_phone_number_needs_update: boolean;
  backup_emergency_contact_name_needs_update: boolean;
  backup_emergency_contact_phone_needs_update: boolean;
  backup_father_name_needs_update: boolean;
  backup_mother_name_needs_update: boolean;
  backup_city_needs_update: boolean;
  backup_gatka_experience_needs_update: boolean;

  // Admin Review
  admin_notes: {
    internal_notes: string | null;
    requested_updates: string[];
  } | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

// File upload table type
export interface FileUpload {
  id: string;
  registration_id: string;
  file_type:
    | "team_photo"
    | "player1_dob_proof"
    | "player2_dob_proof"
    | "player3_dob_proof"
    | "backup_dob_proof";
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
}

// Types for inserting new records (without auto-generated fields)
export type RegistrationInsert = Omit<
  Registration,
  "id" | "created_at" | "updated_at"
>;
export type FileUploadInsert = Omit<FileUpload, "id" | "uploaded_at">;

// View types
export interface RegistrationSummary {
  id: string;
  form_token: string;
  status: StatusType;
  submission_date_time: string;
  division: DivisionType;
  team_name: string;
  ustad_name: string;
  ustad_email: string;
  coach_name: string;
  coach_email: string;
  team_location: string;
  player_order: string;
  backup_player: boolean;
  admin_notes: {
    internal_notes: string | null;
    requested_updates: string[];
  } | null;
  team_photos_count: number;
  dob_proofs_count: number;
  created_at: string;
  updated_at: string;
}
