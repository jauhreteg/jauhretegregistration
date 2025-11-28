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
      isActive: false,
    },
    // {
    //   title: "Teams",
    //   url: "/dashboard/teams",
    //   icon: Users,
    //   isActive: false,
    // },
    // {
    //   title: "Players",
    //   url: "/dashboard/players",
    //   icon: UserCheck,
    //   isActive: false,
    // },
    // {
    //   title: "Divisions",
    //   url: "/dashboard/divisions",
    //   icon: Trophy,
    //   isActive: false,
    // },
    // {
    //   title: "Reports",
    //   url: "/dashboard/reports",
    //   icon: BarChart3,
    //   isActive: false,
    // },
    // {
    //   title: "Export",
    //   url: "/dashboard/export",
    //   icon: Download,
    //   isActive: false,
    // },
    // {
    //   title: "Statistics",
    //   url: "/dashboard/statistics",
    //   icon: TrendingUp,
    //   isActive: false,
    // },
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
