"use client";

import * as React from "react";
import {
    Home,
    Clock,
    Star,
    PlusCircle,
} from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarGroupLabel,
    useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// Team switcher moved into user avatar menu for consistency
import { InviteButton } from "../common/invite-button";
import { FileDialog } from "@/components/shared/forms/add-pitches/file-dialog";
import LogoIcon from "@/components/ui/logo-icon";

const NAVIGATION_ITEMS = [
    {
        title: "All Pitches",
        url: "/dashboard",
        icon: Home,
        value: "all",
    },
    {
        title: "Recent",
        url: "/dashboard?view=recent",
        icon: Clock,
        value: "recent",
    },
    {
        title: "Favorites",
        url: "/dashboard?view=favorites", 
        icon: Star,
        value: "favorites",
        badge: "New",
    },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { organization, isLoaded } = useOrganization();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const router = useRouter();
    const searchParams = useSearchParams();
    const { state } = useSidebar();

    const handleNavigation = React.useCallback(
        (value: string) => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            if (value === "all") {
                current.delete("view");
            } else {
                current.set("view", value);
            }

            const searchString = current.toString();
            const query = searchString ? `?${searchString}` : "";

            router.replace(`/dashboard${query}`);
        },
        [router, searchParams]
    );

    const currentView = searchParams.get("view");

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="py-4">
                {state === "collapsed" ? (
                    <div className="flex flex-col items-center space-y-3">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center bg-primary/10 p-2 rounded-lg"
                        >
                            <LogoIcon className="h-6 w-6 text-primary" />
                        </motion.div>
                    </div>
                ) : (
                    <div className="px-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 rounded-xl shadow-sm"
                            >
                                <LogoIcon className="h-6 w-6 text-primary" />
                            </motion.div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Pista
                            </h1>
                        </div>
                        {organization && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground/90 px-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-muted overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {organization.imageUrl ? (
                                <img src={organization.imageUrl} alt={organization.name} className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            <span className="truncate" title={organization.name}>{organization.name}</span>
                          </div>
                        )}
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="px-2 flex flex-col">
                <div className="flex-1 py-2">
                    <SidebarGroupLabel className="px-4 pt-2 pb-1 text-xs font-medium text-muted-foreground/70">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarMenu className="mb-6 space-y-1">
                        {NAVIGATION_ITEMS.map((item) => {
                            const isActive =
                                (item.value === "all" && !currentView) ||
                                currentView === item.value;

                            return (
                                <SidebarMenuItem key={item.value}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        tooltip={state === "collapsed" ? item.title : undefined}
                                        onClick={() => handleNavigation(item.value)}
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
                </div>
            </SidebarContent>

            <div className="px-2 mb-2">
                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <SidebarFooter className="p-2 space-y-2">
                {/* Action Buttons */}
                <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                        {organization ? (
                            <FileDialog orgId={organization.id}>
                                <SidebarMenuButton 
                                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium shadow-sm transition-all duration-200"
                                    tooltip={state === "collapsed" ? "New Pitch" : undefined}
                                >
                                    <PlusCircle />
                                    <span>New Pitch</span>
                                </SidebarMenuButton>
                            </FileDialog>
                        ) : (
                            <InviteButton isDark={isDark} />
                        )}
                    </SidebarMenuItem>
                    {organization && (
                        <SidebarMenuItem>
                            <InviteButton isDark={isDark} />
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
