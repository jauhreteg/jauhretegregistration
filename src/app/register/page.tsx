"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlayerForm from "@/components/player-form";
import TeamForm from "@/components/team-form";
import { BackupPlayerDecision } from "@/components/backup-player-decision";
import { DivisionSelection } from "@/components/division-selection";
import { FormLayout } from "@/components/form-layout";
import { RegistrationSuccess } from "@/components/registration-success";

import { isFieldRequired } from "@/config/form-config";
import { getPlayerData, getTeamData, getPlayerNames } from "@/utils/form-utils";
import { useFormData } from "@/hooks/use-form-data";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useFormNavigation } from "@/hooks/use-form-navigation";
import { generateRegistrationToken } from "@/lib/registration-token";

export default function RegisterPage() {
  const router = useRouter();

  // Custom hooks for form management
  const { formData, updateField } = useFormData();
  const {
    validationErrors,
    validateStep,
    validateField,
    setFieldError,
    clearFieldError,
  } = useFormValidation();
  const { currentStep, nextStep, prevStep, canGoNext, canGoBack } =
    useFormNavigation(6);

  const [stepValidation, setStepValidation] = useState<{
    isValid: boolean;
    missingFields: string[];
  }>({ isValid: true, missingFields: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string>("");

  // Form step definitions
  const steps = [
    { label: "DIVISION", completed: currentStep > 1 },
    { label: "PLAYER 1", completed: currentStep > 2 },
    { label: "PLAYER 2", completed: currentStep > 3 },
    { label: "PLAYER 3", completed: currentStep > 4 },
    { label: "BACKUP PLAYER", completed: currentStep > 5 },
    { label: "TEAM INFO", completed: currentStep > 6 },
  ];

  // Real-time field validation and updates
  const handleFieldChange = (
    field: string,
    value: string | File | File[] | null | boolean
  ) => {
    updateField(field as any, value);

    // Real-time validation for string fields
    if (typeof value === "string") {
      const error = validateField(field, value);
      if (error) {
        setFieldError(field, error);
      } else {
        clearFieldError(field);
      }
    }
  };

  // Player form handlers
  const handlePlayerFieldChange = (
    field: string,
    value: string | File | null
  ) => {
    handleFieldChange(field, value);
  };

  const handlePlayerValidationError = (
    field: string,
    error: string | undefined
  ) => {
    setFieldError(field, error);
  };

  // Navigation handlers
  const handleNext = () => {
    const validation = validateStep(currentStep, formData);
    setStepValidation(validation);

    if (validation.isValid) {
      setStepValidation({ isValid: true, missingFields: [] });
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate unique registration token
      const token = generateRegistrationToken();

      // TODO: Implement actual form submission to backend
      console.log("Submitting form:", formData);
      console.log("Registration token:", token);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success state
      setRegistrationToken(token);
      setIsSubmissionComplete(true);
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Form submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    router.push("/");
  };

  // Render current step content
  const renderStepContent = () => {
    // Show success component if submission is complete
    if (isSubmissionComplete) {
      return (
        <RegistrationSuccess
          registrationToken={registrationToken}
          onComplete={handleComplete}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <DivisionSelection
            value={formData.division}
            onValueChange={(value) => handleFieldChange("division", value)}
            isRequired={isFieldRequired}
          />
        );

      case 2:
        return (
          <PlayerForm
            playerType="player1"
            playerData={getPlayerData(formData, "player1")}
            validationErrors={validationErrors}
            onFieldChange={handlePlayerFieldChange}
            onValidationError={handlePlayerValidationError}
            isRequired={isFieldRequired}
            division={formData.division}
          />
        );

      case 3:
        return (
          <PlayerForm
            playerType="player2"
            playerData={getPlayerData(formData, "player2")}
            validationErrors={validationErrors}
            onFieldChange={handlePlayerFieldChange}
            onValidationError={handlePlayerValidationError}
            isRequired={isFieldRequired}
            division={formData.division}
          />
        );

      case 4:
        return (
          <PlayerForm
            playerType="player3"
            playerData={getPlayerData(formData, "player3")}
            validationErrors={validationErrors}
            onFieldChange={handlePlayerFieldChange}
            onValidationError={handlePlayerValidationError}
            isRequired={isFieldRequired}
            division={formData.division}
          />
        );

      case 5:
        return (
          <div className="space-y-6">
            <BackupPlayerDecision
              value={formData.hasBackupPlayer}
              onValueChange={(value) =>
                handleFieldChange("hasBackupPlayer", value)
              }
              isRequired={isFieldRequired}
            />

            {/* Backup Player Information Form - Shows when Yes is selected */}
            {formData.hasBackupPlayer === true && (
              <PlayerForm
                playerType="backup"
                playerData={getPlayerData(formData, "backup")}
                validationErrors={validationErrors}
                onFieldChange={handlePlayerFieldChange}
                onValidationError={handlePlayerValidationError}
                isRequired={isFieldRequired}
                division={formData.division}
              />
            )}
          </div>
        );

      case 6:
        return (
          <TeamForm
            teamData={getTeamData(formData)}
            validationErrors={validationErrors}
            onFieldChange={handleFieldChange}
            onValidationError={handlePlayerValidationError}
            isRequired={isFieldRequired}
            playerNames={getPlayerNames(formData)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormLayout
      title="JAUHR E TEG REGISTRATION"
      currentStep={isSubmissionComplete ? 7 : currentStep}
      totalSteps={6}
      steps={steps}
      validationError={{
        isVisible: !stepValidation.isValid && !isSubmissionComplete,
        missingFields: stepValidation.missingFields,
      }}
      navigation={{
        canGoBack: !isSubmissionComplete && canGoBack,
        canGoNext: !isSubmissionComplete && canGoNext,
        isLastStep: isSubmissionComplete || currentStep === 6,
        onBack: prevStep,
        onNext: handleNext,
        onSubmit: isSubmissionComplete ? handleComplete : handleSubmit,
        isSubmitting,
        hideStepCounter: isSubmissionComplete,
        customSubmitText: isSubmissionComplete ? "COMPLETE" : undefined,
      }}
    >
      {renderStepContent()}
    </FormLayout>
  );
}
