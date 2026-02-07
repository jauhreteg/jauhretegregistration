"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";
import { Ustad } from "@/types/database";
import {
  validateSingleUstad,
  validateEmailUniqueness,
  createEmptyUstad,
  normalizeUstadsArray,
} from "@/utils/ustads-utils";

interface UstadManagerProps {
  ustads: Ustad[];
  onUstadsChange: (ustads: Ustad[]) => void;
  validationErrors?: Record<string, string>;
  onValidationError?: (field: string, error: string | undefined) => void;
  isRequired?: (fieldName: string) => boolean;
  className?: string;
  maxUstads?: number;
}

interface UstadRowProps {
  ustad: Ustad;
  index: number;
  ustads: Ustad[];
  onUpdate: (index: number, ustad: Ustad) => void;
  onRemove: (index: number) => void;
  onValidationError?: (field: string, error: string | undefined) => void;
  validationErrors?: Record<string, string>;
  canRemove: boolean;
  isRequired?: (fieldName: string) => boolean;
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

const UstadRow: React.FC<UstadRowProps> = ({
  ustad,
  index,
  ustads,
  onUpdate,
  onRemove,
  onValidationError,
  validationErrors,
  canRemove,
  isRequired,
}) => {
  const handleNameChange = (name: string) => {
    const updatedUstad = { ...ustad, name };
    onUpdate(index, updatedUstad);

    // Clear validation error when user starts typing
    onValidationError?.(`ustad_${index}_name`, undefined);
  };

  const handleEmailChange = (email: string) => {
    const updatedUstad = { ...ustad, email };
    onUpdate(index, updatedUstad);

    // Clear validation errors when user starts typing
    onValidationError?.(`ustad_${index}_email`, undefined);
    onValidationError?.(`ustad_${index}_email_unique`, undefined);
  };

  const handleNameBlur = () => {
    // Validate name on blur
    const nameError = validateSingleUstad({
      ...ustad,
      email: ustad.email || "dummy@example.com",
    });
    if (nameError && nameError.includes("Name")) {
      onValidationError?.(`ustad_${index}_name`, nameError);
    }
  };

  const handleEmailBlur = () => {
    // Validate email format
    const emailError = validateSingleUstad({
      ...ustad,
      name: ustad.name || "DummyName",
    });
    if (emailError && emailError.includes("email")) {
      onValidationError?.(`ustad_${index}_email`, emailError);
      return;
    }

    // Validate email uniqueness
    const uniqueError = validateEmailUniqueness(ustad.email, index, ustads);
    if (uniqueError) {
      onValidationError?.(`ustad_${index}_email_unique`, uniqueError);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg ${
        ustad.needs_update
          ? "bg-orange-50/80 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700"
          : "bg-gray-50/50 dark:bg-gray-800/50"
      }`}
    >
      <div className="flex-shrink-0 mt-2">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`ustad-name-${index}`}>
            Ustad {index + 1} Name{" "}
            <RequiredAsterisk fieldName="ustads" isRequired={isRequired} />
            {ustad.needs_update && (
              <span className="text-xs text-orange-600 ml-1">
                (needs update)
              </span>
            )}
          </Label>
          <Input
            id={`ustad-name-${index}`}
            type="text"
            value={ustad.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            placeholder={`Enter ustad ${index + 1} name`}
            className={`h-10 ${
              validationErrors?.[`ustad_${index}_name`]
                ? "border-red-500 focus:border-red-500"
                : ustad.needs_update
                  ? "border-orange-400 focus:border-orange-500"
                  : "border-gray-300 focus:border-gray-500"
            }`}
          />
          {validationErrors?.[`ustad_${index}_name`] && (
            <p className="text-sm text-red-600">
              {validationErrors[`ustad_${index}_name`]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`ustad-email-${index}`}>
            Ustad {index + 1} Email{" "}
            <RequiredAsterisk fieldName="ustads" isRequired={isRequired} />
            {ustad.needs_update && (
              <span className="text-xs text-orange-600 ml-1">
                (needs update)
              </span>
            )}
          </Label>
          <Input
            id={`ustad-email-${index}`}
            type="email"
            value={ustad.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder={`ustad${index + 1}@example.com`}
            className={`h-10 ${
              validationErrors?.[`ustad_${index}_email`] ||
              validationErrors?.[`ustad_${index}_email_unique`]
                ? "border-red-500 focus:border-red-500"
                : ustad.needs_update
                  ? "border-orange-400 focus:border-orange-500"
                  : "border-gray-300 focus:border-gray-500"
            }`}
          />
          {validationErrors?.[`ustad_${index}_email`] && (
            <p className="text-sm text-red-600">
              {validationErrors[`ustad_${index}_email`]}
            </p>
          )}
          {validationErrors?.[`ustad_${index}_email_unique`] && (
            <p className="text-sm text-red-600">
              {validationErrors[`ustad_${index}_email_unique`]}
            </p>
          )}
        </div>
      </div>

      {canRemove && (
        <div className="flex-shrink-0 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title={`Remove ustad ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default function UstadManager({
  ustads,
  onUstadsChange,
  validationErrors = {},
  onValidationError,
  isRequired = () => false,
  className = "",
  maxUstads = 5,
}: UstadManagerProps) {
  const handleAddUstad = () => {
    if (ustads.length >= maxUstads) return;

    const newUstads = [...ustads, createEmptyUstad()];
    onUstadsChange(newUstads);
  };

  const handleRemoveUstad = (index: number) => {
    if (ustads.length <= 1) return; // Always keep at least one ustad

    const newUstads = ustads.filter((_, i) => i !== index);
    onUstadsChange(newUstads);

    // Clear validation errors for removed ustad
    onValidationError?.(`ustad_${index}_name`, undefined);
    onValidationError?.(`ustad_${index}_email`, undefined);
    onValidationError?.(`ustad_${index}_email_unique`, undefined);
  };

  const handleUpdateUstad = (index: number, ustad: Ustad) => {
    const newUstads = [...ustads];
    newUstads[index] = ustad;
    onUstadsChange(newUstads);
  };

  // Ensure we have at least one ustad
  React.useEffect(() => {
    if (ustads.length === 0) {
      onUstadsChange([createEmptyUstad()]);
    }
  }, [ustads.length, onUstadsChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">
            Ustads{" "}
            <RequiredAsterisk fieldName="ustads" isRequired={isRequired} />
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Add team ustads (maximum {maxUstads}). Each ustad must have both
            name and email.
          </p>
        </div>

        {ustads.length < maxUstads && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUstad}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ustad
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {ustads.map((ustad, index) => (
          <UstadRow
            key={index}
            ustad={ustad}
            index={index}
            ustads={ustads}
            onUpdate={handleUpdateUstad}
            onRemove={handleRemoveUstad}
            onValidationError={onValidationError}
            validationErrors={validationErrors}
            canRemove={ustads.length > 1}
            isRequired={isRequired}
          />
        ))}
      </div>

      {ustads.length >= maxUstads && (
        <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          Maximum {maxUstads} ustads reached. Remove an existing ustad to add a
          new one.
        </p>
      )}

      {/* Global validation error display */}
      {validationErrors?.ustads && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {validationErrors.ustads}
        </p>
      )}
    </div>
  );
}
