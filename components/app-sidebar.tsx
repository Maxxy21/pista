"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Home,
    Clock,
    Star
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { SearchForm } from "@/components/search-form"
import { useOrganization } from "@clerk/nextjs"
import { InviteButton } from "@/components/invite-button"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

// This is sample data.
const data = {
    navMain: [
        {
            title: "Home",
            url: "/dashboard",
            icon: Home,
            isActive: true,
        },
        {
            title: "Recent",
            url: "#",
            icon: Clock,
        },
        {
            title: "Favourites",
            url: "#",
            icon: Star,
        },
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { organization } = useOrganization();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher isDark={isDark} />
                <SearchForm />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                {organization && (
                    <InviteButton isDark={isDark} />
                )}
                <NavUser isDark={isDark} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}