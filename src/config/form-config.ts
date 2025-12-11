import { FormData, FieldConfig } from "@/types/form-types";

// Field configuration system
export const FIELD_CONFIG: Record<string, FieldConfig[]> = {
  division: [{ field: "division", label: "Division", required: false }],
  backupDecision: [
    {
      field: "hasBackupPlayer",
      label: "Backup Player Decision",
      required: false,
    },
  ],
  player1: [
    { field: "player1FirstName", label: "First Name", required: false },
    { field: "player1MiddleName", label: "Middle Name", required: false },
    {
      field: "player1LastName",
      label: "Last Name",
      required: false,
    },
    {
      field: "player1SinghKaur",
      label: "Singh / Kaur",
      required: false,
    },
    { field: "player1Email", label: "Email", required: false },
    { field: "player1CountryCode", label: "Country Code", required: false },
    { field: "player1Phone", label: "Phone Number", required: false },
    { field: "player1DOB", label: "Date of Birth", required: false },
    {
      field: "player1ProofOfAge",
      label: "Proof of Age Document",
      required: false,
    },
    {
      field: "player1EmergencyContactFirstName",
      label: "Emergency Contact First Name",
      required: false,
    },
    {
      field: "player1EmergencyContactMiddleName",
      label: "Emergency Contact Middle Name",
      required: false,
    },
    {
      field: "player1EmergencyContactLastName",
      label: "Emergency Contact Last Name",
      required: false,
    },
    {
      field: "player1EmergencyContactCountryCode",
      label: "Emergency Contact Country Code",
      required: false,
    },
    {
      field: "player1EmergencyContactPhone",
      label: "Emergency Contact Phone",
      required: false,
    },
    {
      field: "player1FatherFirstName",
      label: "Father First Name",
      required: false,
    },
    {
      field: "player1FatherMiddleName",
      label: "Father Middle Name",
      required: false,
    },
    {
      field: "player1FatherLastName",
      label: "Father Last Name",
      required: false,
    },
    {
      field: "player1MotherFirstName",
      label: "Mother First Name",
      required: false,
    },
    {
      field: "player1MotherMiddleName",
      label: "Mother Middle Name",
      required: false,
    },
    {
      field: "player1MotherLastName",
      label: "Mother Last Name",
      required: false,
    },
    {
      field: "player1PindVillage",
      label: "Pind/Village or Town/City",
      required: false,
    },
    {
      field: "player1GatkaExperience",
      label: "Years of Gatka Experience",
      required: false,
    },
  ],
  player2: [
    { field: "player2FirstName", label: "First Name", required: false },
    { field: "player2MiddleName", label: "Middle Name", required: false },
    {
      field: "player2LastName",
      label: "Last Name",
      required: false,
    },
    {
      field: "player2SinghKaur",
      label: "Singh / Kaur",
      required: false,
    },
    { field: "player2Email", label: "Email", required: false },
    { field: "player2CountryCode", label: "Country Code", required: false },
    { field: "player2Phone", label: "Phone Number", required: false },
    { field: "player2DOB", label: "Date of Birth", required: false },
    {
      field: "player2ProofOfAge",
      label: "Proof of Age Document",
      required: false,
    },
    {
      field: "player2EmergencyContactFirstName",
      label: "Emergency Contact First Name",
      required: false,
    },
    {
      field: "player2EmergencyContactMiddleName",
      label: "Emergency Contact Middle Name",
      required: false,
    },
    {
      field: "player2EmergencyContactLastName",
      label: "Emergency Contact Last Name",
      required: false,
    },
    {
      field: "player2EmergencyContactCountryCode",
      label: "Emergency Contact Country Code",
      required: false,
    },
    {
      field: "player2EmergencyContactPhone",
      label: "Emergency Contact Phone",
      required: false,
    },
    {
      field: "player2FatherFirstName",
      label: "Father First Name",
      required: false,
    },
    {
      field: "player2FatherMiddleName",
      label: "Father Middle Name",
      required: false,
    },
    {
      field: "player2FatherLastName",
      label: "Father Last Name",
      required: false,
    },
    {
      field: "player2MotherFirstName",
      label: "Mother First Name",
      required: false,
    },
    {
      field: "player2MotherMiddleName",
      label: "Mother Middle Name",
      required: false,
    },
    {
      field: "player2MotherLastName",
      label: "Mother Last Name",
      required: false,
    },
    {
      field: "player2PindVillage",
      label: "Pind/Village or Town/City",
      required: false,
    },
    {
      field: "player2GatkaExperience",
      label: "Years of Gatka Experience",
      required: false,
    },
  ],
  player3: [
    { field: "player3FirstName", label: "First Name", required: false },
    { field: "player3MiddleName", label: "Middle Name", required: false },
    {
      field: "player3LastName",
      label: "Last Name",
      required: false,
    },
    {
      field: "player3SinghKaur",
      label: "Singh / Kaur",
      required: false,
    },
    { field: "player3Email", label: "Email", required: false },
    { field: "player3CountryCode", label: "Country Code", required: false },
    { field: "player3Phone", label: "Phone Number", required: false },
    { field: "player3DOB", label: "Date of Birth", required: false },
    {
      field: "player3ProofOfAge",
      label: "Proof of Age Document",
      required: false,
    },
    {
      field: "player3EmergencyContactFirstName",
      label: "Emergency Contact First Name",
      required: false,
    },
    {
      field: "player3EmergencyContactMiddleName",
      label: "Emergency Contact Middle Name",
      required: false,
    },
    {
      field: "player3EmergencyContactLastName",
      label: "Emergency Contact Last Name",
      required: false,
    },
    {
      field: "player3EmergencyContactCountryCode",
      label: "Emergency Contact Country Code",
      required: false,
    },
    {
      field: "player3EmergencyContactPhone",
      label: "Emergency Contact Phone",
      required: false,
    },
    {
      field: "player3FatherFirstName",
      label: "Father First Name",
      required: false,
    },
    {
      field: "player3FatherMiddleName",
      label: "Father Middle Name",
      required: false,
    },
    {
      field: "player3FatherLastName",
      label: "Father Last Name",
      required: false,
    },
    {
      field: "player3MotherFirstName",
      label: "Mother First Name",
      required: false,
    },
    {
      field: "player3MotherMiddleName",
      label: "Mother Middle Name",
      required: false,
    },
    {
      field: "player3MotherLastName",
      label: "Mother Last Name",
      required: false,
    },
    {
      field: "player3PindVillage",
      label: "Pind/Village or Town/City",
      required: false,
    },
    {
      field: "player3GatkaExperience",
      label: "Years of Gatka Experience",
      required: false,
    },
  ],
  backup: [
    { field: "backupFirstName", label: "First Name", required: false },
    { field: "backupMiddleName", label: "Middle Name", required: false },
    {
      field: "backupLastName",
      label: "Last Name",
      required: false,
    },
    {
      field: "backupSinghKaur",
      label: "Singh / Kaur",
      required: false,
    },
    { field: "backupEmail", label: "Email", required: false },
    { field: "backupCountryCode", label: "Country Code", required: false },
    { field: "backupPhone", label: "Phone Number", required: false },
    { field: "backupDOB", label: "Date of Birth", required: false },
    {
      field: "backupProofOfAge",
      label: "Proof of Age Document",
      required: false,
    },
    {
      field: "backupEmergencyContactFirstName",
      label: "Emergency Contact First Name",
      required: false,
    },
    {
      field: "backupEmergencyContactMiddleName",
      label: "Emergency Contact Middle Name",
      required: false,
    },
    {
      field: "backupEmergencyContactLastName",
      label: "Emergency Contact Last Name",
      required: false,
    },
    {
      field: "backupEmergencyContactCountryCode",
      label: "Emergency Contact Country Code",
      required: false,
    },
    {
      field: "backupEmergencyContactPhone",
      label: "Emergency Contact Phone",
      required: false,
    },
    {
      field: "backupFatherFirstName",
      label: "Father First Name",
      required: false,
    },
    {
      field: "backupFatherMiddleName",
      label: "Father Middle Name",
      required: false,
    },
    {
      field: "backupFatherLastName",
      label: "Father Last Name",
      required: false,
    },
    {
      field: "backupMotherFirstName",
      label: "Mother First Name",
      required: false,
    },
    {
      field: "backupMotherMiddleName",
      label: "Mother Middle Name",
      required: false,
    },
    {
      field: "backupMotherLastName",
      label: "Mother Last Name",
      required: false,
    },
    {
      field: "backupPindVillage",
      label: "Pind/Village or Town/City",
      required: false,
    },
    {
      field: "backupGatkaExperience",
      label: "Years of Gatka Experience",
      required: false,
    },
  ],
  team: [
    { field: "teamName", label: "Team Name", required: false },
    { field: "city", label: "City", required: false },
    { field: "state", label: "State", required: false },
    { field: "country", label: "Country", required: false },
    { field: "ustads", label: "Ustads", required: false },
    { field: "seniorGatkaiName", label: "Senior Gatkai Name", required: false },
    {
      field: "seniorGatkaiEmail",
      label: "Senior Gatkai Email",
      required: false,
    },
    { field: "playerOrder1", label: "1st Position", required: false },
    { field: "playerOrder2", label: "2nd Position", required: false },
    { field: "playerOrder3", label: "3rd Position", required: false },
    { field: "teamPhotos", label: "Team Photos", required: false },
  ],
};

// Helper function to check if a field is required
export const isFieldRequired = (fieldName: string): boolean => {
  for (const configKey in FIELD_CONFIG) {
    const config = FIELD_CONFIG[configKey];
    const fieldConfig = config.find((item) => item.field === fieldName);
    if (fieldConfig) {
      return fieldConfig.required;
    }
  }
  return false;
};

// Generic validation function
export const validateFieldsFromConfig = (
  configKey: string,
  formData: FormData
): { isValid: boolean; missingFields: string[] } => {
  const config = FIELD_CONFIG[configKey];
  if (!config) {
    return { isValid: false, missingFields: [] };
  }

  const missingFields: string[] = [];
  config.forEach(({ field, label, required }) => {
    if (required) {
      const value = formData[field];
      const isEmpty =
        !value || (typeof value === "string" && value.trim() === "");
      if (isEmpty) {
        missingFields.push(label);
      }
    }
  });

  return { isValid: missingFields.length === 0, missingFields };
};
