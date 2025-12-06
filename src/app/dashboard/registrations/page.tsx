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
import { StatusType, DivisionType } from "@/types/database";
import { StatCard } from "../_components/stat-card";

// Registration interface based on database schema
interface Registration {
  id: string;
  form_token: string;
  submission_date_time: string;
  last_updated: string;
  team_name: string;
  ustad_name: string | null;
  team_location: string;
  division: DivisionType;
  status: StatusType;
  participants?: number;
}

// Mock data for demonstration
const mockRegistrations: Registration[] = [
  {
    id: "1",
    form_token: "jet-2024-001",
    submission_date_time: "2024-01-15T10:30:00Z",
    last_updated: "2024-01-20T14:15:00Z",
    team_name: "Punjab Warriors",
    ustad_name: "Giani Jasbir Singh",
    team_location: "Punjab, India",
    division: "Open Singhs",
    status: "approved",
    participants: 8,
  },
  {
    id: "2",
    form_token: "jet-2024-002",
    submission_date_time: "2024-01-16T14:15:00Z",
    last_updated: "2024-01-16T14:15:00Z",
    team_name: "California Sikhs",
    ustad_name: "Bhai Manpreet Singh",
    team_location: "California, USA",
    division: "Open Kaurs",
    status: "new submission",
    participants: 6,
  },
  {
    id: "3",
    form_token: "jet-2024-003",
    submission_date_time: "2024-01-17T09:45:00Z",
    last_updated: "2024-01-23T16:30:00Z",
    team_name: "Toronto Tigers",
    ustad_name: "Singh Sahib Baljit Singh",
    team_location: "Toronto, Canada",
    division: "Junior Singhs",
    status: "in review",
    participants: 12,
  },
  {
    id: "4",
    form_token: "jet-2024-004",
    submission_date_time: "2024-01-18T16:20:00Z",
    last_updated: "2024-01-24T11:45:00Z",
    team_name: "UK United",
    ustad_name: "Giani Harpreet Kaur",
    team_location: "London, UK",
    division: "Open Kaurs",
    status: "approved",
    participants: 10,
  },
  {
    id: "5",
    form_token: "jet-2024-005",
    submission_date_time: "2024-01-19T11:00:00Z",
    last_updated: "2024-01-25T09:20:00Z",
    team_name: "Delhi Defenders",
    ustad_name: "Sant Baba Kulwant Singh",
    team_location: "Delhi, India",
    division: "Junior Kaurs",
    status: "denied",
    participants: 7,
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<string>("none");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and search registrations
  const filteredRegistrations = useMemo(() => {
    return mockRegistrations
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
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime()
        );
      });
  }, [searchTerm, statusFilter, divisionFilter]);

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

  if (!mounted) {
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
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
          <p className="text-muted-foreground">
            Manage and review all tournament registrations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            New Registration
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Registrations"
          value={mockRegistrations.length}
          description="All registration statuses"
          icon={FileText}
        />
        <StatCard
          title="Pending Review"
          value={
            mockRegistrations.filter(
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
          value={
            mockRegistrations.filter((r) => r.status === "approved").length
          }
          description="Ready for tournament"
          icon={CheckCircle}
          iconColor="text-green-600"
          valueColor="text-2xl font-bold text-green-600"
        />
        <StatCard
          title="Denied"
          value={mockRegistrations.filter((r) => r.status === "denied").length}
          description="Not eligible"
          icon={XCircle}
          iconColor="text-red-600"
          valueColor="text-2xl font-bold text-red-600"
        />
        <StatCard
          title="Total Players"
          value={mockRegistrations.reduce(
            (sum, r) => sum + (r.participants || 0),
            0
          )}
          description="From approved teams only"
          icon={Users}
          iconColor="text-blue-600"
          valueColor="text-2xl font-bold text-blue-600"
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
                <SelectItem value="location">Group by Country</SelectItem>
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
                          <TableHead>Form Token</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Team Name</TableHead>
                          <TableHead>Ustaad</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Division</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Players</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-mono text-sm">
                              {registration.form_token}
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
                                  {formatDate(registration.last_updated)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(registration.last_updated)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {registration.team_name}
                            </TableCell>
                            <TableCell>
                              {registration.ustad_name || (
                                <span className="text-muted-foreground italic">
                                  None
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{registration.team_location}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {registration.division}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={registration.status} />
                            </TableCell>
                            <TableCell className="text-center">
                              {registration.participants || 0}
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
