"use client";

import * as React from "react";
import {
    Home,
    Clock,
    Star, ChevronRight
} from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { InviteButton } from "@/components/invite-button";
import LogoIcon from "@/components/ui/logo-icon";
import {Button} from "@/components/ui/button";
import {CollapseTrigger} from "@/components/collapse-trigger";
import {ExpandTrigger} from "@/components/expand-trigger";

const navigationItems = [
    {
        title: "Home",
        icon: Home,
        value: "home"
    },
    {
        title: "Recent",
        icon: Clock,
        value: "recent"
    },
    {
        title: "Favourites",
        icon: Star,
        value: "favorites"
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { organization, isLoaded } = useOrganization();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const { state } = useSidebar()

    React.useEffect(() => {
        const url = qs.stringifyUrl({
            url: window.location.pathname,
            query: {
                ...Object.fromEntries(searchParams.entries()),
                search: debouncedSearch,
            },
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedSearch, router, searchParams]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {state === "collapsed" ? (
                    <div className="py-2">
                        <LogoIcon />
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <LogoIcon/>
                            <h1 className="text-lg font-semibold">Pitch Perfect</h1>
                        </div>
                        <CollapseTrigger/>
                    </div>
                )}
                {isLoaded && organization && (
                    <TeamSwitcher isDark={isDark}/>
                )}
                <SearchForm
                    value={search}
                    onChange={handleSearchChange}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navigationItems}/>
            </SidebarContent>
            <SidebarFooter>
                {state === "collapsed" && (
                    <ExpandTrigger/>

                )}
                {organization && (
                    <InviteButton isDark={isDark} />
                )}
                <NavUser isDark={isDark} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}