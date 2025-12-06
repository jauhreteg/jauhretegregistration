// Database types that match our Supabase schema
// These types ensure type safety when working with the database

export type StatusType =
  | "new submission"
  | "in review"
  | "information requested"
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

  // Admin Review
  admin_notes: string | null;

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
  admin_notes: string | null;
  team_photos_count: number;
  dob_proofs_count: number;
  created_at: string;
  updated_at: string;
}
