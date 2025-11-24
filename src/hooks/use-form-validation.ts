import { useState, useCallback } from "react";
import { FormData } from "@/types/form-types";
import { validateFieldsFromConfig } from "@/config/form-config";
import { validateEmail, validatePhoneNumber } from "@/utils/form-utils";

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

export function useFormValidation() {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const validateStep = useCallback(
    (step: number, formData: FormData): ValidationResult => {
      switch (step) {
        case 1:
          return validateFieldsFromConfig("division", formData);
        case 2:
          return validateFieldsFromConfig("player1", formData);
        case 3:
          return validateFieldsFromConfig("player2", formData);
        case 4:
          return validateFieldsFromConfig("player3", formData);
        case 5:
          // Check if backup player decision has been made
          const hasBackupDecision =
            formData.hasBackupPlayer !== null &&
            formData.hasBackupPlayer !== undefined;

          if (!hasBackupDecision) {
            return {
              isValid: false,
              missingFields: ["Backup Player Decision"],
            };
          }

          // If backup player selected, validate backup player fields
          if (formData.hasBackupPlayer === true) {
            return validateFieldsFromConfig("backup", formData);
          }

          // If no backup player (false), that's valid
          return { isValid: true, missingFields: [] };
        case 6:
          return validateFieldsFromConfig("team", formData);
        default:
          return { isValid: false, missingFields: [] };
      }
    },
    []
  );

  const validateField = useCallback(
    (field: string, value: string, countryCode?: string): string | null => {
      // Email validation
      if (field.includes("Email")) {
        return validateEmail(value);
      }

      // Phone validation
      if (field.includes("Phone") && !field.includes("Emergency")) {
        return validatePhoneNumber(value, countryCode || "+1");
      }

      return null;
    },
    []
  );

  const setFieldError = useCallback(
    (field: string, error: string | undefined) => {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    []
  );

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    validateStep,
    validateField,
    setFieldError,
    clearFieldError,
    clearAllErrors,
  };
}
