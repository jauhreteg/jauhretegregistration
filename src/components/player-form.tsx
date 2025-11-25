"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";
import { FileUpload } from "@/components/file-upload";
import { useTheme } from "@/contexts/theme-context";

// Country codes data
const COUNTRY_CODES = [
  { code: "+1", name: "United States/Canada", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
].sort((a, b) => a.name.localeCompare(b.name));

// Validation utility functions
const validateEmail = (email: string): string | null => {
  if (!email) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : "Please enter a valid email address";
};

const validatePhoneNumber = (
  phone: string,
  countryCode: string
): string | null => {
  if (!phone) return null;

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, "");

  // Phone number validation with actual international standards
  const phoneValidation = {
    "+1": { min: 10, max: 10, name: "United States/Canada" }, // NANP format
    "+44": { min: 10, max: 10, name: "United Kingdom" }, // UK mobile/landline
    "+91": { min: 10, max: 10, name: "India" }, // Indian mobile numbers
    "+61": { min: 9, max: 9, name: "Australia" }, // Australian mobile numbers
    "+33": { min: 10, max: 10, name: "France" }, // French numbers
    "+49": { min: 11, max: 12, name: "Germany" }, // German numbers
    "+81": { min: 10, max: 11, name: "Japan" }, // Japanese numbers
    "+86": { min: 11, max: 11, name: "China" }, // Chinese mobile numbers
    "+7": { min: 10, max: 10, name: "Russia" }, // Russian mobile numbers
    "+39": { min: 9, max: 11, name: "Italy" }, // Italian numbers
    "+34": { min: 9, max: 9, name: "Spain" }, // Spanish numbers
    "+31": { min: 9, max: 9, name: "Netherlands" }, // Dutch numbers
    "+46": { min: 7, max: 9, name: "Sweden" }, // Swedish numbers
    "+47": { min: 8, max: 8, name: "Norway" }, // Norwegian mobile numbers
    "+45": { min: 8, max: 8, name: "Denmark" }, // Danish numbers
    "+41": { min: 9, max: 9, name: "Switzerland" }, // Swiss numbers
    "+43": { min: 10, max: 13, name: "Austria" }, // Austrian numbers
    "+32": { min: 8, max: 9, name: "Belgium" }, // Belgian numbers
    "+351": { min: 9, max: 9, name: "Portugal" }, // Portuguese numbers
    "+30": { min: 10, max: 10, name: "Greece" }, // Greek numbers
    "+90": { min: 10, max: 10, name: "Turkey" }, // Turkish mobile numbers
    "+52": { min: 10, max: 12, name: "Mexico" }, // Mexican numbers with area codes
    "+55": { min: 10, max: 11, name: "Brazil" }, // Brazilian mobile numbers
    "+54": { min: 8, max: 11, name: "Argentina" }, // Argentine numbers
    "+56": { min: 8, max: 9, name: "Chile" }, // Chilean numbers
    "+57": { min: 10, max: 10, name: "Colombia" }, // Colombian mobile numbers
    "+51": { min: 8, max: 9, name: "Peru" }, // Peruvian numbers
    "+27": { min: 9, max: 9, name: "South Africa" }, // South African mobile numbers
    "+20": { min: 10, max: 10, name: "Egypt" }, // Egyptian mobile numbers
    "+971": { min: 8, max: 9, name: "UAE" }, // UAE mobile numbers
    "+966": { min: 9, max: 9, name: "Saudi Arabia" }, // Saudi mobile numbers
    "+65": { min: 8, max: 8, name: "Singapore" }, // Singapore numbers
    "+60": { min: 8, max: 10, name: "Malaysia" }, // Malaysian numbers
    "+66": { min: 8, max: 9, name: "Thailand" }, // Thai mobile numbers
    "+84": { min: 9, max: 10, name: "Vietnam" }, // Vietnamese numbers
    "+62": { min: 7, max: 12, name: "Indonesia" }, // Indonesian numbers (varies by region)
    "+63": { min: 10, max: 10, name: "Philippines" }, // Philippine mobile numbers
    "+82": { min: 9, max: 11, name: "South Korea" }, // Korean numbers
    "+64": { min: 8, max: 10, name: "New Zealand" }, // New Zealand numbers
  };

  const validation =
    phoneValidation[countryCode as keyof typeof phoneValidation];

  // Get country name from COUNTRY_CODES if not in validation
  const countryInfo = COUNTRY_CODES.find((c) => c.code === countryCode);
  const countryName = validation?.name || countryInfo?.name || countryCode;

  if (!validation) {
    // Fallback validation for countries not specifically defined
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return `Phone number for ${countryName} should be between 7-15 digits`;
    }
    return null;
  }

  if (
    cleanPhone.length < validation.min ||
    cleanPhone.length > validation.max
  ) {
    return `Phone number for ${validation.name} should be ${validation.min}${
      validation.min !== validation.max ? `-${validation.max}` : ""
    } digits`;
  }

  return null;
};

