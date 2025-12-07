"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  MoreHorizontal,
  Calendar,
  Users,
  Trophy,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Archive,
} from "lucide-react";
import { StatusType, DivisionType, Registration } from "@/types/database";
import { StatCard } from "../_components/stat-card";
import { RegistrationService } from "@/services/registrationService";
import { PageHeader } from "@/components/PageHeader";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useToast } from "@/components/ui/toast-provider";
import RegistrationDetailModal from "@/components/RegistrationDetailModal";

// Using Registration interface from database types

// TruncatedText component with tooltip functionality
const TruncatedText = ({
  text,
  maxLength = 25,
}: {
  text: string;
  maxLength?: number;
}) => {
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const truncated = text.substring(0, maxLength) + "...";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{truncated}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// StatusBadge component matching the existing dashboard implementation
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

export default function RegistrationsPage() {
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<string>("none");

  // Modal state
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportColumns, setExportColumns] = useState<string[]>([]);
  const [exportFilters, setExportFilters] = useState({
    status: "all",
    division: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Available columns for export
  const availableColumns = [
    { key: "form_token", label: "Form Token" },
    { key: "team_name", label: "Team Name" },
    { key: "status", label: "Status" },
    { key: "division", label: "Division" },
    { key: "team_location", label: "Team Location" },
    { key: "submission_date_time", label: "Submission Date" },
    { key: "ustad_name", label: "Ustad Name" },
    { key: "ustad_email", label: "Ustad Email" },
    { key: "coach_name", label: "Coach Name" },
    { key: "coach_email", label: "Coach Email" },
    { key: "player1_name", label: "Player 1 Name" },
    { key: "player1_singh_kaur", label: "Player 1 Singh/Kaur" },
    { key: "player1_dob", label: "Player 1 DOB" },
    { key: "player1_phone_number", label: "Player 1 Phone" },
    { key: "player1_email", label: "Player 1 Email" },
    { key: "player1_city", label: "Player 1 City" },
    { key: "player1_father_name", label: "Player 1 Father Name" },
    { key: "player1_mother_name", label: "Player 1 Mother Name" },
    {
      key: "player1_emergency_contact_name",
      label: "Player 1 Emergency Contact",
    },
    {
      key: "player1_emergency_contact_phone",
      label: "Player 1 Emergency Phone",
    },
    { key: "player1_gatka_experience", label: "Player 1 Gatka Experience" },
    { key: "player2_name", label: "Player 2 Name" },
    { key: "player2_singh_kaur", label: "Player 2 Singh/Kaur" },
    { key: "player2_dob", label: "Player 2 DOB" },
    { key: "player2_phone_number", label: "Player 2 Phone" },
    { key: "player2_email", label: "Player 2 Email" },
    { key: "player2_city", label: "Player 2 City" },
    { key: "player2_father_name", label: "Player 2 Father Name" },
    { key: "player2_mother_name", label: "Player 2 Mother Name" },
    {
      key: "player2_emergency_contact_name",
      label: "Player 2 Emergency Contact",
    },
    {
      key: "player2_emergency_contact_phone",
      label: "Player 2 Emergency Phone",
    },
    { key: "player2_gatka_experience", label: "Player 2 Gatka Experience" },
    { key: "player3_name", label: "Player 3 Name" },
    { key: "player3_singh_kaur", label: "Player 3 Singh/Kaur" },
    { key: "player3_dob", label: "Player 3 DOB" },
    { key: "player3_phone_number", label: "Player 3 Phone" },
    { key: "player3_email", label: "Player 3 Email" },
    { key: "player3_city", label: "Player 3 City" },
    { key: "player3_father_name", label: "Player 3 Father Name" },
    { key: "player3_mother_name", label: "Player 3 Mother Name" },
    {
      key: "player3_emergency_contact_name",
      label: "Player 3 Emergency Contact",
    },
    {
      key: "player3_emergency_contact_phone",
      label: "Player 3 Emergency Phone",
    },
    { key: "player3_gatka_experience", label: "Player 3 Gatka Experience" },
    { key: "backup_name", label: "Backup Player Name" },
    { key: "backup_singh_kaur", label: "Backup Player Singh/Kaur" },
    { key: "backup_dob", label: "Backup Player DOB" },
    { key: "backup_phone_number", label: "Backup Player Phone" },
    { key: "backup_email", label: "Backup Player Email" },
    { key: "backup_city", label: "Backup Player City" },
    { key: "backup_father_name", label: "Backup Player Father Name" },
    { key: "backup_mother_name", label: "Backup Player Mother Name" },
    {
      key: "backup_emergency_contact_name",
      label: "Backup Player Emergency Contact",
    },
    {
      key: "backup_emergency_contact_phone",
      label: "Backup Player Emergency Phone",
    },
    { key: "backup_gatka_experience", label: "Backup Player Gatka Experience" },
    { key: "admin_notes", label: "Admin Notes" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
  ];

  // Use real-time notifications hook
  const { clearRegistrationNotifications } = useRealtimeNotifications();

  // Fetch registrations function that can be reused
  const fetchRegistrations = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const result = await RegistrationService.getAllRegistrations();

      if (result.error) {
        console.error("Error fetching registrations:", result.error);
        setError("Failed to load registrations. Please try again.");
      } else {
        setRegistrations(result.data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching registrations:", err);
      setError("Failed to load registrations. Please try again.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  React.useEffect(() => {
    setMounted(true);

    // Clear registration notifications when user visits this page
    // This indicates they've "seen" the new registrations
    clearRegistrationNotifications();

    fetchRegistrations();
  }, []);

  // Modal handlers
  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);

    // Refresh the registrations data after closing modal
    await fetchRegistrations(false); // Don't show loading spinner for refresh
  };

  // Copy token handler
  const handleCopyToken = async (formToken: string) => {
    try {
      await navigator.clipboard.writeText(formToken);
      addToast({
        variant: "success",
        title: "Token Copied",
        description: `Form token ${formToken} copied to clipboard`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy token:", error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = formToken;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        addToast({
          variant: "success",
          title: "Token Copied",
          description: `Form token ${formToken} copied to clipboard`,
          duration: 2000,
        });
      } catch (fallbackError) {
        addToast({
          variant: "error",
          title: "Copy Failed",
          description: "Failed to copy token to clipboard",
          duration: 3000,
        });
      }
    }
  };

  // Download PDF handler
  const handleDownloadPDF = async (registration: Registration) => {
    try {
      // For now, we'll implement a basic approach
      // You could enhance this with a proper PDF generation library like jsPDF or Puppeteer
      const content = generatePDFContent(registration);

      // Create a simple HTML page that can be printed as PDF
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  // Export handlers
  const handleExportClick = () => {
    // Set default columns to the most commonly used ones
    const defaultColumns = [
      "form_token",
      "team_name",
      "status",
      "division",
      "team_location",
      "submission_date_time",
      "ustad_name",
      "coach_name",
      "player1_name",
      "player1_singh_kaur",
      "player1_dob",
      "player1_phone_number",
      "player2_name",
      "player2_singh_kaur",
      "player2_dob",
      "player2_phone_number",
      "player3_name",
      "player3_singh_kaur",
      "player3_dob",
      "player3_phone_number",
    ];
    setExportColumns(defaultColumns);
    setIsExportModalOpen(true);
  };

  const handleColumnToggle = (columnKey: string) => {
    setExportColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((col) => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const selectAllColumns = () => {
    setExportColumns(availableColumns.map((col) => col.key));
  };

  const deselectAllColumns = () => {
    setExportColumns([]);
  };

  const convertToCSV = (data: Registration[], columns: string[]) => {
    if (data.length === 0) return "";

    const headers = columns.map((col) => {
      const columnDef = availableColumns.find((c) => c.key === col);
      return columnDef ? columnDef.label : col;
    });

    const csvContent = [headers];

    data.forEach((row) => {
      const csvRow = columns.map((col) => {
        let value = row[col as keyof Registration];

        // Handle dates
        if (col.includes("date") || col.includes("_at")) {
          value = value ? new Date(value as string).toLocaleString() : "";
        }

        // Handle null/undefined values
        if (value == null) {
          value = "";
        }

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return '"' + stringValue.replace(/"/g, '""') + '"';
        }

        return stringValue;
      });
      csvContent.push(csvRow);
    });

    return csvContent.map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = () => {
    if (exportColumns.length === 0) {
      addToast({
        variant: "error",
        title: "No Columns Selected",
        description: "Please select at least one column to export.",
        duration: 3000,
      });
      return;
    }

    // Apply filters to registrations
    let dataToExport = registrations.filter((registration) => {
      const matchesStatus =
        exportFilters.status === "all" ||
        registration.status === exportFilters.status;
      const matchesDivision =
        exportFilters.division === "all" ||
        registration.division === exportFilters.division;

      let matchesDateRange = true;
      if (exportFilters.dateFrom || exportFilters.dateTo) {
        const submissionDate = new Date(registration.submission_date_time);
        if (exportFilters.dateFrom) {
          matchesDateRange =
            matchesDateRange &&
            submissionDate >= new Date(exportFilters.dateFrom);
        }
        if (exportFilters.dateTo) {
          const endDate = new Date(exportFilters.dateTo);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          matchesDateRange = matchesDateRange && submissionDate <= endDate;
        }
      }

      return matchesStatus && matchesDivision && matchesDateRange;
    });

    const csvContent = convertToCSV(dataToExport, exportColumns);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `registrations-export-${timestamp}.csv`;

    downloadCSV(csvContent, filename);

    addToast({
      variant: "success",
      title: "Export Successful",
      description: `Exported ${dataToExport.length} registrations to ${filename}`,
      duration: 3000,
    });

    setIsExportModalOpen(false);
  };

  // Generate status badge HTML for PDF
  const getStatusBadgeHTML = (status: StatusType) => {
    const getStatusConfig = (status: StatusType) => {
      switch (status) {
        case "new submission":
          return {
            className: "status-new-submission",
            label: "New Submission",
          };
        case "in review":
          return {
            className: "status-in-review",
            label: "In Review",
          };
        case "information requested":
          return {
            className: "status-information-requested",
            label: "Info Requested",
          };
        case "approved":
          return {
            className: "status-approved",
            label: "Approved",
          };
        case "denied":
          return {
            className: "status-denied",
            label: "Denied",
          };
        case "dropped":
          return {
            className: "status-dropped",
            label: "Dropped",
          };
        default:
          return {
            className: "status-new-submission",
            label:
              String(status).charAt(0).toUpperCase() + String(status).slice(1),
          };
      }
    };

    const config = getStatusConfig(status);
    return `<span class="status-badge ${config.className}">${config.label}</span>`;
  };

  // Generate PDF content
  const generatePDFContent = (registration: Registration) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registration - ${registration.form_token}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .field { margin: 8px 0; }
          .label { font-weight: bold; display: inline-block; min-width: 120px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: top; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .player-section { margin-bottom: 20px; }
          .player-header { background-color: #f8f9fa; padding: 8px; margin: 10px 0; font-weight: bold; border-left: 4px solid #007bff; }
          .status-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid; }
          .status-new-submission { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
          .status-in-review { background-color: #fef3c7; color: #a16207; border-color: #fde68a; }
          .status-information-requested { background-color: #fed7aa; color: #c2410c; border-color: #fdba74; }
          .status-approved { background-color: #dcfce7; color: #15803d; border-color: #bbf7d0; }
          .status-denied { background-color: #fee2e2; color: #dc2626; border-color: #fecaca; }
          .status-dropped { background-color: #f3f4f6; color: #374151; border-color: #d1d5db; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Registration Details</h1>
          <h2>${registration.team_name}</h2>
          <p><strong>Form Token:</strong> ${registration.form_token}</p>
        </div>

        <!-- Form Metadata Section -->
        <div class="section">
          <h3>Form Metadata</h3>
          <div class="field"><span class="label">Form Token:</span> ${
            registration.form_token
          }</div>
          <div class="field"><span class="label">Status:</span> ${getStatusBadgeHTML(
            registration.status
          )}</div>
          <div class="field"><span class="label">Division:</span> ${
            registration.division
          }</div>
          <div class="field"><span class="label">Submitted:</span> ${new Date(
            registration.submission_date_time
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Created:</span> ${new Date(
            registration.created_at
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Last Updated:</span> ${new Date(
            registration.updated_at
          ).toLocaleString()}</div>
        </div>

        <!-- Team Information Section -->
        <div class="section">
          <h3>Team Information</h3>
          <div class="field"><span class="label">Team Name:</span> ${
            registration.team_name
          }</div>
          <div class="field"><span class="label">Location:</span> ${
            registration.team_location || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Ustad Information</h4>
          <div class="field"><span class="label">Ustad Name:</span> ${
            registration.ustad_name || "N/A"
          }</div>
          <div class="field"><span class="label">Ustad Email:</span> ${
            registration.ustad_email || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Senior Coach Information</h4>
          <div class="field"><span class="label">Senior Coach Name:</span> ${
            registration.coach_name || "N/A"
          }</div>
          <div class="field"><span class="label">Senior Coach Email:</span> ${
            registration.coach_email || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Player Order</h4>
          <div class="field"><span class="label">Default Player Order:</span> ${
            registration.player_order || "N/A"
          }</div>
        </div>

        <!-- Player Information Section -->
        <div class="section">
          <h3>Player Information</h3>
          
          <div class="player-section">
            <div class="player-header">Player 1</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player1_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player1_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player1_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player1_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player1_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player1_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player1_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player1_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player1_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player1_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player1_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 2</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player2_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player2_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player2_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player2_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player2_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player2_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player2_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player2_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player2_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player2_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player2_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 3</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player3_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player3_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player3_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player3_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player3_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player3_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player3_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player3_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player3_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player3_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player3_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Backup Player</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.backup_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.backup_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.backup_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.backup_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.backup_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.backup_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.backup_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.backup_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.backup_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.backup_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.backup_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>
        </div>

        ${
          registration.admin_notes
            ? `
        <div class="section">
          <h3>Admin Notes</h3>
          <div class="field" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">${registration.admin_notes}</div>
        </div>
        `
            : ""
        }
      </body>
      </html>
    `;
  };

  const handleSaveRegistration = async (updatedRegistration: Registration) => {
    try {
      const result = await RegistrationService.updateFullRegistration(
        updatedRegistration.id,
        {
          status: updatedRegistration.status,
          submission_date_time: updatedRegistration.submission_date_time,
          form_token: updatedRegistration.form_token,
          division: updatedRegistration.division,
          team_name: updatedRegistration.team_name,
          ustad_name: updatedRegistration.ustad_name,
          ustad_email: updatedRegistration.ustad_email,
          coach_name: updatedRegistration.coach_name,
          coach_email: updatedRegistration.coach_email,
          team_location: updatedRegistration.team_location,
          player_order: updatedRegistration.player_order,
          team_photo: updatedRegistration.team_photo,
          player1_name: updatedRegistration.player1_name,
          player1_singh_kaur: updatedRegistration.player1_singh_kaur,
          player1_dob: updatedRegistration.player1_dob,
          player1_dob_proof: updatedRegistration.player1_dob_proof,
          player1_email: updatedRegistration.player1_email,
          player1_phone_number: updatedRegistration.player1_phone_number,
          player1_emergency_contact_name:
            updatedRegistration.player1_emergency_contact_name,
          player1_emergency_contact_phone:
            updatedRegistration.player1_emergency_contact_phone,
          player1_father_name: updatedRegistration.player1_father_name,
          player1_mother_name: updatedRegistration.player1_mother_name,
          player1_city: updatedRegistration.player1_city,
          player1_gatka_experience:
            updatedRegistration.player1_gatka_experience,
          player2_name: updatedRegistration.player2_name,
          player2_singh_kaur: updatedRegistration.player2_singh_kaur,
          player2_dob: updatedRegistration.player2_dob,
          player2_dob_proof: updatedRegistration.player2_dob_proof,
          player2_email: updatedRegistration.player2_email,
          player2_phone_number: updatedRegistration.player2_phone_number,
          player2_emergency_contact_name:
            updatedRegistration.player2_emergency_contact_name,
          player2_emergency_contact_phone:
            updatedRegistration.player2_emergency_contact_phone,
          player2_father_name: updatedRegistration.player2_father_name,
          player2_mother_name: updatedRegistration.player2_mother_name,
          player2_city: updatedRegistration.player2_city,
          player2_gatka_experience:
            updatedRegistration.player2_gatka_experience,
          player3_name: updatedRegistration.player3_name,
          player3_singh_kaur: updatedRegistration.player3_singh_kaur,
          player3_dob: updatedRegistration.player3_dob,
          player3_dob_proof: updatedRegistration.player3_dob_proof,
          player3_email: updatedRegistration.player3_email,
          player3_phone_number: updatedRegistration.player3_phone_number,
          player3_emergency_contact_name:
            updatedRegistration.player3_emergency_contact_name,
          player3_emergency_contact_phone:
            updatedRegistration.player3_emergency_contact_phone,
          player3_father_name: updatedRegistration.player3_father_name,
          player3_mother_name: updatedRegistration.player3_mother_name,
          player3_city: updatedRegistration.player3_city,
          player3_gatka_experience:
            updatedRegistration.player3_gatka_experience,
          backup_player: updatedRegistration.backup_player,
          backup_name: updatedRegistration.backup_name,
          backup_singh_kaur: updatedRegistration.backup_singh_kaur,
          backup_dob: updatedRegistration.backup_dob,
          backup_dob_proof: updatedRegistration.backup_dob_proof,
          backup_email: updatedRegistration.backup_email,
          backup_phone_number: updatedRegistration.backup_phone_number,
          backup_emergency_contact_name:
            updatedRegistration.backup_emergency_contact_name,
          backup_emergency_contact_phone:
            updatedRegistration.backup_emergency_contact_phone,
          backup_father_name: updatedRegistration.backup_father_name,
          backup_mother_name: updatedRegistration.backup_mother_name,
          backup_city: updatedRegistration.backup_city,
          backup_gatka_experience: updatedRegistration.backup_gatka_experience,
          admin_notes: updatedRegistration.admin_notes,
        }
      );

      if (result.error) {
        console.error("Error saving registration:", result.error);
        throw new Error("Failed to save registration");
      }

      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === updatedRegistration.id ? updatedRegistration : reg
        )
      );

      console.log("Registration saved successfully");
    } catch (error) {
      console.error("Error in handleSaveRegistration:", error);
      throw error;
    }
  };

  // Filter and search registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((registration) => {
        const matchesSearch =
          registration.team_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          registration.form_token
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          registration.team_location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (registration.ustad_name &&
            registration.ustad_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        const matchesStatus =
          statusFilter === "all" || registration.status === statusFilter;
        const matchesDivision =
          divisionFilter === "all" || registration.division === divisionFilter;

        return matchesSearch && matchesStatus && matchesDivision;
      })
      .sort((a, b) => {
        // Sort by latest updated date (most recent first)
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
  }, [registrations, searchTerm, statusFilter, divisionFilter]);

  // Group registrations
  const groupedRegistrations = useMemo(() => {
    if (groupBy === "none") {
      return { "All Registrations": filteredRegistrations };
    }

    const groups: Record<string, Registration[]> = {};

    filteredRegistrations.forEach((registration) => {
      let groupKey = "";

      switch (groupBy) {
        case "status":
          groupKey =
            registration.status.charAt(0).toUpperCase() +
            registration.status.slice(1);
          break;
        case "division":
          groupKey = registration.division;
          break;
        case "location":
          groupKey =
            registration.team_location.split(",").pop()?.trim() ||
            registration.team_location;
          break;
        default:
          groupKey = "All Registrations";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(registration);
    });

    return groups;
  }, [filteredRegistrations, groupBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  if (!mounted || loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
            <p className="text-muted-foreground">
              Loading registration data...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
            <p className="text-muted-foreground">
              Error loading registration data
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <PageHeader title="Registrations">
        <Button variant="outline" size="sm" onClick={handleExportClick}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" onClick={() => window.open("/register", "_blank")}>
          <FileText className="mr-2 h-4 w-4" />
          New Registration
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total Registrations"
          value={registrations.length}
          description="All registration statuses"
          icon={FileText}
        />
        <StatCard
          title="Pending Review"
          value={
            registrations.filter(
              (r) =>
                r.status === "new submission" ||
                r.status === "in review" ||
                r.status === "information requested"
            ).length
          }
          description="Awaiting approval/denial"
          icon={Clock}
          iconColor="text-yellow-600"
          valueColor="text-2xl font-bold text-yellow-600"
        />
        <StatCard
          title="Approved"
          value={registrations.filter((r) => r.status === "approved").length}
          description="Ready for tournament"
          icon={CheckCircle}
          iconColor="text-green-600"
          valueColor="text-2xl font-bold text-green-600"
        />
        <StatCard
          title="Denied"
          value={registrations.filter((r) => r.status === "denied").length}
          description="Not eligible"
          icon={XCircle}
          iconColor="text-red-600"
          valueColor="text-2xl font-bold text-red-600"
        />
        <StatCard
          title="Dropped"
          value={registrations.filter((r) => r.status === "dropped").length}
          description="Withdrew from tournament"
          icon={Archive}
          iconColor="text-gray-600"
          valueColor="text-2xl font-bold text-gray-600"
        />
        <StatCard
          title="Total Players"
          value={registrations
            .filter((r) => r.status === "approved")
            .reduce((sum, r) => {
              // Count actual players: 3 main players + 1 backup if exists
              let playerCount = 3; // player1, player2, player3
              if (r.backup_player && r.backup_name) {
                playerCount += 1;
              }
              return sum + playerCount;
            }, 0)}
          description=""
          icon={Users}
          iconColor="text-blue-600"
          valueColor="text-2xl font-bold text-blue-600"
          secondaryValue={registrations.reduce((sum, r) => {
            // Count actual players: 3 main players + 1 backup if exists
            let playerCount = 3; // player1, player2, player3
            if (r.backup_player && r.backup_name) {
              playerCount += 1;
            }
            return sum + playerCount;
          }, 0)}
          secondaryLabel="All registrations"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter registrations by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by team name, token, location, or ustaad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new submission">New Submission</SelectItem>
                <SelectItem value="in review">In Review</SelectItem>
                <SelectItem value="information requested">
                  Information Requested
                </SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>

            {/* Division Filter */}
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="Junior Kaurs">Junior Kaurs</SelectItem>
                <SelectItem value="Junior Singhs">Junior Singhs</SelectItem>
                <SelectItem value="Open Kaurs">Open Kaurs</SelectItem>
                <SelectItem value="Open Singhs">Open Singhs</SelectItem>
              </SelectContent>
            </Select>

            {/* Group By */}
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="status">Group by Status</SelectItem>
                <SelectItem value="division">Group by Division</SelectItem>
                <SelectItem value="location">Group by Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registration Records ({filteredRegistrations.length})
          </CardTitle>
          <CardDescription>
            Complete list of tournament registrations with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedRegistrations).map(
              ([groupName, registrations]) => (
                <div key={groupName}>
                  {groupBy !== "none" && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2">
                        {groupName} ({registrations.length})
                      </h3>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-36">Form Token</TableHead>
                          <TableHead className="w-36">
                            Submission Date
                          </TableHead>
                          <TableHead className="w-36">Last Updated</TableHead>
                          <TableHead className="w-40">Team Name</TableHead>
                          <TableHead className="w-40">Ustaad</TableHead>
                          <TableHead className="w-36">Location</TableHead>
                          <TableHead className="w-32">Division</TableHead>
                          <TableHead className="w-36">Status</TableHead>
                          <TableHead className="w-12 text-center">
                            Players
                          </TableHead>
                          <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-mono text-sm">
                              <TruncatedText
                                text={registration.form_token}
                                maxLength={20}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>
                                  {formatDate(
                                    registration.submission_date_time
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(
                                    registration.submission_date_time
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>
                                  {formatDate(registration.updated_at)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(registration.updated_at)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <TruncatedText
                                text={registration.team_name}
                                maxLength={30}
                              />
                            </TableCell>
                            <TableCell className="w-48 max-w-48">
                              {registration.ustad_name ? (
                                <TruncatedText
                                  text={registration.ustad_name}
                                  maxLength={20}
                                />
                              ) : (
                                <span className="text-muted-foreground italic">
                                  None
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <TruncatedText
                                text={registration.team_location}
                                maxLength={25}
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {registration.division}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-32">
                              <StatusBadge status={registration.status} />
                            </TableCell>
                            <TableCell className="text-center">
                              {3 +
                                (registration.backup_player &&
                                registration.backup_name
                                  ? 1
                                  : 0)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewDetails(registration)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleCopyToken(registration.form_token)
                                    }
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Token
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDownloadPDF(registration)
                                    }
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {registrations.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No registrations found matching your criteria.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Export Registrations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportModalOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Filters Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <Select
                      value={exportFilters.status}
                      onValueChange={(value) =>
                        setExportFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new submission">
                          New Submission
                        </SelectItem>
                        <SelectItem value="in review">In Review</SelectItem>
                        <SelectItem value="information requested">
                          Information Requested
                        </SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Division
                    </label>
                    <Select
                      value={exportFilters.division}
                      onValueChange={(value) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          division: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Divisions</SelectItem>
                        <SelectItem value="Junior Kaurs">
                          Junior Kaurs
                        </SelectItem>
                        <SelectItem value="Junior Singhs">
                          Junior Singhs
                        </SelectItem>
                        <SelectItem value="Open Kaurs">Open Kaurs</SelectItem>
                        <SelectItem value="Open Singhs">Open Singhs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date From
                    </label>
                    <Input
                      type="date"
                      value={exportFilters.dateFrom}
                      onChange={(e) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          dateFrom: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date To
                    </label>
                    <Input
                      type="date"
                      value={exportFilters.dateTo}
                      onChange={(e) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          dateTo: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Column Selection Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Select Columns to Export
                  </h3>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllColumns}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllColumns}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {availableColumns.map((column) => (
                    <label
                      key={column.key}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={exportColumns.includes(column.key)}
                        onChange={() => handleColumnToggle(column.key)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{column.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  {exportColumns.length} column(s) selected
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
