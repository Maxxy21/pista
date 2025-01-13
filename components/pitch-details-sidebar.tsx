"use client";

import * as React from "react";
import {ChevronLeft, Search, X, Home, Clock} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useOrganization, useAuth, useUser } from "@clerk/nextjs";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInput,
    useSidebar, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { SearchForm } from "@/components/search-form";
import { Hint } from "@/components/hint";
import {InviteButton} from "@/components/invite-button";
import {useTheme} from "next-themes";
import {RecentPitches} from "@/components/recent-pitches";
import LogoIcon from "@/components/ui/logo-icon";

export function PitchDetailsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { organization } = useOrganization();
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const { state } = useSidebar();


    const pitches = useQuery(
        api.pitches.getFilteredPitches,
        isAuthLoaded && isSignedIn && organization
            ? {
                orgId: organization.id,
                search: debouncedSearch,
                sortBy: "date",
            }
            : "skip"
    );



    React.useEffect(() => {
        if (isAuthLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isAuthLoaded, isSignedIn, router]);

    const handleBack = () => {
        const view = searchParams.get("view");
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                view: view || undefined
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };

    const navigateToPitch = (pitchId: string) => {
        const url = qs.stringifyUrl({
            url: `/pitch/${pitchId}`,
            query: {
                view: searchParams.get("view") || undefined
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };

    if (!isAuthLoaded || !organization) {
        return (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader className="border-b p-4">
                    <div className="animate-pulse h-8 bg-gray-200 rounded" />
                </SidebarHeader>
                <div className="p-4 space-y-4">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2" />
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
                </div>
            </Sidebar>
        );
    }

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
                        <SidebarTrigger/>
                    </div>
                )}
                <SearchForm
                    value={search}
                    onChange={setSearch}
                />
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full">
                    {state === "expanded" ? (
                        <div>
                            <Button
                                onClick={handleBack}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span>Home</span>
                            </Button>
                            <RecentPitches
                                pitches={pitches || []}
                                currentPitchId={params.id as string}
                                onPitchClick={navigateToPitch}
                                searchQuery={search}
                            />
                        </div>

                    ) : (
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Hint label="Home" side="right" sideOffset={12}>
                                    <SidebarMenuButton className="ml-2">
                                        <Home className="h-4 w-4 " />
                                    </SidebarMenuButton>
                                </Hint>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Hint label="All Pitches" side="right" sideOffset={12}>
                                    <SidebarMenuButton className="ml-2">
                                        <Clock className="h-4 w-4 " />
                                    </SidebarMenuButton>
                                </Hint>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )}
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                {state === "collapsed" && (
                    <SidebarTrigger/>

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