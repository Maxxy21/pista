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
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";
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
    SidebarGroupLabel,
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { SearchForm } from "@/components/search-form";
import { InviteButton } from "@/components/invite-button";
import LogoIcon from "@/components/ui/logo-icon";
import { CollapseTrigger } from "@/components/collapse-trigger";
import { ExpandTrigger } from "@/components/expand-trigger";
import { Badge } from "@/components/ui/badge";

const NAVIGATION_ITEMS = [
    {
        title: "Home",
        icon: Home,
        value: "home",
    },
    {
        title: "Recent",
        icon: Clock,
        value: "recent",
    },
    {
        title: "Favorites",
        icon: Star,
        value: "favorites",
        badge: (
            <Badge
                variant="outline"
                className="ml-auto text-xs bg-primary/5 border-primary/20"
            >
                New
            </Badge>
        ),
    },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { organization, isLoaded } = useOrganization();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const { state } = useSidebar();

    React.useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: window.location.pathname,
                query: {
                    ...Object.fromEntries(searchParams.entries()),
                    search: debouncedSearch,
                },
            },
            { skipEmptyString: true, skipNull: true }
        );
        router.push(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleSearchChange = React.useCallback((value: string) => {
        setSearch(value);
    }, []);

    const handleNavigation = React.useCallback(
        (value: string) => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            if (value === "home") {
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
        <Sidebar collapsible="icon" className="border-r" {...props}>
            <SidebarHeader className="py-4">
                {state === "collapsed" ? (
                    <div className="flex justify-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center bg-primary/10 p-2 rounded-lg"
                        >
                            <LogoIcon className="h-6 w-6 text-primary" />
                        </motion.div>
                    </div>
                ) : (
                    <div className="px-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-primary/10 p-2 rounded-lg"
                                >
                                    <LogoIcon className="h-5 w-5 text-primary" />
                                </motion.div>
                                <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                    Pista
                                </h1>
                            </div>
                            <CollapseTrigger />
                        </div>
                        {isLoaded && organization && (
                            <>
                                <TeamSwitcher isDark={isDark} />
                                <SearchForm
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search pitches..."
                                    variant="sidebar"
                                />
                            </>
                        )}
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="px-2">
                {organization && (
                    <>
                        <SidebarGroupLabel className="px-4 pt-2">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {NAVIGATION_ITEMS.map((item) => {
                                const isActive =
                                    (item.value === "home" && !currentView) ||
                                    currentView === item.value;

                                return (
                                    <SidebarMenuItem key={item.value}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            onClick={() => handleNavigation(item.value)}
                                            className={isActive ? "bg-primary/10 text-primary font-medium" : ""}
                                            tooltip={state === "collapsed" ? item.title : undefined}
                                        >
                                            <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                                            <span>{item.title}</span>
                                            {item.badge}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="pb-4 pt-2">
                {state === "collapsed" && (
                    <div className="flex justify-center mb-4">
                        <ExpandTrigger />
                    </div>
                )}

                {organization && state === "expanded" && (
                    <div className="px-4 mb-2">
                        <Button
                            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            size="sm"
                        >
                            <PlusCircle className="h-4 w-4" />
                            New Pitch
                        </Button>
                    </div>
                )}

                {organization && <InviteButton isDark={isDark} />}

                <NavUser isDark={isDark} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
