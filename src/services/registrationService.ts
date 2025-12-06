import { supabase } from "@/lib/supabase";
import {
  Registration,
  RegistrationSummary,
  StatusType,
  DivisionType,
} from "@/types/database";

// Registration service functions for database operations
export class RegistrationService {
  /**
   * Get all registrations with optional filtering
   */
  static async getAllRegistrations(filters?: {
    status?: StatusType;
    division?: DivisionType;
    searchTerm?: string;
  }): Promise<{ data: Registration[] | null; error: any }> {
    try {
      let query = supabase
        .from("registrations")
        .select("*")
        .order("updated_at", { ascending: false });

      // Apply filters if provided
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.division) {
        query = query.eq("division", filters.division);
      }

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        query = query.or(
          `team_name.ilike.%${searchTerm}%,form_token.ilike.%${searchTerm}%,team_location.ilike.%${searchTerm}%,ustad_name.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching registrations:", error);
        return { data: null, error };
      }

      return { data: data as Registration[], error: null };
    } catch (error) {
      console.error("Unexpected error fetching registrations:", error);
      return { data: null, error };
    }
  }

  /**
   * Get registration summary data (using the view for better performance)
   */
  static async getRegistrationSummaries(filters?: {
    status?: StatusType;
    division?: DivisionType;
    searchTerm?: string;
  }): Promise<{ data: RegistrationSummary[] | null; error: any }> {
    try {
      let query = supabase
        .from("registration_summary")
        .select("*")
        .order("updated_at", { ascending: false });

      // Apply filters if provided
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.division) {
        query = query.eq("division", filters.division);
      }

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        query = query.or(
          `team_name.ilike.%${searchTerm}%,form_token.ilike.%${searchTerm}%,team_location.ilike.%${searchTerm}%,ustad_name.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching registration summaries:", error);
        return { data: null, error };
      }

      return { data: data as RegistrationSummary[], error: null };
    } catch (error) {
      console.error("Unexpected error fetching registration summaries:", error);
      return { data: null, error };
    }
  }

  /**
   * Get registration counts by status
   */
  static async getRegistrationCounts(): Promise<{
    data: {
      total: number;
      newSubmissions: number;
      inReview: number;
      informationRequested: number;
      approved: number;
      denied: number;
      dropped: number;
      pending: number; // Combined new submissions + in review + information requested
    } | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("status");

      if (error) {
        console.error("Error fetching registration counts:", error);
        return { data: null, error };
      }

      const counts = {
        total: data.length,
        newSubmissions: 0,
        inReview: 0,
        informationRequested: 0,
        approved: 0,
        denied: 0,
        dropped: 0,
        pending: 0,
      };

      data.forEach((registration) => {
        switch (registration.status) {
          case "new submission":
            counts.newSubmissions++;
            counts.pending++;
            break;
          case "in review":
            counts.inReview++;
            counts.pending++;
            break;
          case "information requested":
            counts.informationRequested++;
            counts.pending++;
            break;
          case "approved":
            counts.approved++;
            break;
          case "denied":
            counts.denied++;
            break;
          case "dropped":
            counts.dropped++;
            break;
        }
      });

      return { data: counts, error: null };
    } catch (error) {
      console.error("Unexpected error fetching registration counts:", error);
      return { data: null, error };
    }
  }

  /**
   * Get total player count from approved registrations
   */
  static async getTotalPlayerCount(): Promise<{
    data: number | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("backup_player")
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching player count:", error);
        return { data: null, error };
      }

      // Each approved registration has 3 main players + 1 backup (if backup_player is true)
      const totalPlayers = data.reduce((total, registration) => {
        const mainPlayers = 3; // Always 3 main players
        const backupPlayers = registration.backup_player ? 1 : 0;
        return total + mainPlayers + backupPlayers;
      }, 0);

      return { data: totalPlayers, error: null };
    } catch (error) {
      console.error("Unexpected error fetching player count:", error);
      return { data: null, error };
    }
  }

  /**
   * Get total player count from all registrations (regardless of status)
   */
  static async getAllPlayersCount(): Promise<{
    data: number | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("backup_player");

      if (error) {
        console.error("Error fetching all player count:", error);
        return { data: null, error };
      }

      // Each registration has 3 main players + 1 backup (if backup_player is true)
      const totalPlayers = data.reduce((total, registration) => {
        const mainPlayers = 3; // Always 3 main players
        const backupPlayers = registration.backup_player ? 1 : 0;
        return total + mainPlayers + backupPlayers;
      }, 0);

      return { data: totalPlayers, error: null };
    } catch (error) {
      console.error("Unexpected error fetching all player count:", error);
      return { data: null, error };
    }
  }

  /**
   * Get recent registrations (last 10)
   */
  static async getRecentRegistrations(limit: number = 10): Promise<{
    data: Registration[] | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("submission_date_time", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching recent registrations:", error);
        return { data: null, error };
      }

      return { data: data as Registration[], error: null };
    } catch (error) {
      console.error("Unexpected error fetching recent registrations:", error);
      return { data: null, error };
    }
  }

  /**
   * Get registration by ID
   */
  static async getRegistrationById(id: string): Promise<{
    data: Registration | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching registration by ID:", error);
        return { data: null, error };
      }

      return { data: data as Registration, error: null };
    } catch (error) {
      console.error("Unexpected error fetching registration by ID:", error);
      return { data: null, error };
    }
  }

  /**
   * Update registration status and/or admin notes
   */
  static async updateRegistration(
    id: string,
    updates: {
      status?: StatusType;
      admin_notes?: string;
    }
  ): Promise<{ data: Registration | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating registration:", error);
        return { data: null, error };
      }

      return { data: data as Registration, error: null };
    } catch (error) {
      console.error("Unexpected error updating registration:", error);
      return { data: null, error };
    }
  }

  /**
   * Get city/location breakdown for charts
   */
  static async getLocationBreakdown(): Promise<{
    data: Array<{ city: string; count: number }> | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("team_location");

      if (error) {
        console.error("Error fetching location breakdown:", error);
        return { data: null, error };
      }

      // Process the data to count registrations by city/country
      const locationCounts: Record<string, number> = {};

      data.forEach((registration) => {
        // Extract city/country from location (assuming format like "Toronto, Canada")
        const location = registration.team_location;
        const parts = location.split(",");
        const city = parts[0]?.trim() || location;

        locationCounts[city] = (locationCounts[city] || 0) + 1;
      });

      // Convert to array and sort by count
      const locationArray = Object.entries(locationCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count);

      return { data: locationArray, error: null };
    } catch (error) {
      console.error("Unexpected error fetching location breakdown:", error);
      return { data: null, error };
    }
  }

  /**
   * Get registration trends data for charts (daily and cumulative counts)
   */
  static async getRegistrationTrends(days: number = 90): Promise<{
    data: Array<{
      date: string;
      registrations: number;
      cumulative: number;
    }> | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("submission_date_time")
        .order("submission_date_time", { ascending: true });

      if (error) {
        console.error("Error fetching registration trends:", error);
        return { data: null, error };
      }

      // Process data to create daily counts
      const dailyCounts: Record<string, number> = {};
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days);

      // Initialize all dates in range with 0
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        dailyCounts[dateStr] = 0;
      }

      // Count registrations by date
      data.forEach((registration) => {
        const date = new Date(registration.submission_date_time);
        const dateStr = date.toISOString().split("T")[0];
        if (dailyCounts.hasOwnProperty(dateStr)) {
          dailyCounts[dateStr]++;
        }
      });

      // Convert to array with cumulative counts
      let cumulative = 0;
      const trendsData = Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, registrations]) => {
          cumulative += registrations;
          return {
            date,
            registrations,
            cumulative,
          };
        });

      return { data: trendsData, error: null };
    } catch (error) {
      console.error("Unexpected error fetching registration trends:", error);
      return { data: null, error };
    }
  }
}
