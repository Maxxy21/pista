"use client";

import React from "react";
import { Home, Clock, Star } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

export const NAVIGATION_ITEMS = [
  { title: "All Pitches", url: "/dashboard", icon: Home, value: "all" },
  { title: "Recent", url: "/dashboard?view=recent", icon: Clock, value: "recent" },
  { title: "Favorites", url: "/dashboard?view=favorites", icon: Star, value: "favorites", badge: "New" },
] as const;

interface SidebarNavProps {
  currentView: string | null;
  collapsed: boolean;
  onNavigate: (value: string) => void;
}

export function SidebarNav({ currentView, collapsed, onNavigate }: SidebarNavProps) {
  return (
    <SidebarMenu className="mb-6 space-y-1">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = (item.value === "all" && !currentView) || currentView === item.value;
        return (
          <SidebarMenuItem key={item.value}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={collapsed ? item.title : undefined}
              onClick={() => onNavigate(item.value)}
              className="rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.title}</span>
            </SidebarMenuButton>
            {item.badge && (
              <SidebarMenuBadge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                {item.badge}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

