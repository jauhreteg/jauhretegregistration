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
import { NavSection } from "./nav-section";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@jauhreteg.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
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
    },
  ],
  coreManagement: [
    {
      name: "Teams",
      url: "/dashboard/teams",
      icon: Users,
    },
    {
      name: "Players",
      url: "/dashboard/players",
      icon: UserCheck,
    },
    {
      name: "Divisions",
      url: "/dashboard/divisions",
      icon: Trophy,
    },
  ],
  analytics: [
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: "Export",
      url: "/dashboard/export",
      icon: Download,
    },
    {
      name: "Statistics",
      url: "/dashboard/statistics",
      icon: TrendingUp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSection title="Core Management" items={data.coreManagement} />
        <NavSection title="Tournament Operations" items={data.tournamentOps} />
        <NavSection title="Administrative" items={data.adminFunctions} />
        <NavSection title="Analytics & Reporting" items={data.analytics} />
        <NavSection title="System Management" items={data.systemManagement} />
        <NavSection title="Support & Tools" items={data.supportTools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
