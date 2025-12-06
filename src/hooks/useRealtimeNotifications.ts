"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Registration } from "@/types/database";

export interface NotificationData {
  id: string;
  type: "new" | "updated";
  formToken: string;
  teamName: string;
  timestamp: Date;
  read: boolean;
}

interface UseRealtimeNotificationsReturn {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  clearRegistrationNotifications: () => void;
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

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

          const notification: NotificationData = {
            id: `updated-${updatedRegistration.id}-${Date.now()}`,
            type: "updated",
            formToken: updatedRegistration.form_token,
            teamName: updatedRegistration.team_name,
            timestamp: new Date(),
            read: false,
          };

          setNotifications((prev) => [notification, ...prev]);

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification("Registration Updated", {
              body: `Team: ${updatedRegistration.team_name} (${updatedRegistration.form_token})`,
              icon: "/favicon.ico",
              tag: `registration-update-${updatedRegistration.form_token}`,
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
  }, []);

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
