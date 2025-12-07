"use client";

import React, { useState, useCallback } from "react";
import { Registration, StatusType } from "@/types/database";
import { RegistrationService } from "@/services/registrationService";
import { useUser } from "@/app/dashboard/layout";
import { useSuccessNotifications } from "@/hooks/useSuccessNotifications";
import { getAdminUserName as getAdminUserNameUtil } from "@/lib/utils/adminUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Edit2,
  Check,
  XIcon,
  FileText,
  Eye,
  HelpCircle,
  CheckCircle,
  Archive,
  ChevronDown,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ClickableStatusBadge component
const ClickableStatusBadge = ({
  status,
  onChange,
}: {
  status: StatusType;
  onChange: (newStatus: StatusType) => void;
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "new submission":
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <FileText className="h-3 w-3" />,
          label: "New Submission",
        };
      case "in review":
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Eye className="h-3 w-3" />,
          label: "In Review",
        };
      case "information requested":
        return {
          className: "bg-orange-100 text-orange-800 border-orange-200",
          icon: <HelpCircle className="h-3 w-3" />,
          label: "Info Requested",
        };
      case "approved":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Approved",
        };
      case "denied":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <XIcon className="h-3 w-3" />,
          label: "Denied",
        };
      case "dropped":
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Archive className="h-3 w-3" />,
          label: "Dropped",
        };
      default:
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <FileText className="h-3 w-3" />,
          label:
            String(status).charAt(0).toUpperCase() + String(status).slice(1),
        };
    }
  };

  const currentConfig = getStatusConfig(status);
  const allStatuses: StatusType[] = [
    "new submission",
    "in review",
    "information requested",
    "approved",
    "denied",
    "dropped",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`${currentConfig.className} flex items-center gap-1 font-medium text-xs px-2 py-1 h-auto hover:opacity-80`}
        >
          {currentConfig.icon}
          {currentConfig.label}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {allStatuses.map((statusOption) => {
          const config = getStatusConfig(statusOption);
          return (
            <DropdownMenuItem
              key={statusOption}
              onClick={() => onChange(statusOption)}
              className="flex items-center gap-2"
            >
              <Badge
                variant="outline"
                className={`${config.className} flex items-center gap-1 font-medium text-xs px-2 py-1 border-0`}
              >
                {config.icon}
                {config.label}
              </Badge>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ClickableDivisionBadge component
const ClickableDivisionBadge = ({
  division,
  onChange,
}: {
  division: string;
  onChange: (newDivision: string) => void;
}) => {
  const getDivisionConfig = (division: string) => {
    switch (division) {
      case "Junior Kaurs":
        return {
          className: "bg-pink-100 text-pink-800 border-pink-200",
          label: "Junior Kaurs",
        };
      case "Junior Singhs":
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Junior Singhs",
        };
      case "Open Kaurs":
        return {
          className: "bg-purple-100 text-purple-800 border-purple-200",
          label: "Open Kaurs",
        };
      case "Open Singhs":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          label: "Open Singhs",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          label: division,
        };
    }
  };

  const currentConfig = getDivisionConfig(division);
  const allDivisions = [
    "Junior Kaurs",
    "Junior Singhs",
    "Open Kaurs",
    "Open Singhs",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`${currentConfig.className} flex items-center gap-1 font-medium text-xs px-3 py-1 h-auto hover:opacity-80`}
        >
          {currentConfig.label}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {allDivisions.map((divisionOption) => {
          const config = getDivisionConfig(divisionOption);
          return (
            <DropdownMenuItem
              key={divisionOption}
              onClick={() => onChange(divisionOption)}
              className="flex items-center gap-2"
            >
              <Badge
                variant="outline"
                className={`${config.className} flex items-center gap-1 font-medium text-xs px-2 py-1 border-0`}
              >
                {config.label}
              </Badge>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// EditableField component moved outside to prevent re-creation
const EditableField = React.memo(
  ({
    fieldName,
    label,
    value,
    type = "text",
    multiline = false,
    disabled = false,
    isEditing,
    currentValue,
    onStartEdit,
    onSave,
    onCancel,
    onChange,
    isSaving,
  }: {
    fieldName: string;
    label: string;
    value: string | null;
    type?: string;
    multiline?: boolean;
    disabled?: boolean;
    isEditing: boolean;
    currentValue: string;
    onStartEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (value: string) => void;
    isSaving: boolean;
  }) => {
    if (disabled) {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <div className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm">
            {value || "Not provided"}
          </div>
        </div>
      );
    }

    // Special case for admin_notes - always editable
    if (fieldName === "admin_notes") {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <div className="mt-1">
            <Textarea
              value={currentValue || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter admin review notes here..."
              className="w-full"
              rows={3}
            />
          </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <div className="mt-1 flex items-center gap-2">
            {multiline ? (
              <Textarea
                value={currentValue || ""}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
                rows={2}
                autoFocus
              />
            ) : (
              <Input
                type={type}
                value={currentValue || ""}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
                autoFocus
              />
            )}
            <Button size="sm" onClick={onSave} disabled={isSaving}>
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <div className="mt-1 flex items-center justify-between group">
          <div className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50">
            {value || "Not provided"}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartEdit}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }
);

function RegistrationDetailModal({
  registration,
  isOpen,
  onClose,
}: {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  // Don't render if no registration data
  if (!registration) {
    return null;
  }

  const { user } = useUser();
  const { showUpdateSuccess, showSaveSuccess, showError } =
    useSuccessNotifications();
  const [editedRegistration, setEditedRegistration] =
    useState<Registration>(registration);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());

  // Helper to get current admin user name using shared utility
  const getAdminUserName = useCallback(() => {
    return getAdminUserNameUtil(user);
  }, [user]);

  // Update edited registration when prop changes
  React.useEffect(() => {
    if (registration) {
      setEditedRegistration(registration);
    }
  }, [registration]);

  const startEditing = useCallback((fieldName: string) => {
    setEditingFields((prev) => new Set(prev).add(fieldName));
  }, []);

  const cancelEditing = useCallback(
    (fieldName: string) => {
      // Reset field to original value
      setEditedRegistration((prev) => ({
        ...prev,
        [fieldName]: registration[fieldName as keyof Registration],
      }));
      setEditingFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    },
    [registration]
  );

  const saveField = useCallback(
    async (fieldName: string) => {
      const value = editedRegistration[fieldName as keyof Registration];
      try {
        setIsSaving(true);
        const adminUserName = getAdminUserName();
        const { error } = await RegistrationService.updateRegistrationByAdmin(
          registration.id,
          { [fieldName]: value },
          adminUserName
        );

        if (error) {
          console.error("Error updating field:", error);
          showError(`Failed to update ${fieldName}: ${error.message || error}`);
          return;
        }

        // Show success notification
        showUpdateSuccess(
          registration.form_token,
          registration.team_name,
          fieldName
        );

        // Remove from editing fields on successful save
        setEditingFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      } catch (error) {
        console.error("Error saving field:", error);
        showError(
          `Failed to save ${fieldName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsSaving(false);
      }
    },
    [
      editedRegistration,
      registration.id,
      getAdminUserName,
      showUpdateSuccess,
      showError,
    ]
  );

  const updateField = useCallback(
    async (field: keyof Registration, value: any) => {
      // Update local state immediately
      setEditedRegistration((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Auto-save important fields like status and division
      if (field === "status" || field === "division") {
        try {
          setIsSaving(true);
          const adminUserName = getAdminUserName();
          const { error } = await RegistrationService.updateRegistrationByAdmin(
            registration.id,
            { [field]: value },
            adminUserName
          );

          if (error) {
            console.error(`Error updating ${field}:`, error);
            showError(`Failed to update ${field}: ${error.message || error}`);
            // Revert the local change on error
            setEditedRegistration((prev) => ({
              ...prev,
              [field]: registration[field],
            }));
            return;
          }

          // Show success notification
          showUpdateSuccess(
            registration.form_token,
            registration.team_name,
            field
          );
        } catch (error) {
          console.error(`Error updating ${field}:`, error);
          showError(
            `Failed to update ${field}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          // Revert the local change on error
          setEditedRegistration((prev) => ({
            ...prev,
            [field]: registration[field],
          }));
        } finally {
          setIsSaving(false);
        }
      }
    },
    [
      registration.id,
      registration.form_token,
      registration.team_name,
      registration,
      getAdminUserName,
      showUpdateSuccess,
      showError,
    ]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const adminUserName = getAdminUserName();
      const { error } = await RegistrationService.updateFullRegistrationByAdmin(
        registration.id,
        editedRegistration,
        adminUserName
      );

      if (error) {
        console.error("Failed to save registration:", error);
        showError(`Failed to save registration: ${error.message || error}`);
        return;
      }

      // Show success notification
      showSaveSuccess(registration.form_token, registration.team_name);

      onClose();
    } catch (error) {
      console.error("Failed to save registration:", error);
      showError(
        `Failed to save registration: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    editedRegistration,
    registration.id,
    registration.form_token,
    registration.team_name,
    getAdminUserName,
    showSaveSuccess,
    showError,
    onClose,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Memoized field change handler
  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setEditedRegistration((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  // Wrapper function to provide all EditableField props
  const renderEditableField = useCallback(
    (props: {
      fieldName: string;
      label: string;
      value: string | null;
      type?: string;
      multiline?: boolean;
      disabled?: boolean;
    }) => {
      const isEditing = editingFields.has(props.fieldName);
      const currentValue = editedRegistration[
        props.fieldName as keyof Registration
      ] as string;

      return (
        <EditableField
          {...props}
          isEditing={isEditing}
          currentValue={currentValue}
          onStartEdit={() => startEditing(props.fieldName)}
          onSave={() => saveField(props.fieldName)}
          onCancel={() => cancelEditing(props.fieldName)}
          onChange={(value) => handleFieldChange(props.fieldName, value)}
          isSaving={isSaving}
        />
      );
    },
    [
      editingFields,
      editedRegistration,
      startEditing,
      saveField,
      cancelEditing,
      handleFieldChange,
      isSaving,
    ]
  );

  const DocumentViewer = ({
    documents,
    label,
  }: {
    documents: string[] | null;
    label: string;
  }) => {
    const [loadingStates, setLoadingStates] = React.useState<
      Record<number, boolean>
    >({});
    const [imageErrors, setImageErrors] = React.useState<
      Record<number, boolean>
    >({});

    const isImageFile = (url: string) => {
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
      ];
      const lowerUrl = url.toLowerCase();
      return (
        imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
        lowerUrl.includes("image")
      );
    };

    const handleImageLoad = (index: number) => {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    };

    const handleImageError = (index: number) => {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
      setImageErrors((prev) => ({ ...prev, [index]: true }));
    };

    const handleImageLoadStart = (index: number) => {
      setLoadingStates((prev) => ({ ...prev, [index]: true }));
    };

    if (!documents || documents.length === 0) {
      return (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
          <span className="text-sm text-red-600">
            No {label.toLowerCase()} uploaded
          </span>
        </div>
      );
    }

    return (
      <div className="mt-2 space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            {/* Header */}
            <div className="p-3 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {label} {documents.length > 1 ? `${index + 1}` : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc, "_blank")}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">Open</span>
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="p-3">
              {isImageFile(doc) ? (
                <div className="relative">
                  {loadingStates[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {imageErrors[index] ? (
                    <div className="flex items-center justify-center p-8 bg-gray-100 rounded text-gray-500">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Unable to load image</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={doc}
                      alt={`${label} ${index + 1}`}
                      className="w-full h-48 object-cover rounded border"
                      onLoadStart={() => handleImageLoadStart(index)}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 bg-gray-100 rounded">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Document file</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click "Open" to view
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
        <DialogTitle className="sr-only">
          Registration Details for {registration?.team_name || "Unknown Team"}
        </DialogTitle>

        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {editedRegistration.team_name || "Unnamed Team"}
              </h1>
              <p className="text-sm text-gray-500">Registration Details</p>
            </div>
          </div>
        </div>

        {/* Main Layout: Content + Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* SCROLLABLE MAIN CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Team Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderEditableField({
                    fieldName: "team_name",
                    label: "Team Name",
                    value: editedRegistration.team_name,
                  })}
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "team_location",
                      label: "Team Location",
                      value: editedRegistration.team_location,
                    })}
                    {renderEditableField({
                      fieldName: "player_order",
                      label: "Player Order",
                      value: editedRegistration.player_order,
                    })}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Team Photo</Label>
                    <DocumentViewer
                      documents={editedRegistration.team_photo}
                      label="Team Photo"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ustad Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ustad Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderEditableField({
                    fieldName: "ustad_name",
                    label: "Ustad Name",
                    value: editedRegistration.ustad_name,
                  })}
                  {renderEditableField({
                    fieldName: "ustad_email",
                    label: "Ustad Email",
                    value: editedRegistration.ustad_email,
                    type: "email",
                  })}
                </CardContent>
              </Card>

              {/* Coach Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coach Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderEditableField({
                    fieldName: "coach_name",
                    label: "Coach Name",
                    value: editedRegistration.coach_name,
                  })}
                  {renderEditableField({
                    fieldName: "coach_email",
                    label: "Coach Email",
                    value: editedRegistration.coach_email,
                    type: "email",
                  })}
                </CardContent>
              </Card>

              {/* Player 1 Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Player 1 Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player1_name",
                      label: "Player 1 Name",
                      value: editedRegistration.player1_name,
                    })}
                    {renderEditableField({
                      fieldName: "player1_singh_kaur",
                      label: "Singh/Kaur",
                      value: editedRegistration.player1_singh_kaur,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player1_email",
                      label: "Email",
                      value: editedRegistration.player1_email,
                      type: "email",
                    })}
                    {renderEditableField({
                      fieldName: "player1_phone_number",
                      label: "Phone",
                      value: editedRegistration.player1_phone_number,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player1_dob",
                      label: "Date of Birth",
                      value: editedRegistration.player1_dob,
                    })}
                    {renderEditableField({
                      fieldName: "player1_city",
                      label: "City",
                      value: editedRegistration.player1_city,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player1_father_name",
                      label: "Father's Name",
                      value: editedRegistration.player1_father_name,
                    })}
                    {renderEditableField({
                      fieldName: "player1_mother_name",
                      label: "Mother's Name",
                      value: editedRegistration.player1_mother_name,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player1_emergency_contact_name",
                      label: "Emergency Contact Name",
                      value: editedRegistration.player1_emergency_contact_name,
                    })}
                    {renderEditableField({
                      fieldName: "player1_emergency_contact_phone",
                      label: "Emergency Contact Phone",
                      value: editedRegistration.player1_emergency_contact_phone,
                    })}
                  </div>
                  {renderEditableField({
                    fieldName: "player1_gatka_experience",
                    label: "Gatka Experience",
                    value: editedRegistration.player1_gatka_experience,
                    multiline: true,
                  })}
                  {(editedRegistration.division === "Junior Kaurs" ||
                    editedRegistration.division === "Junior Singhs") && (
                    <div>
                      <Label className="text-sm font-medium">
                        Player 1 Date of Birth Proof
                      </Label>
                      <DocumentViewer
                        documents={editedRegistration.player1_dob_proof}
                        label="Player 1 DOB Document"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Player 2 Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Player 2 Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player2_name",
                      label: "Player 2 Name",
                      value: editedRegistration.player2_name,
                    })}
                    {renderEditableField({
                      fieldName: "player2_singh_kaur",
                      label: "Singh/Kaur",
                      value: editedRegistration.player2_singh_kaur,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player2_email",
                      label: "Email",
                      value: editedRegistration.player2_email,
                      type: "email",
                    })}
                    {renderEditableField({
                      fieldName: "player2_phone_number",
                      label: "Phone",
                      value: editedRegistration.player2_phone_number,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player2_dob",
                      label: "Date of Birth",
                      value: editedRegistration.player2_dob,
                    })}
                    {renderEditableField({
                      fieldName: "player2_city",
                      label: "City",
                      value: editedRegistration.player2_city,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player2_father_name",
                      label: "Father's Name",
                      value: editedRegistration.player2_father_name,
                    })}
                    {renderEditableField({
                      fieldName: "player2_mother_name",
                      label: "Mother's Name",
                      value: editedRegistration.player2_mother_name,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player2_emergency_contact_name",
                      label: "Emergency Contact Name",
                      value: editedRegistration.player2_emergency_contact_name,
                    })}
                    {renderEditableField({
                      fieldName: "player2_emergency_contact_phone",
                      label: "Emergency Contact Phone",
                      value: editedRegistration.player2_emergency_contact_phone,
                    })}
                  </div>
                  {renderEditableField({
                    fieldName: "player2_gatka_experience",
                    label: "Gatka Experience",
                    value: editedRegistration.player2_gatka_experience,
                    multiline: true,
                  })}
                  {(editedRegistration.division === "Junior Kaurs" ||
                    editedRegistration.division === "Junior Singhs") && (
                    <div>
                      <Label className="text-sm font-medium">
                        Player 2 Date of Birth Proof
                      </Label>
                      <DocumentViewer
                        documents={editedRegistration.player2_dob_proof}
                        label="Player 2 DOB Document"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Player 3 Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Player 3 Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player3_name",
                      label: "Player 3 Name",
                      value: editedRegistration.player3_name,
                    })}
                    {renderEditableField({
                      fieldName: "player3_singh_kaur",
                      label: "Singh/Kaur",
                      value: editedRegistration.player3_singh_kaur,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player3_email",
                      label: "Email",
                      value: editedRegistration.player3_email,
                      type: "email",
                    })}
                    {renderEditableField({
                      fieldName: "player3_phone_number",
                      label: "Phone",
                      value: editedRegistration.player3_phone_number,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player3_dob",
                      label: "Date of Birth",
                      value: editedRegistration.player3_dob,
                    })}
                    {renderEditableField({
                      fieldName: "player3_city",
                      label: "City",
                      value: editedRegistration.player3_city,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player3_father_name",
                      label: "Father's Name",
                      value: editedRegistration.player3_father_name,
                    })}
                    {renderEditableField({
                      fieldName: "player3_mother_name",
                      label: "Mother's Name",
                      value: editedRegistration.player3_mother_name,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderEditableField({
                      fieldName: "player3_emergency_contact_name",
                      label: "Emergency Contact Name",
                      value: editedRegistration.player3_emergency_contact_name,
                    })}
                    {renderEditableField({
                      fieldName: "player3_emergency_contact_phone",
                      label: "Emergency Contact Phone",
                      value: editedRegistration.player3_emergency_contact_phone,
                    })}
                  </div>
                  {renderEditableField({
                    fieldName: "player3_gatka_experience",
                    label: "Gatka Experience",
                    value: editedRegistration.player3_gatka_experience,
                    multiline: true,
                  })}
                  {(editedRegistration.division === "Junior Kaurs" ||
                    editedRegistration.division === "Junior Singhs") && (
                    <div>
                      <Label className="text-sm font-medium">
                        Player 3 Date of Birth Proof
                      </Label>
                      <DocumentViewer
                        documents={editedRegistration.player3_dob_proof}
                        label="Player 3 DOB Document"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Backup Player Information */}
              {editedRegistration.backup_player && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Backup Player Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField({
                        fieldName: "backup_name",
                        label: "Backup Player Name",
                        value: editedRegistration.backup_name,
                      })}
                      {renderEditableField({
                        fieldName: "backup_singh_kaur",
                        label: "Singh/Kaur",
                        value: editedRegistration.backup_singh_kaur,
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField({
                        fieldName: "backup_email",
                        label: "Email",
                        value: editedRegistration.backup_email,
                        type: "email",
                      })}
                      {renderEditableField({
                        fieldName: "backup_phone_number",
                        label: "Phone",
                        value: editedRegistration.backup_phone_number,
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField({
                        fieldName: "backup_dob",
                        label: "Date of Birth",
                        value: editedRegistration.backup_dob,
                      })}
                      {renderEditableField({
                        fieldName: "backup_city",
                        label: "City",
                        value: editedRegistration.backup_city,
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField({
                        fieldName: "backup_father_name",
                        label: "Father's Name",
                        value: editedRegistration.backup_father_name,
                      })}
                      {renderEditableField({
                        fieldName: "backup_mother_name",
                        label: "Mother's Name",
                        value: editedRegistration.backup_mother_name,
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderEditableField({
                        fieldName: "backup_emergency_contact_name",
                        label: "Emergency Contact Name",
                        value: editedRegistration.backup_emergency_contact_name,
                      })}
                      {renderEditableField({
                        fieldName: "backup_emergency_contact_phone",
                        label: "Emergency Contact Phone",
                        value:
                          editedRegistration.backup_emergency_contact_phone,
                      })}
                    </div>
                    {renderEditableField({
                      fieldName: "backup_gatka_experience",
                      label: "Gatka Experience",
                      value: editedRegistration.backup_gatka_experience,
                      multiline: true,
                    })}
                    {(editedRegistration.division === "Junior Kaurs" ||
                      editedRegistration.division === "Junior Singhs") && (
                      <div>
                        <Label className="text-sm font-medium">
                          Backup Player Date of Birth Proof
                        </Label>
                        <DocumentViewer
                          documents={editedRegistration.backup_dob_proof}
                          label="Backup Player DOB Document"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bottom spacing for scroll */}
              <div className="h-20"></div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Fixed */}
          <div className="w-96 flex-shrink-0 bg-gray-50 border-l overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Form Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Form Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Form Token - Not Editable */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Form Token
                    </Label>
                    <div className="mt-1 px-3 py-2 bg-white border rounded text-sm font-mono">
                      {registration.form_token}
                    </div>
                  </div>

                  {/* Submission Date - Not Editable */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Submission Date
                    </Label>
                    <div className="mt-1 px-3 py-2 bg-white border rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(registration.submission_date_time)}
                      </div>
                    </div>
                  </div>

                  {/* Updated Date - Not Editable */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Last Updated
                    </Label>
                    <div className="mt-1 px-3 py-2 bg-white border rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(
                          registration.updated_at ||
                            registration.submission_date_time
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status - Editable */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <div className="mt-2">
                      <ClickableStatusBadge
                        status={editedRegistration.status}
                        onChange={(newStatus) =>
                          updateField("status", newStatus)
                        }
                      />
                    </div>
                  </div>

                  {/* Division - Editable */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Division
                    </Label>
                    <div className="mt-2">
                      <ClickableDivisionBadge
                        division={editedRegistration.division}
                        onChange={(newDivision) =>
                          updateField("division", newDivision)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admin Notes</CardTitle>
                  <CardDescription className="text-sm">
                    Internal notes for registration review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editedRegistration.admin_notes || ""}
                    onChange={(e) => updateField("admin_notes", e.target.value)}
                    placeholder="Add notes about this registration..."
                    className="min-h-[120px] resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t px-6 py-3">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationDetailModal;
