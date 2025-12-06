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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<string>("none");

  // Use real-time notifications hook
  const { clearRegistrationNotifications } = useRealtimeNotifications();

  React.useEffect(() => {
    setMounted(true);

    // Clear registration notifications when user visits this page
    // This indicates they've "seen" the new registrations
    clearRegistrationNotifications();

    const fetchRegistrations = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

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
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          New Registration
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Registration
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    Copy Token
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
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
    </div>
  );
}
