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
    Folder
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useOrganization, useAuth, useUser } from "@clerk/nextjs";
import { useDebounceValue } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
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

export function PitchDetailsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { organization } = useOrganization();
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
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

    const currentPitch = useQuery(
        api.pitches.getPitch,
        isAuthLoaded && isSignedIn && params.id
            ? {
                id: params.id as any,
            }
            : "skip"
    );

    // Move useMemo before any conditional returns
    // This ensures hook is always called in the same order
    const recentPitches = React.useMemo(() => {
        if (!pitches) return [];

        return pitches
            .filter(pitch => pitch._id !== params.id)
            .slice(0, 5);
    }, [pitches, params.id]);

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
                            <LogoIcon className="h-6 w-6 text-primary"/>
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
                                    <LogoIcon className="h-5 w-5 text-primary"/>
                                </motion.div>
                                <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                    Pitch Perfect
                                </h1>
                            </div>
                            <SidebarTrigger/>
                        </div>

                        <div className="relative">
                            <SearchForm
                                value={search}
                                onChange={(value) => setSearch(value)}
                                placeholder="Search pitches..."
                                variant="sidebar"
                            />
                        </div>
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
                                                <span>{format(new Date(currentPitch._creationTime), 'MMM d, yyyy')}</span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge
                                                    className="bg-primary/10 hover:bg-primary/15 text-primary border-primary/20"
                                                >
                                                    Score: {currentPitch.evaluation.overallScore.toFixed(1)}
                                                </Badge>

                                                {currentPitch.type === 'audio' ? (
                                                    <Badge variant="outline">Audio</Badge>
                                                ) : currentPitch.type === 'textFile' ? (
                                                    <Badge variant="outline">File</Badge>
                                                ) : (
                                                    <Badge variant="outline">Text</Badge>
                                                )}
                                            </div>

                                            <Separator className="my-3" />

                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={user?.imageUrl} />
                                                    <AvatarFallback>
                                                        {currentPitch.authorName?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">{currentPitch.authorName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground pl-1">Recent Pitches</h3>

                                {recentPitches.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentPitches.map(pitch => (
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
                                                            <span>{format(new Date(pitch._creationTime), 'MMM d')}</span>
                                                            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground mx-0.5"></span>
                                                            <span>{pitch.evaluation.overallScore.toFixed(1)}</span>
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
                        <SidebarMenu>
                            <TooltipProvider>
                                <SidebarMenuItem>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton
                                                onClick={handleBack}
                                                className="rounded-lg"
                                            >
                                                <Home className="h-4 w-4" />
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            Back to Dashboard
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton className="rounded-lg">
                                                <Star className="h-4 w-4" />
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            Favorite Pitch
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton className="rounded-lg">
                                                <FileText className="h-4 w-4" />
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            All Pitches
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>
                            </TooltipProvider>
                        </SidebarMenu>
                    )}
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter className="pb-4 pt-2">
                {state === "collapsed" && (
                    <div className="flex justify-center pb-2">
                        <SidebarTrigger />
                    </div>
                )}

                {organization && state === "expanded" && (
                    <div className="px-4 mb-2">
                        <Button
                            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            size="sm"
                        >
                            <Plus className="h-4 w-4" />
                            New Pitch
                        </Button>
                    </div>
                )}

                <NavUser isDark={isDark} />
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}