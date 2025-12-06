"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  FileText,
  Eye,
  HelpCircle,
  CheckCircle,
  XCircle,
  Archive,
} from "lucide-react";
import { Registration } from "@/types/database";

interface RecentRegistrationsProps {
  data: Registration[];
  title?: string;
  description?: string;
  maxItems?: number;
  icon?: React.ReactNode;
}

// Status color definitions for Supabase integration
const STATUS_COLORS = {
  "new submission": {
    background: "#dbeafe", // blue-100
    text: "#1e40af", // blue-800
    border: "#bfdbfe", // blue-200
  },
  "in review": {
    background: "#fef3c7", // yellow-100
    text: "#92400e", // yellow-800
    border: "#fde68a", // yellow-200
  },
  "information requested": {
    background: "#fed7aa", // orange-100
    text: "#9a3412", // orange-800
    border: "#fdba74", // orange-200
  },
  approved: {
    background: "#dcfce7", // green-100
    text: "#166534", // green-800
    border: "#bbf7d0", // green-200
  },
  denied: {
    background: "#fee2e2", // red-100
    text: "#991b1b", // red-800
    border: "#fecaca", // red-200
  },
  dropped: {
    background: "#f3f4f6", // gray-100
    text: "#374151", // gray-800
    border: "#d1d5db", // gray-200
  },
};

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

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
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
          label: status.charAt(0).toUpperCase() + status.slice(1),
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

export function RecentRegistrations({
  data,
  title = "Recent Registrations",
  description = "Latest team registrations from the past 7 days",
  maxItems = 10,
  icon = <Clock className="h-5 w-5" />,
}: RecentRegistrationsProps) {
  const displayData = data.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Ustad</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-mono text-sm">
                  {registration.form_token}
                </TableCell>
                <TableCell>
                  {new Date(
                    registration.submission_date_time
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  <TruncatedText text={registration.team_name} maxLength={30} />
                </TableCell>
                <TableCell>
                  <TruncatedText text={registration.division} maxLength={25} />
                </TableCell>
                <TableCell>
                  <TruncatedText
                    text={registration.ustad_name}
                    maxLength={20}
                  />
                </TableCell>
                <TableCell>{registration.team_location}</TableCell>
                <TableCell>
                  <StatusBadge status={registration.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
