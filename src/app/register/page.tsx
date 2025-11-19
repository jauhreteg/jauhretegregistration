"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle } from "lucide-react";

type FormData = {
  // Team Information
  teamName: string;
  ustadName: string;
  ustadEmail: string;
  seniorCoachEmail: string;
  city: string;
  state: string;
  country: string;
  division: string;
  teamPhoto: File | null;
  playerOrder1: string;
  playerOrder2: string;
  playerOrder3: string;
  hasBackupPlayer: boolean;

  // Player 1
  player1Name: string;
  player1DOB: string;
  player1Email: string;
  player1Phone: string;

  // Player 2
  player2Name: string;
  player2DOB: string;
  player2Email: string;
  player2Phone: string;

  // Player 3
  player3Name: string;
  player3DOB: string;
  player3Email: string;
  player3Phone: string;

  // Player 4 (Optional Backup)
  player4Name: string;
  player4DOB: string;
  player4Email: string;
  player4Phone: string;
};

// Field configuration system
type FieldConfig = {
  field: keyof FormData;
  label: string;
  required: boolean;
};

const FIELD_CONFIG: Record<string, FieldConfig[]> = {
  player1: [
    { field: "player1Name", label: "Full Name", required: true },
    { field: "player1DOB", label: "Date of Birth", required: true },
    { field: "player1Email", label: "Email", required: true },
    { field: "player1Phone", label: "Phone Number", required: true },
  ],
  player2: [
    { field: "player2Name", label: "Full Name", required: true },
    { field: "player2DOB", label: "Date of Birth", required: true },
    { field: "player2Email", label: "Email", required: true },
    { field: "player2Phone", label: "Phone Number", required: true },
  ],
  player3: [
    { field: "player3Name", label: "Full Name", required: true },
    { field: "player3DOB", label: "Date of Birth", required: true },
    { field: "player3Email", label: "Email", required: true },
    { field: "player3Phone", label: "Phone Number", required: true },
  ],
  player4: [
    { field: "player4Name", label: "Full Name", required: false },
    { field: "player4DOB", label: "Date of Birth", required: false },
    { field: "player4Email", label: "Email", required: false },
    { field: "player4Phone", label: "Phone Number", required: false },
  ],
  team: [
    { field: "teamName", label: "Team Name", required: true },
    { field: "ustadName", label: "Ustad Name", required: true },
    { field: "ustadEmail", label: "Ustad Email", required: false },
    { field: "seniorCoachEmail", label: "Senior Coach Email", required: false },
    { field: "city", label: "City", required: true },
    { field: "state", label: "State", required: true },
    { field: "country", label: "Country", required: true },
    { field: "division", label: "Division", required: true },
    { field: "playerOrder1", label: "1st Position", required: true },
    { field: "playerOrder2", label: "2nd Position", required: true },
    { field: "playerOrder3", label: "3rd Position", required: true },
  ],
};

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showBackupPlayerModal, setShowBackupPlayerModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    teamName: "",
    ustadName: "",
    ustadEmail: "",
    seniorCoachEmail: "",
    city: "",
    state: "",
    country: "",
    division: "",
    teamPhoto: null,
    playerOrder1: "Player 1",
    playerOrder2: "Player 2",
    playerOrder3: "Player 3",
    hasBackupPlayer: false,
    player1Name: "",
    player1DOB: "",
    player1Email: "",
    player1Phone: "",
    player2Name: "",
    player2DOB: "",
    player2Email: "",
    player2Phone: "",
    player3Name: "",
    player3DOB: "",
    player3Email: "",
    player3Phone: "",
    player4Name: "",
    player4DOB: "",
    player4Email: "",
    player4Phone: "",
  });

  const totalSteps = formData.hasBackupPlayer ? 6 : 5;

  const updateFormData = (
    field: keyof FormData,
    value: string | File | null | boolean
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  // Helper function to check if a field is required
  const isFieldRequired = (fieldName: keyof FormData): boolean => {
    for (const configKey in FIELD_CONFIG) {
      const config = FIELD_CONFIG[configKey];
      const fieldConfig = config.find((item) => item.field === fieldName);
      if (fieldConfig) {
        return fieldConfig.required;
      }
    }
    return false;
  };

  // Helper component for required asterisk
  const RequiredAsterisk = ({ fieldName }: { fieldName: keyof FormData }) => {
    return isFieldRequired(fieldName) ? (
      <span className="text-red-600">*</span>
    ) : null;
  };

  // Generic validation function
  const validateFieldsFromConfig = (
    configKey: string
  ): { isValid: boolean; missingFields: string[] } => {
    const config = FIELD_CONFIG[configKey];
    if (!config) {
      return { isValid: true, missingFields: [] };
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

  const validateCurrentStep = (): {
    isValid: boolean;
    missingFields: string[];
  } => {
    switch (currentStep) {
      case 1:
        return validateFieldsFromConfig("player1");
      case 2:
        return validateFieldsFromConfig("player2");
      case 3:
        return validateFieldsFromConfig("player3");
      case 4:
        return formData.hasBackupPlayer
          ? validateFieldsFromConfig("player4")
          : validateFieldsFromConfig("team");
      case 5:
        return formData.hasBackupPlayer
          ? validateFieldsFromConfig("team")
          : { isValid: true, missingFields: [] };
      case 6:
        return validateFieldsFromConfig("team");
      default:
        return { isValid: false, missingFields: [] };
    }
  };

  const [stepValidation, setStepValidation] = useState<{
    isValid: boolean;
    missingFields: string[];
  }>({ isValid: true, missingFields: [] });

  const handleNext = () => {
    const validation = validateCurrentStep();
    setStepValidation(validation);

    if (!validation.isValid) {
      return;
    }

    // Special handling after Player 3 - show backup player modal
    if (currentStep === 3) {
      setShowBackupPlayerModal(true);
      return;
    }

    setStepValidation({ isValid: true, missingFields: [] });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackupPlayerDecision = (hasBackup: boolean) => {
    updateFormData("hasBackupPlayer", hasBackup);
    setShowBackupPlayerModal(false);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">
              Jauhr E Teg Registration
            </h1>
            <p className="text-gray-600">
              Complete all sections to register your team
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span
              className={`text-xs font-medium ${
                currentStep >= 1 ? "text-[#F5A623]" : "text-gray-400"
              }`}
            >
              PLAYER 1
            </span>
            <span
              className={`text-xs font-medium ${
                currentStep >= 2 ? "text-[#F5A623]" : "text-gray-400"
              }`}
            >
              PLAYER 2
            </span>
            <span
              className={`text-xs font-medium ${
                currentStep >= 3 ? "text-[#F5A623]" : "text-gray-400"
              }`}
            >
              PLAYER 3
            </span>
            <span
              className={`text-xs font-medium ${
                currentStep >= 4 ? "text-[#F5A623]" : "text-gray-400"
              }`}
            >
              TEAM INFO
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#F5A623] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Validation Errors */}
        {!stepValidation.isValid && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-2">
                  Please complete the following required fields:
                </p>
                <ul className="text-sm text-red-800 space-y-1">
                  {stepValidation.missingFields.map((field, index) => (
                    <li key={index}>• {field}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Backup Player Modal */}
        {showBackupPlayerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Backup Player</h3>
              <p className="text-gray-600 mb-6">
                Will your team have a backup player?
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleBackupPlayerDecision(true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleBackupPlayerDecision(false)}
                  variant="outline"
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white border rounded-lg p-6 md:p-8 mb-6">
          {/* Step 1: Player 1 Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Player 1 Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="player1Name">
                  Full Name <RequiredAsterisk fieldName="player1Name" />
                </Label>
                <Input
                  id="player1Name"
                  value={formData.player1Name}
                  onChange={(e) =>
                    updateFormData("player1Name", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player1DOB">
                  Date of Birth <RequiredAsterisk fieldName="player1DOB" />
                </Label>
                <Input
                  id="player1DOB"
                  type="date"
                  value={formData.player1DOB}
                  onChange={(e) => updateFormData("player1DOB", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player1Email">
                    Email <RequiredAsterisk fieldName="player1Email" />
                  </Label>
                  <Input
                    id="player1Email"
                    type="email"
                    value={formData.player1Email}
                    onChange={(e) =>
                      updateFormData("player1Email", e.target.value)
                    }
                    placeholder="player@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player1Phone">
                    Phone Number <RequiredAsterisk fieldName="player1Phone" />
                  </Label>
                  <Input
                    id="player1Phone"
                    type="tel"
                    value={formData.player1Phone}
                    onChange={(e) =>
                      updateFormData("player1Phone", e.target.value)
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Player 2 Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Player 2 Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="player2Name">
                  Full Name <RequiredAsterisk fieldName="player2Name" />
                </Label>
                <Input
                  id="player2Name"
                  value={formData.player2Name}
                  onChange={(e) =>
                    updateFormData("player2Name", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2DOB">
                  Date of Birth <RequiredAsterisk fieldName="player2DOB" />
                </Label>
                <Input
                  id="player2DOB"
                  type="date"
                  value={formData.player2DOB}
                  onChange={(e) => updateFormData("player2DOB", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player2Email">
                    Email <RequiredAsterisk fieldName="player2Email" />
                  </Label>
                  <Input
                    id="player2Email"
                    type="email"
                    value={formData.player2Email}
                    onChange={(e) =>
                      updateFormData("player2Email", e.target.value)
                    }
                    placeholder="player@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player2Phone">
                    Phone Number <RequiredAsterisk fieldName="player2Phone" />
                  </Label>
                  <Input
                    id="player2Phone"
                    type="tel"
                    value={formData.player2Phone}
                    onChange={(e) =>
                      updateFormData("player2Phone", e.target.value)
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Player 3 Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Player 3 Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="player3Name">
                  Full Name <RequiredAsterisk fieldName="player3Name" />
                </Label>
                <Input
                  id="player3Name"
                  value={formData.player3Name}
                  onChange={(e) =>
                    updateFormData("player3Name", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player3DOB">
                  Date of Birth <RequiredAsterisk fieldName="player3DOB" />
                </Label>
                <Input
                  id="player3DOB"
                  type="date"
                  value={formData.player3DOB}
                  onChange={(e) => updateFormData("player3DOB", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player3Email">
                    Email <RequiredAsterisk fieldName="player3Email" />
                  </Label>
                  <Input
                    id="player3Email"
                    type="email"
                    value={formData.player3Email}
                    onChange={(e) =>
                      updateFormData("player3Email", e.target.value)
                    }
                    placeholder="player@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player3Phone">
                    Phone Number <RequiredAsterisk fieldName="player3Phone" />
                  </Label>
                  <Input
                    id="player3Phone"
                    type="tel"
                    value={formData.player3Phone}
                    onChange={(e) =>
                      updateFormData("player3Phone", e.target.value)
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Backup Player OR Team Information */}
          {currentStep === 4 && !formData.hasBackupPlayer && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Team Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="teamName">
                  Team Name <RequiredAsterisk fieldName="teamName" />
                </Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => updateFormData("teamName", e.target.value)}
                  placeholder="Enter team name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ustadName">
                  Ustad Name <RequiredAsterisk fieldName="ustadName" />
                </Label>
                <Input
                  id="ustadName"
                  value={formData.ustadName}
                  onChange={(e) => updateFormData("ustadName", e.target.value)}
                  placeholder="Enter Ustad name"
                />
              </div>
            </div>
          )}

          {/* Step 4: Backup Player Information (if has backup) */}
          {currentStep === 4 && formData.hasBackupPlayer && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Backup Player Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="player4Name">
                  Full Name <RequiredAsterisk fieldName="player4Name" />
                </Label>
                <Input
                  id="player4Name"
                  value={formData.player4Name}
                  onChange={(e) =>
                    updateFormData("player4Name", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player4DOB">
                  Date of Birth <RequiredAsterisk fieldName="player4DOB" />
                </Label>
                <Input
                  id="player4DOB"
                  type="date"
                  value={formData.player4DOB}
                  onChange={(e) => updateFormData("player4DOB", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player4Email">
                    Email <RequiredAsterisk fieldName="player4Email" />
                  </Label>
                  <Input
                    id="player4Email"
                    type="email"
                    value={formData.player4Email}
                    onChange={(e) =>
                      updateFormData("player4Email", e.target.value)
                    }
                    placeholder="player@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player4Phone">
                    Phone Number <RequiredAsterisk fieldName="player4Phone" />
                  </Label>
                  <Input
                    id="player4Phone"
                    type="tel"
                    value={formData.player4Phone}
                    onChange={(e) =>
                      updateFormData("player4Phone", e.target.value)
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Team Information (if has backup player) */}
          {currentStep === 5 && formData.hasBackupPlayer && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase mb-6">
                Team Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="teamName">
                  Team Name <RequiredAsterisk fieldName="teamName" />
                </Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => updateFormData("teamName", e.target.value)}
                  placeholder="Enter team name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ustadName">
                  Ustad Name <RequiredAsterisk fieldName="ustadName" />
                </Label>
                <Input
                  id="ustadName"
                  value={formData.ustadName}
                  onChange={(e) => updateFormData("ustadName", e.target.value)}
                  placeholder="Enter Ustad name"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button onClick={handleBack} variant="outline" className="px-8">
                BACK
              </Button>
            )}
            {currentStep < totalSteps && (
              <Button
                onClick={handleNext}
                className="bg-black text-white px-8 hover:bg-gray-800"
              >
                NEXT
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button
                onClick={() => alert("Form submitted!")}
                className="bg-black text-white px-8 hover:bg-gray-800"
              >
                SUBMIT
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
