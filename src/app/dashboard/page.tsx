"use client";

import { AppSidebar } from "./_components/app-sidebar";
import { BarChartHorizontal } from "./_components/barchart-horizontal";
import { StatCard } from "./_components/stat-card";
import { RecentRegistrations } from "./_components/recent-registrations";
import { AreaChartInteractive } from "./_components/area-chart-interactive";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ScrambledText from "@/components/ui/scrambled-text";

import {
  Users,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data - replace with real API calls
const mockData = {
  totalRegistrations: 247,
  pendingRegistrations: 32,
  approvedRegistrations: 198,
  deniedRegistrations: 17,
  totalPlayers: 712, // Actual player count from approved teams
  cityBreakdown: [
    { city: "Vancouver", count: 45 },
    { city: "Toronto", count: 38 },
    { city: "Calgary", count: 32 },
    { city: "Montreal", count: 28 },
    { city: "Ottawa", count: 24 },
    { city: "Edmonton", count: 18 },
    { city: "Winnipeg", count: 15 },
    { city: "Quebec City", count: 12 },
    { city: "Hamilton", count: 11 },
    { city: "London", count: 9 },
    { city: "Halifax", count: 8 },
    { city: "Victoria", count: 7 },
    { city: "Saskatoon", count: 6 },
    { city: "Regina", count: 5 },
    { city: "Kitchener", count: 5 },
    { city: "Windsor", count: 4 },
    { city: "Oshawa", count: 4 },
    { city: "St. John's", count: 3 },
    { city: "Barrie", count: 3 },
    { city: "Kelowna", count: 2 },
    { city: "Abbotsford", count: 2 },
    { city: "Kingston", count: 2 },
    { city: "Sudbury", count: 1 },
    { city: "Thunder Bay", count: 1 },
  ],
  recentRegistrations: [
    {
      id: "REG-2024-001",
      registrationDate: "2024-11-25",
      teamName: "Baba Surjit Singh Ji 96Crori Budha Dal",
      akhara: "Singh Sabha Akhara Vancouver Gurdwara",
      ustaad: "Gurdeep Singh Khalsa",
      location: "Vancouver",
      status: "new submission",
    },
    {
      id: "REG-2024-002",
      registrationDate: "2024-11-24",
      teamName: "Lightning Bolts",
      akhara: "Khalsa Akhara",
      ustaad: "Harpreet Kaur",
      location: "Toronto",
      status: "approved",
    },
    {
      id: "REG-2024-003",
      registrationDate: "2024-11-23",
      teamName: "Storm Riders",
      akhara: "Dashmesh Akhara",
      ustaad: "Jasbir Singh",
      location: "Calgary",
      status: "in review",
    },
    {
      id: "REG-2024-004",
      registrationDate: "2024-11-22",
      teamName: "Wind Runners",
      akhara: "Guru Gobind Akhara",
      ustaad: "Simran Kaur",
      location: "Montreal",
      status: "information requested",
    },
    {
      id: "REG-2024-005",
      registrationDate: "2024-11-21",
      teamName: "Fire Eagles",
      akhara: "Nihangs Akhara",
      ustaad: "Baljit Singh",
      location: "Ottawa",
      status: "denied",
    },
  ],
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* TOP THIRD - Registration Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Total Registrations"
              value={mockData.totalRegistrations}
              description="All registration statuses"
              icon={FileText}
            />
            <StatCard
              title="Pending Review"
              value={mockData.pendingRegistrations}
              description="Awaiting approval/denial"
              icon={Clock}
              iconColor="text-yellow-600"
              valueColor="text-2xl font-bold text-yellow-600"
            />
            <StatCard
              title="Approved"
              value={mockData.approvedRegistrations}
              description="Ready for tournament"
              icon={CheckCircle}
              iconColor="text-green-600"
              valueColor="text-2xl font-bold text-green-600"
            />
            <StatCard
              title="Denied"
              value={mockData.deniedRegistrations}
              description="Not eligible"
              icon={XCircle}
              iconColor="text-red-600"
              valueColor="text-2xl font-bold text-red-600"
            />
            <StatCard
              title="Total Players"
              value={mockData.totalPlayers}
              description="From approved teams only"
              icon={Users}
              iconColor="text-blue-600"
              valueColor="text-2xl font-bold text-blue-600"
            />
          </div>

          {/* CENTER THIRD - Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Side - City Breakdown Chart */}
            <BarChartHorizontal
              data={mockData.cityBreakdown}
              barColor="url(#barGradient)"
              labelColor="#ffffff"
              title="Registrations by City"
              description="Geographic distribution of team registrations (top 10)"
              icon={<MapPin className="h-5 w-5" />}
              maxCities={5}
              barSize={45}
            />

            {/* Right Side - Registration Trends Area Chart */}
            <AreaChartInteractive
              title="Registration Trends"
              description="Daily registration activity over time"
              icon={<Users className="h-5 w-5" />}
            />
          </div>

          {/* BOTTOM THIRD - Recent Registrations Table */}
          <RecentRegistrations
            data={mockData.recentRegistrations}
            title="Recent Registrations"
            description="Latest team registrations from the past 7 days"
            maxItems={5}
            icon={<FileText className="h-5 w-5" />}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
