"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  valueColor = "text-2xl font-bold",
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={valueColor}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface RegistrationStatsProps {
  data: {
    totalRegistrations: number;
    pendingRegistrations: number;
    approvedRegistrations: number;
    deniedRegistrations: number;
    totalPlayers?: number;
  };
  statsType?: "registrations" | "teams" | "players" | "custom";
  showPlayerCount?: boolean;
}

export function RegistrationStats({
  data,
  statsType = "registrations",
  showPlayerCount = false,
}: RegistrationStatsProps) {
  // Calculate player count based on approved teams if not provided
  // For now, using placeholder logic (3-4 players per team)
  // This should be replaced with actual player count from database
  const calculatedPlayerCount =
    data.totalPlayers || data.approvedRegistrations * 3.5; // Average of 3-4 players per team
  const getStatsConfig = () => {
    switch (statsType) {
      case "registrations":
        return {
          totalLabel: "Total Registrations",
          totalDesc: "All registration statuses",
          pendingLabel: "Pending Review",
          pendingDesc: "Awaiting approval/denial",
          approvedLabel: "Approved",
          approvedDesc: "Ready for tournament",
          deniedLabel: "Denied",
          deniedDesc: "Not eligible",
        };
      case "teams":
        return {
          totalLabel: "Total Teams",
          totalDesc: "All teams registered",
          pendingLabel: "Teams Pending",
          pendingDesc: "Teams awaiting review",
          approvedLabel: "Active Teams",
          approvedDesc: "Teams ready to compete",
          deniedLabel: "Rejected Teams",
          deniedDesc: "Teams not accepted",
        };
      case "players":
        return {
          totalLabel: "Total Players",
          totalDesc: "All registered players",
          pendingLabel: "Players Pending",
          pendingDesc: "Players awaiting verification",
          approvedLabel: "Active Players",
          approvedDesc: "Players ready to compete",
          deniedLabel: "Inactive Players",
          deniedDesc: "Players not eligible",
        };
      default:
        return {
          totalLabel: "Total Items",
          totalDesc: "All items in system",
          pendingLabel: "Pending Items",
          pendingDesc: "Items awaiting processing",
          approvedLabel: "Approved Items",
          approvedDesc: "Items ready for use",
          deniedLabel: "Rejected Items",
          deniedDesc: "Items not approved",
        };
    }
  };

  const config = getStatsConfig();

  const gridCols = showPlayerCount ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${gridCols}`}>
      <StatCard
        title={config.totalLabel}
        value={data.totalRegistrations}
        description={config.totalDesc}
        icon={FileText}
      />
      <StatCard
        title={config.pendingLabel}
        value={data.pendingRegistrations}
        description={config.pendingDesc}
        icon={Clock}
        iconColor="text-yellow-600"
        valueColor="text-2xl font-bold text-yellow-600"
      />
      <StatCard
        title={config.approvedLabel}
        value={data.approvedRegistrations}
        description={config.approvedDesc}
        icon={CheckCircle}
        iconColor="text-green-600"
        valueColor="text-2xl font-bold text-green-600"
      />
      <StatCard
        title={config.deniedLabel}
        value={data.deniedRegistrations}
        description={config.deniedDesc}
        icon={XCircle}
        iconColor="text-red-600"
        valueColor="text-2xl font-bold text-red-600"
      />
      {showPlayerCount && (
        <StatCard
          title="Total Players"
          value={Math.round(calculatedPlayerCount)}
          description="From approved teams only"
          icon={Users}
          iconColor="text-blue-600"
          valueColor="text-2xl font-bold text-blue-600"
        />
      )}
    </div>
  );
}
