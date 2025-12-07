"use client";

import { useState } from "react";
import { Bell, X, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useRealtimeNotifications,
  type NotificationData,
} from "@/hooks/useRealtimeNotifications";
import { useUser } from "@/app/dashboard/layout";

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: "new" | "updated" | "admin_updated") => {
    switch (type) {
      case "new":
        return "bg-green-100 text-green-800 border-green-200";
      case "admin_updated":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "updated":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTypeIcon = (type: "new" | "updated" | "admin_updated") => {
    return ""; // No emoji
  };

  return (
    <div
      className={`p-3 hover:bg-gray-50 transition-colors ${
        !notification.read ? "bg-blue-50/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={`text-xs ${getTypeColor(notification.type)}`}
            >
              {notification.type === "new"
                ? "New Registration"
                : notification.type === "admin_updated"
                ? `Admin Updated${
                    notification.adminUser
                      ? ` by ${notification.adminUser}`
                      : ""
                  }`
                : "Updated"}
            </Badge>
          </div>
          <div className="font-medium text-sm truncate">
            {notification.teamName}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {notification.formToken}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatTime(notification.timestamp)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!notification.read && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-6 w-6 p-0"
              title="Mark as read"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationDropdown() {
  const { user } = useUser();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useRealtimeNotifications(user);

  const [isOpen, setIsOpen] = useState(false);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Notifications</div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefreshPage}
                className="h-6 text-xs"
                title="Refresh page"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="h-6 text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="relative">
          <div className="max-h-[240px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No notifications yet</div>
                <div className="text-xs">
                  New registrations will appear here
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Scroll indicator */}
          {notifications.length >= 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearNotifications}
                className="w-full text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
