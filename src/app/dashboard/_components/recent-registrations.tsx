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
import { Clock } from "lucide-react";

interface RegistrationData {
  id: string;
  teamName: string;
  submitDate: string;
  status: string;
  city: string;
}

interface RecentRegistrationsProps {
  data: RegistrationData[];
  title?: string;
  description?: string;
  maxItems?: number;
  icon?: React.ReactNode;
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    denied: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge
      className={variants[status as keyof typeof variants] || variants.pending}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
              <TableHead>Team Name</TableHead>
              <TableHead>Submit Date</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-mono text-sm">
                  {registration.id}
                </TableCell>
                <TableCell className="font-medium">
                  {registration.teamName}
                </TableCell>
                <TableCell>{registration.submitDate}</TableCell>
                <TableCell>{registration.city}</TableCell>
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
