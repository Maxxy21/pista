"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

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
import { InviteButton } from "../common/invite-button";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";
import { TeamSwitcher } from "./team-switcher";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { organization, isLoaded } = useOrganization();
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
                        <LogoIcon size="md" />
                    </div>
                ) : (
                    <div className="px-4">
                        <div className="flex items-center gap-2.5">
                            <LogoIcon size="md" />
                            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
                                Pista
                            </h1>
                        </div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="px-2 flex flex-col">
                <div className="flex-1 py-2">
                    <SidebarGroupLabel className="px-4 pt-2 pb-1 text-xs font-medium text-muted-foreground/70">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarNav currentView={currentView} collapsed={state === "collapsed"} onNavigate={handleNavigation} />
                </div>
            </SidebarContent>

            <div className="px-2 mb-2">
                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <SidebarFooter className="p-2 space-y-2">
                <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="font-medium transition-opacity duration-150 hover:opacity-85 bg-gold text-gold-foreground hover:bg-gold hover:text-gold-foreground"
                            tooltip={state === "collapsed" ? "New Pitch" : undefined}
                        >
                            <Link href="/dashboard?view=new">
                                <PlusCircle />
                                <span>New Pitch</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <InviteButton />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
