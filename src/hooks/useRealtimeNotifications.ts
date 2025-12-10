"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Registration } from "@/types/database";
import { getAdminUserName } from "@/lib/utils/adminUtils";

export interface NotificationData {
  id: string;
  type: "new" | "updated" | "admin_updated";
  formToken: string;
  teamName: string;
  timestamp: Date;
  read: boolean;
  updateSource?: "user" | "admin";
  adminUser?: string;
}

interface UseRealtimeNotificationsReturn {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  clearRegistrationNotifications: () => void;
}

export function useRealtimeNotifications(
  currentUser?: { email?: string } | null
): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Helper to get current user identifier for comparison using shared utility
  const getCurrentUserIdentifier = () => {
    return currentUser ? getAdminUserName(currentUser) : null;
  };

  useEffect(() => {
    const supabase = createClient();

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    console.log("🔔 Setting up real-time subscription...");

    // Subscribe to real-time changes on the registrations table
    const channel = supabase
      .channel("registrations-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          console.log("📬 New registration received:", payload);
          const newRegistration = payload.new as Registration;

          const notification: NotificationData = {
            id: `new-${newRegistration.id}-${Date.now()}`,
            type: "new",
            formToken: newRegistration.form_token,
            teamName: newRegistration.team_name,
            timestamp: new Date(),
            read: false,
          };

          setNotifications((prev) => [notification, ...prev]);

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification("New Registration Received", {
              body: `Team: ${newRegistration.team_name} (${newRegistration.form_token})`,
              icon: "/favicon.ico",
              tag: `registration-${newRegistration.form_token}`,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          console.log("📝 Registration updated:", payload);
          const updatedRegistration = payload.new as Registration;
          const oldRegistration = payload.old as Registration;

          // Check if this update was made by a user or admin session
          const adminUpdateMarker =
            typeof window !== "undefined"
              ? localStorage.getItem("admin_update_session")
              : null;
          const userUpdateMarker =
            typeof window !== "undefined"
              ? localStorage.getItem("user_update_session")
              : null;

          const isRecentAdminUpdate =
            adminUpdateMarker &&
            Date.now() - parseInt(adminUpdateMarker) < 5000; // 5 second window

          const isRecentUserUpdate =
            userUpdateMarker && Date.now() - parseInt(userUpdateMarker) < 5000; // 5 second window

          // Determine update source based on explicit markers only
          // User updates take precedence since they're more specific
          const isAdminUpdate = isRecentAdminUpdate && !isRecentUserUpdate;

          // Get admin identity if this was an admin update
          let adminUser: string | undefined;
          if (isAdminUpdate && typeof window !== "undefined") {
            const adminSession = localStorage.getItem("admin_update_info");
            if (adminSession) {
              try {
                const sessionData = JSON.parse(adminSession);
                adminUser = sessionData.adminUser;
              } catch (e) {
                console.warn("Failed to parse admin session data:", e);
              }
            }
          }

          // Determine update source and type
          const updateSource: "user" | "admin" = isAdminUpdate
            ? "admin"
            : "user";
          const notificationType: "updated" | "admin_updated" = isAdminUpdate
            ? "admin_updated"
            : "updated";

          // Don't show notification if current user made the change
          const currentUserIdentifier = getCurrentUserIdentifier();
          const shouldShowNotification = !(
            isAdminUpdate &&
            adminUser &&
            currentUserIdentifier &&
            adminUser === currentUserIdentifier
          );

          if (shouldShowNotification) {
            const notification: NotificationData = {
              id: `${isAdminUpdate ? "admin-" : ""}updated-${
                updatedRegistration.id
              }-${Date.now()}`,
              type: notificationType,
              formToken: updatedRegistration.form_token,
              teamName: updatedRegistration.team_name,
              timestamp: new Date(),
              read: false,
              updateSource,
              adminUser,
            };

            setNotifications((prev) => [notification, ...prev]);
          }

          // Show browser notification if permission granted and not self-made
          if (Notification.permission === "granted" && shouldShowNotification) {
            const title = isAdminUpdate
              ? "Admin Review Update"
              : "Registration Updated";
            const body = isAdminUpdate
              ? `${adminUser ? `Admin ${adminUser}` : "Admin"} reviewed: ${
                  updatedRegistration.team_name
                } (${updatedRegistration.form_token})`
              : `User updated: ${updatedRegistration.team_name} (${updatedRegistration.form_token})`;

            new Notification(title, {
              body,
              icon: "/favicon.ico",
              tag: `registration-${isAdminUpdate ? "admin-" : ""}update-${
                updatedRegistration.form_token
              }`,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("🔗 Realtime subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error subscribing to realtime channel");
        } else if (status === "TIMED_OUT") {
          console.error("⏰ Realtime subscription timed out");
        } else if (status === "CLOSED") {
          console.log("🔒 Realtime subscription closed");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🔌 Unsubscribing from real-time notifications");
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearRegistrationNotifications = () => {
    setNotifications((prev) =>
      prev.filter((notification) => {
        // Keep non-registration notifications (if we add other types later)
        // For now, we only have registration notifications, so clear all
        return false;
      })
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    clearRegistrationNotifications,
  };
}
