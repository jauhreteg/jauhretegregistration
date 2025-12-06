"use client";

import * as React from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  UserCheck,
  Trophy,
  Calendar,
  Target,
  MapPin,
  CreditCard,
  Mail,
  FolderOpen,
  BarChart3,
  Download,
  TrendingUp,
  Settings,
  ShieldCheck,
  FileBarChart,
  HelpCircle,
  Database,
  Puzzle,
} from "lucide-react";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import ScrambledText from "@/components/ui/scrambled-text";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
    isActive: true,
  },
  {
    title: "Registrations",
    url: "/dashboard/registrations",
    icon: FileText,
    isActive: false,
  },
];

// Import useUser hook
import { useUser } from "../layout";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser();

  // Format user data for NavUser component
  const userData = React.useMemo(() => {
    if (!user) {
      return {
        name: "Loading...",
        email: "loading@example.com",
        avatar: "",
      };
    }

    // Extract name from metadata with better fallbacks
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.display_name ||
      user.user_metadata?.name ||
      // Capitalize first letter of email prefix as last resort
      user.email?.split("@")[0]?.charAt(0).toUpperCase() +
        user.email?.split("@")[0]?.slice(1) ||
      "Admin User";

    return {
      name,
      email: user.email || "",
      avatar: user.user_metadata?.avatar_url || "",
    };
  }, [user]);

  // Create copyright text to avoid template literal issues
  const copyrightText = `© 2017-${new Date().getFullYear()}`;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div> */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/jet-black.svg"
                    alt="Jauhr E Teg Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Jauhr E Teg</span>
                  <span className="truncate text-xs">
                    Registration Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User Section */}
        <NavUser user={userData} />

        {/* Settings */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Divider */}
        <div className="mx-2 my-2 border-t border-sidebar-border" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-center">
          <div className="text-[10px] text-muted-foreground">
            <ScrambledText
              radius={30}
              speed={0.8}
              scrambleChars="!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
              style={{ fontSize: "10px" }}
            >
              {copyrightText}
            </ScrambledText>
          </div>
          <div className="text-[10px] text-muted-foreground">
            <ScrambledText
              radius={30}
              speed={0.8}
              scrambleChars="!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
              style={{ fontSize: "10px" }}
            >
              Jauhr E Teg
            </ScrambledText>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
