"use client";

import * as React from "react";
import {
    ChevronLeft,
    Search as SearchIcon,
    X,
    Home,
    Clock,
    Plus,
    ArrowLeft,
    Star,
    Settings,
    Calendar,
    FileText,
    Clock8,
    Folder,
    PlusCircle,
    UserPlus
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useOrganization, useAuth, useUser } from "@clerk/nextjs";
import { useDebounceValue } from "usehooks-ts";
import { motion } from "framer-motion";
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
    useSidebar,
    SidebarTrigger,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { SearchForm } from "@/components/search-form";
import { Hint } from "@/components/hint";
import { InviteButton } from "@/components/invite-button";
import { useTheme } from "next-themes";
import LogoIcon from "@/components/ui/logo-icon";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Extracted pitch type for clarity
type Pitch = {
    _id: string;
    title: string;
    _creationTime: string | number | Date;
    evaluation: { overallScore: number };
    type: string;
    authorName?: string;
};

export function PitchDetailsSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { organization } = useOrganization();
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const { state } = useSidebar();

    // Queries
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

    const currentPitch = useQuery(
        api.pitches.getPitch,
        isAuthLoaded && isSignedIn && params.id
            ? {
                  id: params.id as Id<"pitches">,
              }
            : "skip"
    );

    // Memoize recent pitches
    const recentPitches = React.useMemo(() => {
        if (!pitches) return [];
        return pitches.filter((pitch: Pitch) => pitch._id !== params.id).slice(0, 5);
    }, [pitches, params.id]);

    // Redirect if not signed in
    React.useEffect(() => {
        if (isAuthLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isAuthLoaded, isSignedIn, router]);

    // Handlers
    const handleBack = React.useCallback(() => {
        const view = searchParams.get("view");
        const url = qs.stringifyUrl(
            {
                url: "/dashboard",
                query: { view: view || undefined },
            },
            { skipEmptyString: true, skipNull: true }
        );
        router.push(url);
    }, [router, searchParams]);

    const navigateToPitch = React.useCallback(
        (pitchId: string) => {
            const url = qs.stringifyUrl(
                {
                    url: `/pitch/${pitchId}`,
                    query: { view: searchParams.get("view") || undefined },
                },
                { skipEmptyString: true, skipNull: true }
            );
            router.push(url);
        },
        [router, searchParams]
    );

    // Loading state
    if (!isAuthLoaded || !organization) {
        return (
            <Sidebar collapsible="icon" className="border-r" {...props}>
                <SidebarHeader className="p-4 border-b">
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                </SidebarHeader>
                <div className="p-4 space-y-4">
                    <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
            </Sidebar>
        );
    }

    // Helper for pitch type badge
    const renderTypeBadge = (type: string) => {
        switch (type) {
            case "audio":
                return <Badge variant="outline">Audio</Badge>;
            case "textFile":
                return <Badge variant="outline">File</Badge>;
            default:
                return <Badge variant="outline">Text</Badge>;
        }
    };

    return (
        <Sidebar collapsible="icon" className="border-r" {...props}>
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
                    <div className="px-4 space-y-4">
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
                        {isAuthLoaded && organization && (
                            <>
                                <TeamSwitcher isDark={isDark} />
                                <SearchForm
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search pitches..."
                                    variant="sidebar"
                                />
                            </>
                        )}
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="h-full">
                    {state === "expanded" ? (
                        <div className="px-4 space-y-6">
                            <div className="space-y-2">
                                <Button
                                    onClick={handleBack}
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 -ml-3 px-3 text-muted-foreground flex items-center gap-2 hover:text-foreground hover:bg-transparent"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back to Dashboard</span>
                                </Button>
                                {currentPitch && (
                                    <div className="space-y-2">
                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                            <h2 className="font-semibold text-base line-clamp-2">
                                                {currentPitch.title}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {format(
                                                        new Date(currentPitch._creationTime),
                                                        "MMM d, yyyy"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className="bg-primary/10 hover:bg-primary/15 text-primary border-primary/20">
                                                    Score: {currentPitch.evaluation.overallScore.toFixed(1)}
                                                </Badge>
                                                {renderTypeBadge(currentPitch.type)}
                                            </div>
                                            <Separator className="my-3" />
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={user?.imageUrl} />
                                                    <AvatarFallback>
                                                        {currentPitch.authorName?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">{currentPitch.authorName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground pl-1">
                                    Recent Pitches
                                </h3>
                                {recentPitches.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentPitches.map((pitch: Pitch) => (
                                            <motion.div
                                                key={pitch._id}
                                                whileHover={{ x: 3 }}
                                                className="group"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigateToPitch(pitch._id)}
                                                    className="h-auto py-2 px-3 justify-start w-full text-left hover:bg-muted"
                                                >
                                                    <div className="flex flex-col items-start gap-1 min-w-0">
                                                        <div className="flex w-full justify-between items-center">
                                                            <span className="font-medium truncate text-sm">
                                                                {pitch.title}
                                                            </span>
                                                            <ChevronLeft className="h-3.5 w-3.5 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock8 className="h-3 w-3" />
                                                            <span>
                                                                {format(
                                                                    new Date(pitch._creationTime),
                                                                    "MMM d"
                                                                )}
                                                            </span>
                                                            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground mx-0.5"></span>
                                                            <span>
                                                                {pitch.evaluation.overallScore.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground px-3 py-2">
                                        No other pitches found
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 text-xs gap-1"
                                    onClick={handleBack}
                                >
                                    <Folder className="h-3 w-3" />
                                    View all pitches
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2 py-2">
                            <SidebarMenu className="space-y-1">
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleBack}
                                        className="rounded-lg transition-all duration-200 hover:shadow-sm"
                                        tooltip="Back to Dashboard"
                                    >
                                        <Home className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        className="rounded-lg transition-all duration-200 hover:shadow-sm"
                                        tooltip="Favorite Pitch"
                                    >
                                        <Star className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        className="rounded-lg transition-all duration-200 hover:shadow-sm"
                                        tooltip="All Pitches"
                                        onClick={handleBack}
                                    >
                                        <FileText className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    )}
                </ScrollArea>
            </SidebarContent>

            <div className="px-2 mb-2">
                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <SidebarFooter className="p-2 space-y-2">
                {organization && (
                    <>
                        {/* Action Buttons */}
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium shadow-sm transition-all duration-200"
                                    onClick={() => {
                                        router.push('/dashboard?create=pitch');
                                    }}
                                    tooltip={state === "collapsed" ? "New Pitch" : undefined}
                                >
                                    <PlusCircle />
                                    <span>New Pitch</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <InviteButton isDark={isDark} />
                            </SidebarMenuItem>
                        </SidebarMenu>
                        
                        {/* User Profile */}
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <NavUser isDark={isDark} />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}