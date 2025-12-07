"use client";

import { useEffect, useState } from "react";
import { BarChartHorizontal } from "./_components/barchart-horizontal";
import { StatCard } from "./_components/stat-card";
import { RecentRegistrations } from "./_components/recent-registrations";
import { AreaChartInteractive } from "./_components/area-chart-interactive";
import { RegistrationService } from "@/services/registrationService";
import { Registration } from "@/types/database";
import { PageHeader } from "@/components/PageHeader";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

import {
  Users,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
} from "lucide-react";

export default function Page() {
  const [dashboardData, setDashboardData] = useState({
    counts: {
      total: 0,
      pending: 0,
      approved: 0,
      denied: 0,
      dropped: 0,
    },
    totalPlayers: 0,
    allPlayers: 0,
    cityBreakdown: [] as Array<{ city: string; count: number }>,
    recentRegistrations: [] as Registration[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use real-time notifications hook
  const { notifications } = useRealtimeNotifications();

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        countsResult,
        playersResult,
        allPlayersResult,
        locationsResult,
        recentResult,
      ] = await Promise.all([
        RegistrationService.getRegistrationCounts(),
        RegistrationService.getTotalPlayerCount(),
        RegistrationService.getAllPlayersCount(),
        RegistrationService.getLocationBreakdown(),
        RegistrationService.getRecentRegistrations(5),
      ]);

      // Handle errors
      if (countsResult.error) {
        console.error("Error fetching counts:", countsResult.error);
      }
      if (playersResult.error) {
        console.error("Error fetching players:", playersResult.error);
      }
      if (allPlayersResult.error) {
        console.error("Error fetching all players:", allPlayersResult.error);
      }
      if (locationsResult.error) {
        console.error("Error fetching locations:", locationsResult.error);
      }
      if (recentResult.error) {
        console.error(
          "Error fetching recent registrations:",
          recentResult.error
        );
      }

      // Update state with fetched data
      setDashboardData({
        counts: {
          total: countsResult.data?.total || 0,
          pending: countsResult.data?.pending || 0,
          approved: countsResult.data?.approved || 0,
          denied: countsResult.data?.denied || 0,
          dropped: countsResult.data?.dropped || 0,
        },
        totalPlayers: playersResult.data || 0,
        allPlayers: allPlayersResult.data || 0,
        cityBreakdown: locationsResult.data || [],
        recentRegistrations: recentResult.data || [],
      });
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh dashboard data when new notifications arrive
  useEffect(() => {
    if (notifications.length > 0) {
      console.log("🔄 Refreshing dashboard data due to new notifications");
      // Debounce the refresh to avoid too many API calls
      const timeoutId = setTimeout(() => {
        fetchDashboardData();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [notifications.length]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <XCircle className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Dashboard Header */}
      <PageHeader title="Dashboard" />

      {/* TOP THIRD - Registration Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total Registrations"
          value={dashboardData.counts.total}
          description="All registration statuses"
          icon={FileText}
        />
        <StatCard
          title="Pending Review"
          value={dashboardData.counts.pending}
          description="Awaiting approval/denial"
          icon={Clock}
          iconColor="text-yellow-600"
          valueColor="text-2xl font-bold text-yellow-600"
        />
        <StatCard
          title="Approved"
          value={dashboardData.counts.approved}
          description="Ready for tournament"
          icon={CheckCircle}
          iconColor="text-green-600"
          valueColor="text-2xl font-bold text-green-600"
        />
        <StatCard
          title="Denied"
          value={dashboardData.counts.denied}
          description="Not eligible"
          icon={XCircle}
          iconColor="text-red-600"
          valueColor="text-2xl font-bold text-red-600"
        />
        <StatCard
          title="Dropped"
          value={dashboardData.counts.dropped}
          description="Withdrew from tournament"
          icon={Archive}
          iconColor="text-gray-600"
          valueColor="text-2xl font-bold text-gray-600"
        />
        <StatCard
          title="Total Players"
          value={dashboardData.totalPlayers}
          description=""
          icon={Users}
          iconColor="text-blue-600"
          valueColor="text-2xl font-bold text-blue-600"
          secondaryValue={dashboardData.allPlayers}
          secondaryLabel="All registrations"
        />
      </div>

      {/* CENTER THIRD - Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side - City Breakdown Chart */}
        <BarChartHorizontal
          data={dashboardData.cityBreakdown}
          barColor="url(#barGradient)"
          labelColor="#ffffff"
          title="Registrations by City"
          description="Geographic distribution of team registrations (top 10)"
          icon={<MapPin className="h-5 w-5" />}
          maxCities={5}
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
        data={dashboardData.recentRegistrations}
        title="Recent Registrations"
        description="Latest team registrations from the past 7 days"
        maxItems={5}
        icon={<FileText className="h-5 w-5" />}
      />
    </div>
  );
}
