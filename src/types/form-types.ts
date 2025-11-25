export type FormData = {
  // Team Information
  teamName: string;
  city: string;
  state: string;
  country: string;
  ustadName: string;
  ustadEmail: string;
  seniorGatkaiName: string;
  seniorGatkaiEmail: string;
  division: string;
  playerOrder1: string;
  playerOrder2: string;
  playerOrder3: string;
  hasBackupPlayer: boolean | null;
  teamPhotos: File[];

  // Player 1 - Comprehensive Information
  player1FirstName: string;
  player1MiddleName: string;
  player1LastName: string;
  player1SinghKaur: string;
  player1Email: string;
  player1Phone: string;
  player1CountryCode: string;
  player1DOB: string;
  player1ProofOfAge: File[] | null;
  player1EmergencyContactFirstName: string;
  player1EmergencyContactMiddleName: string;
  player1EmergencyContactLastName: string;
  player1EmergencyContactPhone: string;
  player1EmergencyContactCountryCode: string;
  player1FatherFirstName: string;
  player1FatherMiddleName: string;
  player1FatherLastName: string;
  player1MotherFirstName: string;
  player1MotherMiddleName: string;
  player1MotherLastName: string;
  player1PindVillage: string;
  player1GatkaExperience: string;

  // Player 2 - Comprehensive Information
  player2FirstName: string;
  player2MiddleName: string;
  player2LastName: string;
  player2SinghKaur: string;
  player2Email: string;
  player2Phone: string;
  player2CountryCode: string;
  player2DOB: string;
  player2ProofOfAge: File[] | null;
  player2EmergencyContactFirstName: string;
  player2EmergencyContactMiddleName: string;
  player2EmergencyContactLastName: string;
  player2EmergencyContactPhone: string;
  player2EmergencyContactCountryCode: string;
  player2FatherFirstName: string;
  player2FatherMiddleName: string;
  player2FatherLastName: string;
  player2MotherFirstName: string;
  player2MotherMiddleName: string;
  player2MotherLastName: string;
  player2PindVillage: string;
  player2GatkaExperience: string;

  // Player 3 - Comprehensive Information
  player3FirstName: string;
  player3MiddleName: string;
  player3LastName: string;
  player3SinghKaur: string;
  player3Email: string;
  player3Phone: string;
  player3CountryCode: string;
  player3DOB: string;
  player3ProofOfAge: File[] | null;
  player3EmergencyContactFirstName: string;
  player3EmergencyContactMiddleName: string;
  player3EmergencyContactLastName: string;
  player3EmergencyContactPhone: string;
  player3EmergencyContactCountryCode: string;
  player3FatherFirstName: string;
  player3FatherMiddleName: string;
  player3FatherLastName: string;
  player3MotherFirstName: string;
  player3MotherMiddleName: string;
  player3MotherLastName: string;
  player3PindVillage: string;
  player3GatkaExperience: string;

  // Backup Player - Comprehensive Information (Optional)
  backupFirstName: string;
  backupMiddleName: string;
  backupLastName: string;
  backupSinghKaur: string;
  backupEmail: string;
  backupPhone: string;
  backupCountryCode: string;
  backupDOB: string;
  backupProofOfAge: File[] | null;
  backupEmergencyContactFirstName: string;
  backupEmergencyContactMiddleName: string;
  backupEmergencyContactLastName: string;
  backupEmergencyContactPhone: string;
  backupEmergencyContactCountryCode: string;
  backupFatherFirstName: string;
  backupFatherMiddleName: string;
  backupFatherLastName: string;
  backupMotherFirstName: string;
  backupMotherMiddleName: string;
  backupMotherLastName: string;
  backupPindVillage: string;
  backupGatkaExperience: string;
};

export type FieldConfig = {
  field: keyof FormData;
  label: string;
  required: boolean;
};

export type PlayerType = "player1" | "player2" | "player3" | "backup";

export interface PlayerData {
  firstName: string;
  middleName: string;
  lastName: string;
  singhKaur: string;
  email: string;
  phone: string;
  countryCode: string;
  dob: string;
  proofOfAge: File | null;
  emergencyContactFirstName: string;
  emergencyContactMiddleName: string;
  emergencyContactLastName: string;
  emergencyContactPhone: string;
  emergencyContactCountryCode: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  pindVillage: string;
  gatkaExperience: string;
}

export interface TeamData {
  teamName: string;
  city: string;
  state: string;
  country: string;
  ustadName: string;
  ustadEmail: string;
  seniorGatkaiName: string;
  seniorGatkaiEmail: string;
  division: string;
  playerOrder1: string;
  playerOrder2: string;
  playerOrder3: string;
  teamPhotos: File[];
}
