"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  HelpCircle,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RegistrationService } from "@/services/registrationService";
import {
  Registration,
  StatusType,
  FIELD_DISPLAY_NAMES,
  Ustad,
} from "@/types/database";
import { FilePreview } from "@/components/FilePreview";
import { FileUploadManager } from "@/components/FileUploadManager";
import UstadManager from "@/components/UstadManager";
import { formatUstadsDisplay, createEmptyUstad } from "@/utils/ustads-utils";
import { useSuccessNotifications } from "@/hooks/useSuccessNotifications";
import { ToastProvider } from "@/components/ui/toast-provider";

// UserEditableField component for editing fields marked as needing updates
const UserEditableField = ({
  fieldName,
  label,
  value,
  needsUpdate,
  isEditing,
  type = "text",
  multiline = false,
  onChange,
}: {
  fieldName: string;
  label: string;
  value: string | null;
  needsUpdate: boolean;
  isEditing: boolean;
  type?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) => {
  // When not editing, show clean read-only view with orange label if needs update
  if (!isEditing) {
    return (
      <div>
        <Label
          className={`font-medium text-sm mb-1 block ${
            needsUpdate ? "text-orange-600" : "text-gray-700"
          }`}
        >
          {label}
          {needsUpdate && (
            <span className="text-xs text-orange-500 ml-1">(needs update)</span>
          )}
        </Label>
        <p className="text-sm text-gray-700">{value || "Not provided"}</p>
      </div>
    );
  }

  // When editing, only show editable fields for those that need updates
  if (!needsUpdate) {
    // Field doesn't need update, show as read-only even in edit mode
    return (
      <div>
        <Label className="font-medium text-sm mb-1 block text-gray-700">
          {label}
        </Label>
        <p className="text-sm text-gray-700">{value || "Not provided"}</p>
      </div>
    );
  }

  // Field needs update and we're in edit mode, show as editable with orange highlighting
  return (
    <div className="border-2 border-orange-300 rounded-lg p-3 bg-orange-50">
      <Label className="font-medium text-sm mb-2 block text-orange-800">
        {label} <span className="text-orange-600">(Update Required)</span>
      </Label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 bg-orange-50"
          rows={3}
          placeholder={`Please update your ${label.toLowerCase()}`}
        />
      ) : (
        <Input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="border-2 border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 bg-orange-50"
          placeholder={`Please update your ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
};

// StatusBadge component matching the registrations table implementation
const StatusBadge = ({ status }: { status: StatusType }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "new submission":
        return {
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
          icon: <FileText className="h-3 w-3" />,
          label: "New Submission",
        };
      case "in review":
        return {
          className:
            "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
          icon: <Eye className="h-3 w-3" />,
          label: "In Review",
        };
      case "information requested":
        return {
          className:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
          icon: <HelpCircle className="h-3 w-3" />,
          label: "Info Requested",
        };
      case "updated information":
        return {
          className:
            "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
          icon: <Edit2 className="h-3 w-3" />,
          label: "Updated Info",
        };
      case "approved":
        return {
          className:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Approved",
        };
      case "denied":
        return {
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
          icon: <XCircle className="h-3 w-3" />,
          label: "Denied",
        };
      case "dropped":
        return {
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
          icon: <Archive className="h-3 w-3" />,
          label: "Dropped",
        };
      default:
        return {
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
          icon: <FileText className="h-3 w-3" />,
          label:
            String(status).charAt(0).toUpperCase() + String(status).slice(1),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center gap-1 font-medium text-xs px-2 py-1 hover:bg-inherit hover:text-inherit hover:border-inherit pointer-events-none`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

// UserEditableFileField component for editing file fields marked as needing updates
const UserEditableFileField = ({
  fieldName,
  label,
  files,
  needsUpdate,
  isEditing,
  fileType,
  registrationId,
  formToken,
  onChange,
}: {
  fieldName: string;
  label: string;
  files: string[] | null;
  needsUpdate: boolean;
  isEditing: boolean;
  fileType:
    | "team_photo"
    | "player1_dob_proof"
    | "player2_dob_proof"
    | "player3_dob_proof"
    | "backup_dob_proof";
  registrationId: string;
  formToken: string;
  onChange?: (files: string[]) => void;
}) => {
  // When not editing, show clean read-only view with orange label if needs update
  if (!isEditing) {
    return (
      <div>
        <Label
          className={`font-medium ${
            needsUpdate ? "text-orange-600" : "text-gray-700"
          }`}
        >
          {label}
          {needsUpdate && (
            <span className="text-xs text-orange-500 ml-1">(needs update)</span>
          )}
        </Label>
        {files && files.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-6">
            {files.map((fileUrl: string, index: number) => (
              <FilePreview
                key={index}
                url={fileUrl}
                index={index}
                label={label}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
        )}
      </div>
    );
  }

  // When editing, only show editable fields for those that need updates
  if (!needsUpdate) {
    // Field doesn't need update, show as read-only even in edit mode
    return (
      <div>
        <Label className="font-medium text-gray-700">{label}</Label>
        {files && files.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-6">
            {files.map((fileUrl: string, index: number) => (
              <FilePreview
                key={index}
                url={fileUrl}
                index={index}
                label={label}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
        )}
      </div>
    );
  }

  // Field needs update and we're in edit mode, show as editable with orange highlighting
  return (
    <div className="border-2 border-orange-300 rounded-lg p-3 bg-orange-50">
      <div className="mb-2 flex items-center justify-between">
        <Label className="font-medium text-orange-800">{label}</Label>
        <span className="text-xs text-orange-600 font-medium">
          Update Required
        </span>
      </div>
      <FileUploadManager
        files={files}
        label={label}
        fileType={fileType}
        registrationId={registrationId}
        formToken={formToken}
        onFilesChange={(newFiles) => onChange?.(newFiles)}
      />
    </div>
  );
};

// Inner component that uses the toast hook
function ViewRegistrationPageContent() {
  const router = useRouter();
  const [formToken, setFormToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] =
    useState<Registration | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [originalBackupNeedsUpdate, setOriginalBackupNeedsUpdate] = useState<{
    [key: string]: boolean;
  }>({});
  const { showSaveSuccess, showError } = useSuccessNotifications();

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formToken.trim()) {
      setError("Please enter your registration token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await RegistrationService.getRegistrationByToken(
        formToken.trim()
      );

      if (result.error) {
        setError(
          "Registration not found. Please check your token and try again."
        );
      } else if (result.data) {
        setRegistration(result.data);
      } else {
        setError(
          "Registration not found. Please check your token and try again."
        );
      }
    } catch (err) {
      console.error("Error fetching registration:", err);
      setError(
        "An error occurred while searching for your registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleEditRegistration = () => {
    if (!registration) return;

    // Only allow editing if status is "information requested"
    if (registration.status !== "information requested") {
      setError(
        "Registration editing is only allowed when information is requested by admin."
      );
      return;
    }

    // Store original backup player needs_update states
    const backupFields = [
      "backup_name",
      "backup_singh_kaur",
      "backup_dob",
      "backup_dob_proof",
      "backup_phone_number",
      "backup_emergency_contact_name",
      "backup_emergency_contact_phone",
      "backup_father_name",
      "backup_mother_name",
      "backup_city",
      "backup_gatka_experience",
    ];

    const originalStates: { [key: string]: boolean } = {};
    backupFields.forEach((field) => {
      originalStates[`${field}_needs_update`] = registration[
        `${field}_needs_update` as keyof Registration
      ] as boolean;
    });
    setOriginalBackupNeedsUpdate(originalStates);

    setEditedRegistration({ ...registration });
    setIsEditing(true);
    setError("");
  };

  const handleSaveChanges = async () => {
    if (!editedRegistration) return;

    setIsSaving(true);
    setError("");

    try {
      // Mark this as a user update (not admin update)
      if (typeof window !== "undefined") {
        localStorage.setItem("user_update_session", Date.now().toString());
      }

      // Create update object with only the fields we want to change
      const updateData: { [key: string]: any } = {
        status: "updated information" as StatusType,
      };

      // Add only the fields that were actually edited
      if (registration) {
        Object.keys(editedRegistration).forEach((key) => {
          if (
            editedRegistration[key as keyof Registration] !==
            registration[key as keyof Registration]
          ) {
            updateData[key] = editedRegistration[key as keyof Registration];
          }
        });
      }

      const result = await RegistrationService.updateRegistration(
        editedRegistration.id,
        updateData
      );

      if (result.error) {
        showError(
          `Failed to save changes: ${result.error.message || result.error}`
        );
        setError("Failed to save changes. Please try again.");
      } else if (result.data) {
        setRegistration(result.data);
        setIsEditing(false);
        setEditedRegistration(null);
        // Clean up the user update marker
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_update_session");
        }

        // Show success notification
        showSaveSuccess(result.data.form_token, result.data.team_name);

        // Clear any existing errors
        setError("");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showError(`Failed to save changes: ${errorMessage}`);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRegistration(null);
    setError("");
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (!editedRegistration) return;

    // Special handling for backup_player field
    if (fieldName === "backup_player") {
      const hasBackup = value === "true" || value === "Yes";

      setEditedRegistration((prev) => {
        const updated = { ...prev! };
        updated.backup_player = hasBackup;

        // Get backup field names
        const backupFields = [
          "backup_name",
          "backup_singh_kaur",
          "backup_dob",
          "backup_dob_proof",
          "backup_phone_number",
          "backup_emergency_contact_name",
          "backup_emergency_contact_phone",
          "backup_father_name",
          "backup_mother_name",
          "backup_city",
          "backup_gatka_experience",
        ];

        if (!hasBackup) {
          // Set all backup needs_update fields to false when hiding
          backupFields.forEach((field) => {
            (updated as any)[`${field}_needs_update`] = false;
          });

          // Also update admin_notes to remove backup fields from requested_updates
          if (updated.admin_notes?.requested_updates) {
            const currentRequests =
              updated.admin_notes.requested_updates.filter(
                (field) => !backupFields.includes(field)
              );
            updated.admin_notes = {
              ...updated.admin_notes,
              requested_updates: currentRequests,
            };
          }
        } else {
          // Restore original needs_update states when showing
          const fieldsToRestore: string[] = [];
          backupFields.forEach((field) => {
            const originalKey = `${field}_needs_update`;
            if (originalBackupNeedsUpdate[originalKey] !== undefined) {
              (updated as any)[originalKey] =
                originalBackupNeedsUpdate[originalKey];

              // If this field was originally marked for update, add it back to requested_updates
              if (originalBackupNeedsUpdate[originalKey]) {
                fieldsToRestore.push(field);
              }
            }
          });

          // Update admin_notes to restore backup fields to requested_updates
          if (fieldsToRestore.length > 0 && updated.admin_notes) {
            const currentRequests = updated.admin_notes.requested_updates || [];
            const uniqueRequests = [
              ...new Set([...currentRequests, ...fieldsToRestore]),
            ];
            updated.admin_notes = {
              ...updated.admin_notes,
              requested_updates: uniqueRequests,
            };
          }
        }

        return updated;
      });
    } else {
      setEditedRegistration((prev) => ({
        ...prev!,
        [fieldName]: value,
      }));
    }
  };

  const handleUstadsChange = (ustads: Ustad[]) => {
    if (!editedRegistration) return;

    setEditedRegistration((prev) => ({
      ...prev!,
      ustads,
    }));
  };

  const handleFileArrayChange = (fieldName: string, files: string[]) => {
    if (!editedRegistration) return;

    setEditedRegistration((prev) => ({
      ...prev!,
      [fieldName]: files,
    }));
  };

  if (registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div
            className={
              registration.status === "information requested"
                ? "max-w-7xl mx-auto"
                : "max-w-4xl mx-auto"
            }
          >
            <div
              className={
                registration.status === "information requested"
                  ? "flex gap-6"
                  : ""
              }
            >
              <div
                className={
                  registration.status === "information requested"
                    ? "flex-1"
                    : ""
                }
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBackToHome}
                      className="flex items-center gap-2 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Button>
                    {!isEditing ? (
                      <Button
                        onClick={handleEditRegistration}
                        disabled={
                          registration?.status !== "information requested"
                        }
                        className="bg-black text-white hover:bg-[#F5A623] hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit Registration
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          variant="outline"
                          className="bg-white text-black border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold font-montserrat">
                    Registration Details
                  </h1>
                </div>

                {/* Registration Info Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex-1">
                        {!isEditing ? (
                          <span
                            className={`text-xl font-semibold ${
                              registration.team_name_needs_update
                                ? "text-orange-600"
                                : ""
                            }`}
                          >
                            {registration.team_name || "Team Registration"}
                            {registration.team_name_needs_update && (
                              <span className="text-sm text-orange-500 ml-2">
                                (needs update)
                              </span>
                            )}
                          </span>
                        ) : registration.team_name_needs_update ? (
                          <div className="border-2 border-orange-300 rounded-lg p-2 bg-orange-50 flex-1">
                            <Input
                              value={editedRegistration?.team_name || ""}
                              onChange={(e) =>
                                handleFieldChange("team_name", e.target.value)
                              }
                              className="text-xl font-semibold border-2 border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 bg-orange-50"
                              placeholder="Enter team name"
                            />
                          </div>
                        ) : (
                          <span className="text-xl font-semibold">
                            {registration.team_name || "Team Registration"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge status={registration.status} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Form Token:</span>{" "}
                        {registration.form_token}
                      </div>
                      <div>
                        <span className="font-medium">Division:</span>{" "}
                        {registration.division}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>{" "}
                        <div className="text-xs text-gray-600">
                          <div>
                            Date:{" "}
                            {new Date(
                              registration.submission_date_time
                            ).toLocaleDateString()}
                          </div>
                          <div>
                            Time:{" "}
                            {new Date(
                              registration.submission_date_time
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span>{" "}
                        <div className="text-xs text-gray-600">
                          <div>
                            Date:{" "}
                            {new Date(
                              registration.updated_at
                            ).toLocaleDateString()}
                          </div>
                          <div>
                            Time:{" "}
                            {new Date(
                              registration.updated_at
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Location:</span>{" "}
                        {registration.team_location}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      Team Information{" "}
                      {isEditing && (
                        <span className="text-sm text-orange-600 font-normal">
                          (Edit Mode)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {/* Ustads Section */}
                      <div className="col-span-full">
                        {registration.ustads_needs_update && (
                          <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded">
                            <span className="text-sm text-orange-800 font-medium">
                              Please review and update your ustads information
                            </span>
                          </div>
                        )}
                        {isEditing ? (
                          <UstadManager
                            ustads={
                              editedRegistration?.ustads || [createEmptyUstad()]
                            }
                            onUstadsChange={(ustads: Ustad[]) =>
                              handleUstadsChange(ustads)
                            }
                            validationErrors={{}}
                            onValidationError={() => {}}
                            isRequired={() => false}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {registration.ustads &&
                            registration.ustads.length > 0 ? (
                              registration.ustads
                                .map((ustad, index) => [
                                  <div key={`ustad-${index}-name`}>
                                    <span className="text-sm font-medium text-gray-700">
                                      Ustad {index + 1} Name
                                    </span>
                                    <div className="text-gray-900 mt-1">
                                      {ustad.name || "N/A"}
                                    </div>
                                  </div>,
                                  <div key={`ustad-${index}-email`}>
                                    <span className="text-sm font-medium text-gray-700">
                                      Ustad {index + 1} Email
                                    </span>
                                    <div className="text-gray-900 mt-1">
                                      {ustad.email || "N/A"}
                                    </div>
                                  </div>,
                                ])
                                .flat()
                            ) : (
                              <div className="col-span-full">
                                <span className="text-sm font-medium text-gray-700">
                                  Ustads
                                </span>
                                <div className="text-gray-500 italic mt-1">
                                  No ustads assigned
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <UserEditableField
                        fieldName="coach_name"
                        label="Senior Gatkai Coach"
                        value={
                          isEditing
                            ? editedRegistration?.coach_name || ""
                            : registration.coach_name
                        }
                        isEditing={isEditing}
                        needsUpdate={registration.coach_name_needs_update}
                        onChange={(value) =>
                          handleFieldChange("coach_name", value)
                        }
                      />
                      <UserEditableField
                        fieldName="coach_email"
                        label="Senior Gatkai Coach Email"
                        value={
                          isEditing
                            ? editedRegistration?.coach_email || ""
                            : registration.coach_email
                        }
                        isEditing={isEditing}
                        needsUpdate={registration.coach_email_needs_update}
                        type="email"
                        onChange={(value) =>
                          handleFieldChange("coach_email", value)
                        }
                      />
                      <UserEditableField
                        fieldName="team_location"
                        label="Team Location"
                        value={
                          isEditing
                            ? editedRegistration?.team_location || ""
                            : registration.team_location
                        }
                        isEditing={isEditing}
                        needsUpdate={registration.team_location_needs_update}
                        onChange={(value) =>
                          handleFieldChange("team_location", value)
                        }
                      />
                    </div>
                    <UserEditableField
                      fieldName="player_order"
                      label="Player Order"
                      value={
                        isEditing
                          ? editedRegistration?.player_order || ""
                          : registration.player_order
                      }
                      isEditing={isEditing}
                      needsUpdate={registration.player_order_needs_update}
                      multiline={true}
                      onChange={(value) =>
                        handleFieldChange("player_order", value)
                      }
                    />

                    {/* Team Photos */}
                    <UserEditableFileField
                      fieldName="team_photo"
                      label="Team Photos"
                      files={
                        isEditing
                          ? editedRegistration?.team_photo || null
                          : registration.team_photo
                      }
                      isEditing={isEditing}
                      needsUpdate={registration.team_photo_needs_update}
                      fileType="team_photo"
                      registrationId={registration.id}
                      formToken={registration.form_token}
                      onChange={(files) =>
                        handleFileArrayChange("team_photo", files)
                      }
                    />
                  </CardContent>
                </Card>

                {/* Players Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Players Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Player 1 */}
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-lg mb-2">Player 1</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <UserEditableField
                            fieldName="player1_name"
                            label="Name"
                            value={
                              isEditing
                                ? editedRegistration?.player1_name || ""
                                : registration.player1_name
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player1_name_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player1_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_singh_kaur"
                            label="Singh/Kaur"
                            value={
                              isEditing
                                ? editedRegistration?.player1_singh_kaur || ""
                                : registration.player1_singh_kaur
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_singh_kaur_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player1_singh_kaur", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_dob"
                            label="Date of Birth"
                            value={
                              isEditing
                                ? editedRegistration?.player1_dob || ""
                                : registration.player1_dob
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player1_dob_needs_update}
                            type="date"
                            onChange={(value) =>
                              handleFieldChange("player1_dob", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_phone_number"
                            label="Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player1_phone_number || ""
                                : registration.player1_phone_number
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_phone_number_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange("player1_phone_number", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_email"
                            label="Email"
                            value={
                              isEditing
                                ? editedRegistration?.player1_email || ""
                                : registration.player1_email
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_email_needs_update
                            }
                            type="email"
                            onChange={(value) =>
                              handleFieldChange("player1_email", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_city"
                            label="City"
                            value={
                              isEditing
                                ? editedRegistration?.player1_city || ""
                                : registration.player1_city
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player1_city_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player1_city", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_emergency_contact_name"
                            label="Emergency Contact"
                            value={
                              isEditing
                                ? editedRegistration?.player1_emergency_contact_name ||
                                  ""
                                : registration.player1_emergency_contact_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_emergency_contact_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange(
                                "player1_emergency_contact_name",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player1_emergency_contact_phone"
                            label="Emergency Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player1_emergency_contact_phone ||
                                  ""
                                : registration.player1_emergency_contact_phone
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_emergency_contact_phone_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange(
                                "player1_emergency_contact_phone",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player1_father_name"
                            label="Father's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player1_father_name || ""
                                : registration.player1_father_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_father_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player1_father_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player1_mother_name"
                            label="Mother's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player1_mother_name || ""
                                : registration.player1_mother_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_mother_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player1_mother_name", value)
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <UserEditableField
                            fieldName="player1_gatka_experience"
                            label="Gatka Experience"
                            value={
                              isEditing
                                ? editedRegistration?.player1_gatka_experience ||
                                  ""
                                : registration.player1_gatka_experience
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_gatka_experience_needs_update
                            }
                            multiline={true}
                            onChange={(value) =>
                              handleFieldChange(
                                "player1_gatka_experience",
                                value
                              )
                            }
                          />
                        </div>
                        {/* Player 1 DOB Proof */}
                        <div className="mt-3">
                          <UserEditableFileField
                            fieldName="player1_dob_proof"
                            label="DOB Proof"
                            files={
                              isEditing
                                ? editedRegistration?.player1_dob_proof || null
                                : registration.player1_dob_proof
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player1_dob_proof_needs_update
                            }
                            fileType="player1_dob_proof"
                            registrationId={registration.id}
                            formToken={registration.form_token}
                            onChange={(files) =>
                              handleFileArrayChange("player1_dob_proof", files)
                            }
                          />
                        </div>
                      </div>

                      {/* Player 2 */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-lg mb-2">Player 2</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <UserEditableField
                            fieldName="player2_name"
                            label="Name"
                            value={
                              isEditing
                                ? editedRegistration?.player2_name || ""
                                : registration.player2_name
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player2_name_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player2_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_singh_kaur"
                            label="Singh/Kaur"
                            value={
                              isEditing
                                ? editedRegistration?.player2_singh_kaur || ""
                                : registration.player2_singh_kaur
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_singh_kaur_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player2_singh_kaur", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_dob"
                            label="Date of Birth"
                            value={
                              isEditing
                                ? editedRegistration?.player2_dob || ""
                                : registration.player2_dob
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player2_dob_needs_update}
                            type="date"
                            onChange={(value) =>
                              handleFieldChange("player2_dob", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_phone_number"
                            label="Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player2_phone_number || ""
                                : registration.player2_phone_number
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_phone_number_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange("player2_phone_number", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_email"
                            label="Email"
                            value={
                              isEditing
                                ? editedRegistration?.player2_email || ""
                                : registration.player2_email
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_email_needs_update
                            }
                            type="email"
                            onChange={(value) =>
                              handleFieldChange("player2_email", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_city"
                            label="City"
                            value={
                              isEditing
                                ? editedRegistration?.player2_city || ""
                                : registration.player2_city
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player2_city_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player2_city", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_emergency_contact_name"
                            label="Emergency Contact"
                            value={
                              isEditing
                                ? editedRegistration?.player2_emergency_contact_name ||
                                  ""
                                : registration.player2_emergency_contact_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_emergency_contact_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange(
                                "player2_emergency_contact_name",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player2_emergency_contact_phone"
                            label="Emergency Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player2_emergency_contact_phone ||
                                  ""
                                : registration.player2_emergency_contact_phone
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_emergency_contact_phone_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange(
                                "player2_emergency_contact_phone",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player2_father_name"
                            label="Father's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player2_father_name || ""
                                : registration.player2_father_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_father_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player2_father_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player2_mother_name"
                            label="Mother's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player2_mother_name || ""
                                : registration.player2_mother_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_mother_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player2_mother_name", value)
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <UserEditableField
                            fieldName="player2_gatka_experience"
                            label="Gatka Experience"
                            value={
                              isEditing
                                ? editedRegistration?.player2_gatka_experience ||
                                  ""
                                : registration.player2_gatka_experience
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_gatka_experience_needs_update
                            }
                            multiline={true}
                            onChange={(value) =>
                              handleFieldChange(
                                "player2_gatka_experience",
                                value
                              )
                            }
                          />
                        </div>
                        {/* Player 2 DOB Proof */}
                        <div className="mt-3">
                          <UserEditableFileField
                            fieldName="player2_dob_proof"
                            label="DOB Proof"
                            files={
                              isEditing
                                ? editedRegistration?.player2_dob_proof || null
                                : registration.player2_dob_proof
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player2_dob_proof_needs_update
                            }
                            fileType="player2_dob_proof"
                            registrationId={registration.id}
                            formToken={registration.form_token}
                            onChange={(files) =>
                              handleFileArrayChange("player2_dob_proof", files)
                            }
                          />
                        </div>
                      </div>

                      {/* Player 3 */}
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-lg mb-2">Player 3</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <UserEditableField
                            fieldName="player3_name"
                            label="Name"
                            value={
                              isEditing
                                ? editedRegistration?.player3_name || ""
                                : registration.player3_name
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player3_name_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player3_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_singh_kaur"
                            label="Singh/Kaur"
                            value={
                              isEditing
                                ? editedRegistration?.player3_singh_kaur || ""
                                : registration.player3_singh_kaur
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_singh_kaur_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player3_singh_kaur", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_dob"
                            label="Date of Birth"
                            value={
                              isEditing
                                ? editedRegistration?.player3_dob || ""
                                : registration.player3_dob
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player3_dob_needs_update}
                            type="date"
                            onChange={(value) =>
                              handleFieldChange("player3_dob", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_phone_number"
                            label="Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player3_phone_number || ""
                                : registration.player3_phone_number
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_phone_number_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange("player3_phone_number", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_email"
                            label="Email"
                            value={
                              isEditing
                                ? editedRegistration?.player3_email || ""
                                : registration.player3_email
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_email_needs_update
                            }
                            type="email"
                            onChange={(value) =>
                              handleFieldChange("player3_email", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_city"
                            label="City"
                            value={
                              isEditing
                                ? editedRegistration?.player3_city || ""
                                : registration.player3_city
                            }
                            isEditing={isEditing}
                            needsUpdate={registration.player3_city_needs_update}
                            onChange={(value) =>
                              handleFieldChange("player3_city", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_emergency_contact_name"
                            label="Emergency Contact"
                            value={
                              isEditing
                                ? editedRegistration?.player3_emergency_contact_name ||
                                  ""
                                : registration.player3_emergency_contact_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_emergency_contact_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange(
                                "player3_emergency_contact_name",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player3_emergency_contact_phone"
                            label="Emergency Phone"
                            value={
                              isEditing
                                ? editedRegistration?.player3_emergency_contact_phone ||
                                  ""
                                : registration.player3_emergency_contact_phone
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_emergency_contact_phone_needs_update
                            }
                            type="tel"
                            onChange={(value) =>
                              handleFieldChange(
                                "player3_emergency_contact_phone",
                                value
                              )
                            }
                          />
                          <UserEditableField
                            fieldName="player3_father_name"
                            label="Father's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player3_father_name || ""
                                : registration.player3_father_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_father_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player3_father_name", value)
                            }
                          />
                          <UserEditableField
                            fieldName="player3_mother_name"
                            label="Mother's Name"
                            value={
                              isEditing
                                ? editedRegistration?.player3_mother_name || ""
                                : registration.player3_mother_name
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_mother_name_needs_update
                            }
                            onChange={(value) =>
                              handleFieldChange("player3_mother_name", value)
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <UserEditableField
                            fieldName="player3_gatka_experience"
                            label="Gatka Experience"
                            value={
                              isEditing
                                ? editedRegistration?.player3_gatka_experience ||
                                  ""
                                : registration.player3_gatka_experience
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_gatka_experience_needs_update
                            }
                            multiline={true}
                            onChange={(value) =>
                              handleFieldChange(
                                "player3_gatka_experience",
                                value
                              )
                            }
                          />
                        </div>
                        {/* Player 3 DOB Proof */}
                        <div className="mt-3">
                          <UserEditableFileField
                            fieldName="player3_dob_proof"
                            label="DOB Proof"
                            files={
                              isEditing
                                ? editedRegistration?.player3_dob_proof || null
                                : registration.player3_dob_proof
                            }
                            isEditing={isEditing}
                            needsUpdate={
                              registration.player3_dob_proof_needs_update
                            }
                            fileType="player3_dob_proof"
                            registrationId={registration.id}
                            formToken={registration.form_token}
                            onChange={(files) =>
                              handleFileArrayChange("player3_dob_proof", files)
                            }
                          />
                        </div>
                      </div>

                      {/* Has Backup Player */}
                      <div className="col-span-full">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Has Backup Player{" "}
                            {registration.backup_player_needs_update && (
                              <span className="text-orange-500 text-xs">
                                (needs update)
                              </span>
                            )}
                          </Label>
                          {!isEditing ||
                          !registration.backup_player_needs_update ? (
                            <div className="px-3 py-2 bg-gray-50 border rounded text-sm">
                              {(
                                isEditing
                                  ? editedRegistration?.backup_player
                                  : registration.backup_player
                              )
                                ? "Yes"
                                : "No"}
                            </div>
                          ) : (
                            <select
                              value={
                                editedRegistration?.backup_player ? "Yes" : "No"
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  "backup_player",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 bg-orange-50"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Backup Player Information */}
                      {((isEditing && editedRegistration?.backup_player) ||
                        (!isEditing && registration.backup_player)) && (
                        <div className="col-span-full border-l-4 border-orange-500 pl-4">
                          <h4 className="font-medium text-lg mb-2">
                            Backup Player
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UserEditableField
                              fieldName="backup_name"
                              label="Name"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_name || ""
                                  : registration.backup_name
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_name_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange("backup_name", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_singh_kaur"
                              label="Singh/Kaur"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_singh_kaur || ""
                                  : registration.backup_singh_kaur
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_singh_kaur_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange("backup_singh_kaur", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_dob"
                              label="Date of Birth"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_dob || ""
                                  : registration.backup_dob
                              }
                              isEditing={isEditing}
                              needsUpdate={registration.backup_dob_needs_update}
                              type="date"
                              onChange={(value) =>
                                handleFieldChange("backup_dob", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_phone_number"
                              label="Phone"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_phone_number ||
                                    ""
                                  : registration.backup_phone_number
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_phone_number_needs_update
                              }
                              type="tel"
                              onChange={(value) =>
                                handleFieldChange("backup_phone_number", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_email"
                              label="Email"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_email || ""
                                  : registration.backup_email
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_email_needs_update
                              }
                              type="email"
                              onChange={(value) =>
                                handleFieldChange("backup_email", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_city"
                              label="City"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_city || ""
                                  : registration.backup_city
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_city_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange("backup_city", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_emergency_contact_name"
                              label="Emergency Contact"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_emergency_contact_name ||
                                    ""
                                  : registration.backup_emergency_contact_name
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_emergency_contact_name_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange(
                                  "backup_emergency_contact_name",
                                  value
                                )
                              }
                            />
                            <UserEditableField
                              fieldName="backup_emergency_contact_phone"
                              label="Emergency Phone"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_emergency_contact_phone ||
                                    ""
                                  : registration.backup_emergency_contact_phone
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_emergency_contact_phone_needs_update
                              }
                              type="tel"
                              onChange={(value) =>
                                handleFieldChange(
                                  "backup_emergency_contact_phone",
                                  value
                                )
                              }
                            />
                            <UserEditableField
                              fieldName="backup_father_name"
                              label="Father's Name"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_father_name || ""
                                  : registration.backup_father_name
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_father_name_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange("backup_father_name", value)
                              }
                            />
                            <UserEditableField
                              fieldName="backup_mother_name"
                              label="Mother's Name"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_mother_name || ""
                                  : registration.backup_mother_name
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_mother_name_needs_update
                              }
                              onChange={(value) =>
                                handleFieldChange("backup_mother_name", value)
                              }
                            />
                          </div>
                          <div className="mt-4">
                            <UserEditableField
                              fieldName="backup_gatka_experience"
                              label="Gatka Experience"
                              value={
                                isEditing
                                  ? editedRegistration?.backup_gatka_experience ||
                                    ""
                                  : registration.backup_gatka_experience
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_gatka_experience_needs_update
                              }
                              multiline={true}
                              onChange={(value) =>
                                handleFieldChange(
                                  "backup_gatka_experience",
                                  value
                                )
                              }
                            />
                          </div>
                          {/* Backup Player DOB Proof */}
                          <div className="mt-3">
                            <UserEditableFileField
                              fieldName="backup_dob_proof"
                              label="DOB Proof"
                              files={
                                isEditing
                                  ? editedRegistration?.backup_dob_proof || null
                                  : registration.backup_dob_proof
                              }
                              isEditing={isEditing}
                              needsUpdate={
                                registration.backup_dob_proof_needs_update
                              }
                              fileType="backup_dob_proof"
                              registrationId={registration.id}
                              formToken={registration.form_token}
                              onChange={(files) =>
                                handleFileArrayChange("backup_dob_proof", files)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Requested Updates Sidebar */}
              {registration.status === "information requested" &&
                (() => {
                  const currentRegistration =
                    isEditing && editedRegistration
                      ? editedRegistration
                      : registration;
                  return (
                    currentRegistration.admin_notes?.requested_updates &&
                    currentRegistration.admin_notes.requested_updates.length > 0
                  );
                })() && (
                  <div className="flex-shrink-0 w-[28rem]">
                    <Card className="sticky top-8">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                          Updates Requested
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                            <p>
                              <strong>Note:</strong> You can only edit the
                              fields listed below. Click "Edit Registration" to
                              make changes, then save your updates.
                            </p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">
                              Information Update Required
                            </h4>
                            <p className="text-sm text-blue-800">
                              The following information has been requested by
                              the Jauhr E Teg Team to be updated:
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {(() => {
                              // Use editedRegistration if in editing mode, otherwise use original
                              const currentRegistration =
                                isEditing && editedRegistration
                                  ? editedRegistration
                                  : registration;
                              const requestedUpdates =
                                currentRegistration.admin_notes
                                  ?.requested_updates || [];

                              // Define field order to match view-registration page structure
                              const fieldOrder = [
                                // Team Information (as it appears on view-registration)
                                "team_name",
                                "ustads",
                                "coach_name",
                                "coach_email",
                                "team_location",
                                "player_order",
                                "team_photo",

                                // Player 1 Information
                                "player1_name",
                                "player1_singh_kaur",
                                "player1_dob",
                                "player1_dob_proof",
                                "player1_email",
                                "player1_phone_number",
                                "player1_emergency_contact_name",
                                "player1_emergency_contact_phone",
                                "player1_father_name",
                                "player1_mother_name",
                                "player1_city",
                                "player1_gatka_experience",

                                // Player 2 fields
                                "player2_name",
                                "player2_singh_kaur",
                                "player2_dob",
                                "player2_dob_proof",
                                "player2_email",
                                "player2_phone_number",
                                "player2_emergency_contact_name",
                                "player2_emergency_contact_phone",
                                "player2_father_name",
                                "player2_mother_name",
                                "player2_city",
                                "player2_gatka_experience",

                                // Player 3 fields
                                "player3_name",
                                "player3_singh_kaur",
                                "player3_dob",
                                "player3_dob_proof",
                                "player3_email",
                                "player3_phone_number",
                                "player3_emergency_contact_name",
                                "player3_emergency_contact_phone",
                                "player3_father_name",
                                "player3_mother_name",
                                "player3_city",
                                "player3_gatka_experience",

                                // Backup player fields
                                "backup_player",
                                "backup_name",
                                "backup_singh_kaur",
                                "backup_dob",
                                "backup_dob_proof",
                                "backup_phone_number",
                                "backup_emergency_contact_name",
                                "backup_emergency_contact_phone",
                                "backup_father_name",
                                "backup_mother_name",
                                "backup_city",
                                "backup_gatka_experience",
                              ];

                              // Sort requested updates based on field order
                              const sortedUpdates = requestedUpdates.sort(
                                (a, b) => {
                                  const aIndex = fieldOrder.indexOf(a);
                                  const bIndex = fieldOrder.indexOf(b);
                                  return (
                                    (aIndex === -1 ? 999 : aIndex) -
                                    (bIndex === -1 ? 999 : bIndex)
                                  );
                                }
                              );

                              return sortedUpdates.map((field, index) => {
                                const displayName =
                                  FIELD_DISPLAY_NAMES[field] || field;
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs"
                                  >
                                    <Edit2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                    <span className="text-orange-700 font-medium text-xs leading-tight">
                                      {displayName}
                                    </span>
                                  </div>
                                );
                              });
                            })()}
                          </div>

                          {/* Public Notes Section */}
                          {registration.admin_notes?.public_notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                Notes
                              </h3>
                              <div className="text-sm text-blue-800 whitespace-pre-wrap">
                                {registration.admin_notes.public_notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold font-montserrat">
              View Registration
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enter your registration token to view your registration details
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Registration Token</Label>
                <Input
                  id="token"
                  type="text"
                  value={formToken}
                  onChange={(e) => setFormToken(e.target.value)}
                  placeholder="Enter your registration token"
                  className="font-mono"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-[#F5A623] hover:text-white transition-colors duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      View Registration
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToHome}
                  className="w-full bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main component that provides the toast context
export default function ViewRegistrationPage() {
  return (
    <ToastProvider>
      <ViewRegistrationPageContent />
    </ToastProvider>
  );
}
