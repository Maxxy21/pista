"use client";

import * as React from "react";
import {
    Home,
    Clock,
    Star
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
    SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { InviteButton } from "@/components/invite-button";

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
    const { organization } = useOrganization();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);

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
                <TeamSwitcher isDark={isDark} />
                <SearchForm
                    value={search}
                    onChange={handleSearchChange}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>
            <SidebarFooter>
                {organization && (
                    <InviteButton isDark={isDark} />
                )}
                <NavUser isDark={isDark} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}