import { PlayerType, PlayerData } from "@/types/form-types";

interface PlayerFormProps {
  playerType: PlayerType;
  playerData: PlayerData;
  validationErrors: Record<string, string | undefined>;
  onFieldChange: (field: string, value: string | File | null) => void;
  onValidationError: (field: string, error: string | undefined) => void;
  isRequired?: (fieldName: string) => boolean;
  division?: string;
}

const RequiredAsterisk = ({
  fieldName,
  isRequired,
}: {
  fieldName: string;
  isRequired?: (fieldName: string) => boolean;
}) => {
  return isRequired?.(fieldName) ? (
    <span className="text-red-600">*</span>
  ) : null;
};

export default function PlayerForm({
  playerType,
  playerData,
  validationErrors,
  onFieldChange,
  onValidationError,
  isRequired = () => false,
  division,
}: PlayerFormProps) {
  const { isDarkMode } = useTheme();

  // Helper to determine if proof of age is required based on division
  const isProofOfAgeRequired = () => {
    if (!division) return true; // Show by default if no division selected
    return division === "Junior Kaurs" || division === "Junior Singhs";
  };

  // Helper to get field name with player prefix
  const getFieldName = (field: keyof PlayerData) =>
    `${playerType}${field.charAt(0).toUpperCase() + field.slice(1)}`;

  // Helper to get player display name
  const getPlayerDisplayName = () => {
    switch (playerType) {
      case "player1":
        return "Player 1";
      case "player2":
        return "Player 2";
      case "player3":
        return "Player 3";
      case "backup":
        return "Backup Player";
    }
  };

  // Enhanced field change handler with validation
  const handleFieldChange = (
    field: keyof PlayerData,
    value: string | File | null
  ) => {
    const fieldName = getFieldName(field);
    onFieldChange(fieldName, value);

    // Real-time validation for email and phone fields
    if (typeof value === "string") {
      let error: string | null = null;

      // Email validation
      if (field === "email") {
        error = validateEmail(value);
      }

      // Phone validation
      if (field === "phone") {
        error = validatePhoneNumber(value, playerData.countryCode);
      }

      // Emergency phone validation (same as main phone)
      if (field === "emergencyContactPhone") {
        error = validatePhoneNumber(
          value,
          playerData.emergencyContactCountryCode
        );
      }

      onValidationError(fieldName, error || undefined);
    }
  };

  // Handle country code change with phone re-validation
  const handleCountryCodeChange = (value: string) => {
    handleFieldChange("countryCode", value);
    // Re-validate phone number when country code changes
    if (playerData.phone) {
      const phoneError = validatePhoneNumber(playerData.phone, value);
      onValidationError(getFieldName("phone"), phoneError || undefined);
    }
  };

  // Handle emergency contact country code change with phone re-validation
  const handleEmergencyCountryCodeChange = (value: string) => {
    handleFieldChange("emergencyContactCountryCode", value);
    // Re-validate emergency contact phone number when country code changes
    if (playerData.emergencyContactPhone) {
      const phoneError = validatePhoneNumber(
        playerData.emergencyContactPhone,
        value
      );
      onValidationError(
        getFieldName("emergencyContactPhone"),
        phoneError || undefined
      );
    }
  };

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-xl font-bold uppercase mb-6 font-montserrat">
        {getPlayerDisplayName()} Information
      </h2>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={getFieldName("firstName")}>
              First Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("firstName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("firstName")}
              value={playerData.firstName}
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              placeholder="First name"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={getFieldName("middleName")}>
              Middle Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("middleName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("middleName")}
              value={playerData.middleName}
              onChange={(e) => handleFieldChange("middleName", e.target.value)}
              placeholder="Middle name (optional)"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={getFieldName("lastName")}>
              Last Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("lastName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("lastName")}
              type="text"
              placeholder="Last name"
              value={playerData.lastName}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              className={`h-10 font-montserrat ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-gray-500"
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={getFieldName("singhKaur")}>
            (Singh / Kaur){" "}
            <RequiredAsterisk
              fieldName={getFieldName("singhKaur")}
              isRequired={isRequired}
            />
          </Label>
          <Select
            value={playerData.singhKaur}
            onValueChange={(value) => handleFieldChange("singhKaur", value)}
          >
            <SelectTrigger
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            >
              <SelectValue placeholder="Select Singh or Kaur" />
            </SelectTrigger>
            <SelectContent
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <SelectItem value="Singh">Singh</SelectItem>
              <SelectItem value="Kaur">Kaur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Birth Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Birth Information
        </h3>
        <div className="space-y-2">
          <Label>
            Date of Birth{" "}
            <RequiredAsterisk
              fieldName={getFieldName("dob")}
              isRequired={isRequired}
            />
          </Label>
          <div className="mt-2">
            <DatePicker
              key={playerType}
              storageKey={`${playerType}-dob`}
              value={
                playerData.dob && playerData.dob.trim()
                  ? new Date(playerData.dob + "T00:00:00")
                  : undefined
              }
              onChange={(date) => {
                const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                const fieldName = getFieldName("dob");
                handleFieldChange(fieldName, formattedDate);
              }}
              placeholder="Pick a date"
              className={
                isDarkMode
                  ? "border-gray-600 bg-gray-800 hover:bg-gray-700 focus:border-gray-400"
                  : "border-gray-300 bg-white hover:bg-gray-50 focus:border-gray-500"
              }
            />
          </div>
        </div>

        {isProofOfAgeRequired() && (
          <FileUpload
            id={getFieldName("proofOfAge")}
            label="Proof of Age Document"
            value={playerData.proofOfAge}
            onChange={(file) =>
              handleFieldChange("proofOfAge", file as File | null)
            }
            accept="image/*,.pdf"
            multiple={false}
            required={isRequired?.(getFieldName("proofOfAge"))}
            placeholder="Click to upload birth certificate, passport, or ID"
            description="Upload a clear photo of birth certificate, passport, driver's license, or school document showing full name and birthday."
          />
        )}
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Contact Information
        </h3>
        <div className="space-y-2">
          <Label htmlFor={getFieldName("email")}>
            Email{" "}
            <RequiredAsterisk
              fieldName={getFieldName("email")}
              isRequired={isRequired}
            />
          </Label>
          <Input
            id={getFieldName("email")}
            type="email"
            value={playerData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="player@example.com"
            className={`h-10 ${
              validationErrors[getFieldName("email")]
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : isDarkMode
                ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
            }`}
          />
          {validationErrors[getFieldName("email")] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors[getFieldName("email")]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor={getFieldName("countryCode")}>
              Country Code{" "}
              <RequiredAsterisk
                fieldName={getFieldName("countryCode")}
                isRequired={isRequired}
              />
            </Label>
            <Select
              value={playerData.countryCode}
              onValueChange={handleCountryCodeChange}
            >
              <SelectTrigger
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={`max-h-60 overflow-y-auto w-80 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                align="start"
                side="bottom"
              >
                {COUNTRY_CODES.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-base">{country.flag}</span>
                      <span className="text-sm truncate">{country.code}</span>
                      <span className="text-xs text-gray-500 truncate">
                        {country.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-8">
            <Label htmlFor={getFieldName("phone")}>
              Phone Number{" "}
              <RequiredAsterisk
                fieldName={getFieldName("phone")}
                isRequired={isRequired}
              />
            </Label>
            <div className="space-y-1">
              <Input
                id={getFieldName("phone")}
                type="tel"
                value={playerData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="Phone number"
                className={`h-10 ${
                  validationErrors[getFieldName("phone")]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
              {validationErrors[getFieldName("phone")] && (
                <p className="text-red-500 text-sm">
                  {validationErrors[getFieldName("phone")]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Emergency Contact
        </h3>

        {/* Emergency Contact Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={getFieldName("emergencyContactFirstName")}>
              First Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("emergencyContactFirstName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("emergencyContactFirstName")}
              value={playerData.emergencyContactFirstName}
              onChange={(e) =>
                handleFieldChange("emergencyContactFirstName", e.target.value)
              }
              placeholder="First name"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={getFieldName("emergencyContactMiddleName")}>
              Middle Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("emergencyContactMiddleName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("emergencyContactMiddleName")}
              value={playerData.emergencyContactMiddleName}
              onChange={(e) =>
                handleFieldChange("emergencyContactMiddleName", e.target.value)
              }
              placeholder="Middle name (optional)"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={getFieldName("emergencyContactLastName")}>
              Last Name{" "}
              <RequiredAsterisk
                fieldName={getFieldName("emergencyContactLastName")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("emergencyContactLastName")}
              value={playerData.emergencyContactLastName}
              onChange={(e) =>
                handleFieldChange("emergencyContactLastName", e.target.value)
              }
              placeholder="Last name"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Emergency Contact Phone */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor={getFieldName("emergencyContactCountryCode")}>
              Country Code{" "}
              <RequiredAsterisk
                fieldName={getFieldName("emergencyContactCountryCode")}
                isRequired={isRequired}
              />
            </Label>
            <Select
              value={playerData.emergencyContactCountryCode}
              onValueChange={handleEmergencyCountryCodeChange}
            >
              <SelectTrigger
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={`max-h-60 overflow-y-auto w-80 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                align="start"
                side="bottom"
              >
                {COUNTRY_CODES.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-base">{country.flag}</span>
                      <span className="text-sm truncate">{country.code}</span>
                      <span className="text-xs text-gray-500 truncate">
                        {country.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-8">
            <Label htmlFor={getFieldName("emergencyContactPhone")}>
              Phone Number{" "}
              <RequiredAsterisk
                fieldName={getFieldName("emergencyContactPhone")}
                isRequired={isRequired}
              />
            </Label>
            <div className="space-y-1">
              <Input
                id={getFieldName("emergencyContactPhone")}
                type="tel"
                value={playerData.emergencyContactPhone}
                onChange={(e) =>
                  handleFieldChange("emergencyContactPhone", e.target.value)
                }
                placeholder="Phone number"
                className={`h-10 ${
                  validationErrors[getFieldName("emergencyContactPhone")]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
              {validationErrors[getFieldName("emergencyContactPhone")] && (
                <p className="text-red-500 text-sm">
                  {validationErrors[getFieldName("emergencyContactPhone")]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Family Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Family Information
        </h3>

        {/* Father Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Father Name
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={getFieldName("fatherFirstName")}>
                First Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("fatherFirstName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("fatherFirstName")}
                value={playerData.fatherFirstName}
                onChange={(e) =>
                  handleFieldChange("fatherFirstName", e.target.value)
                }
                placeholder="First name"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={getFieldName("fatherMiddleName")}>
                Middle Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("fatherMiddleName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("fatherMiddleName")}
                value={playerData.fatherMiddleName}
                onChange={(e) =>
                  handleFieldChange("fatherMiddleName", e.target.value)
                }
                placeholder="Middle name (optional)"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={getFieldName("fatherLastName")}>
                Last Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("fatherLastName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("fatherLastName")}
                value={playerData.fatherLastName}
                onChange={(e) =>
                  handleFieldChange("fatherLastName", e.target.value)
                }
                placeholder="Last name"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mother Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Mother Name
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={getFieldName("motherFirstName")}>
                First Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("motherFirstName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("motherFirstName")}
                value={playerData.motherFirstName}
                onChange={(e) =>
                  handleFieldChange("motherFirstName", e.target.value)
                }
                placeholder="First name"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={getFieldName("motherMiddleName")}>
                Middle Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("motherMiddleName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("motherMiddleName")}
                value={playerData.motherMiddleName}
                onChange={(e) =>
                  handleFieldChange("motherMiddleName", e.target.value)
                }
                placeholder="Middle name (optional)"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={getFieldName("motherLastName")}>
                Last Name{" "}
                <RequiredAsterisk
                  fieldName={getFieldName("motherLastName")}
                  isRequired={isRequired}
                />
              </Label>
              <Input
                id={getFieldName("motherLastName")}
                value={playerData.motherLastName}
                onChange={(e) =>
                  handleFieldChange("motherLastName", e.target.value)
                }
                placeholder="Last name"
                className={`h-10 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location and Experience Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Location & Experience
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={getFieldName("pindVillage")}>
              Pind/Village or Town/City{" "}
              <RequiredAsterisk
                fieldName={getFieldName("pindVillage")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("pindVillage")}
              value={playerData.pindVillage}
              onChange={(e) => handleFieldChange("pindVillage", e.target.value)}
              placeholder="Place of residence"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={getFieldName("gatkaExperience")}>
              Years of Gatka Experience{" "}
              <RequiredAsterisk
                fieldName={getFieldName("gatkaExperience")}
                isRequired={isRequired}
              />
            </Label>
            <Input
              id={getFieldName("gatkaExperience")}
              type="number"
              min="0"
              value={playerData.gatkaExperience}
              onChange={(e) =>
                handleFieldChange("gatkaExperience", e.target.value)
              }
              placeholder="Years of experience"
              className={`h-10 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
