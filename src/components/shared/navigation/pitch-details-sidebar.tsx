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
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { SearchForm } from "../forms/search-form";
import { Hint } from "../common/hint";
import { InviteButton } from "../common/invite-button";
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

    // Sync search state with URL parameters on load
    React.useEffect(() => {
        const searchQuery = searchParams.get("search") || "";
        if (searchQuery) {
            setSearch(searchQuery);
        }
    }, [searchParams]);

    // Update URL when search changes
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
        console.log('Search input changed to:', `"${value}"`);
        setSearch(value);
    }, []);

    // Queries
    const queryParams = isAuthLoaded && isSignedIn && organization
        ? {
              orgId: organization.id,
              search: debouncedSearch,
              sortBy: "date" as const,
          }
        : "skip";
    
    console.log('Sidebar query params:', queryParams);
    
    const pitches = useQuery(api.pitches.getFilteredPitches, queryParams);
    
    React.useEffect(() => {
        console.log('Pitches query result:', pitches?.length || 0, 'pitches');
        if (pitches && pitches.length > 0) {
            console.log('First few pitch titles:', pitches.slice(0, 3).map(p => p.title));
        }
    }, [pitches]);

    const currentPitch = useQuery(
        api.pitches.getPitch,
        isAuthLoaded && isSignedIn && params.id
            ? {
                  id: params.id as Id<"pitches">,
              }
            : "skip"
    );

    // Memoize search results or recent pitches
    const displayPitches = React.useMemo(() => {
        if (!pitches) {
            console.log('No pitches data available');
            return [];
        }
        
        console.log('Current pitch ID:', params.id);
        console.log('All pitch IDs:', pitches.map(p => ({ id: p._id, title: p.title })));
        
        // For search results, show all matches including current pitch
        // For recent pitches, filter out current pitch
        const filtered = debouncedSearch 
            ? pitches // Show all search results including current pitch
            : pitches.filter((pitch: Pitch) => pitch._id !== params.id);
        
        const limited = debouncedSearch ? filtered : filtered.slice(0, 5);
        
        console.log(`Search: "${debouncedSearch}", Total pitches: ${pitches.length}, Showing: ${limited.length}`);
        return limited;
    }, [pitches, params.id, debouncedSearch]);

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
                return <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 hover:bg-emerald-500/20 font-medium">Audio</Badge>;
            case "textFile":
                return <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 border-blue-500/25 hover:bg-blue-500/20 font-medium">File</Badge>;
            default:
                return <Badge variant="secondary" className="bg-purple-500/15 text-purple-700 border-purple-500/25 hover:bg-purple-500/20 font-medium">Text</Badge>;
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
                        <SidebarMenuButton
                            onClick={handleBack}
                            className="rounded-lg transition-all duration-200 hover:shadow-sm"
                            tooltip="Back to Dashboard"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </SidebarMenuButton>
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
                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleBack}
                                        variant="ghost"
                                        size="sm"
                                        className="h-10 -ml-2 px-4 text-muted-foreground flex items-center gap-3 hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200 group w-full justify-start"
                                    >
                                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                                        <span className="font-medium">Back to Dashboard</span>
                                    </Button>
                                </motion.div>
                                <div className="relative">
                                    <SearchForm
                                        value={search}
                                        onChange={handleSearchChange}
                                        placeholder="Search all pitches..."
                                        variant="sidebar"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="h-full">
                    {state === "expanded" ? (
                        <div className="px-4 space-y-6">
                            {currentPitch && (
                                <div className="space-y-4">
                                    <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-1">
                                        Current Pitch
                                    </div>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative"
                                    >
                                        <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3 p-5 rounded-2xl border border-primary/15 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
                                            <div className="relative">
                                                <h2 className="font-bold text-base line-clamp-2 mb-3 text-foreground/90">
                                                    {currentPitch.title}
                                                </h2>
                                                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>
                                                        {format(
                                                            new Date(currentPitch._creationTime),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Badge className="bg-primary/15 hover:bg-primary/20 text-primary border-primary/25 font-medium shadow-sm">
                                                        {currentPitch.evaluation.overallScore.toFixed(1)} Score
                                                    </Badge>
                                                    {renderTypeBadge(currentPitch.type)}
                                                </div>
                                                <Separator className="my-3 bg-primary/10" />
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7 border-2 border-primary/20">
                                                        <AvatarImage src={user?.imageUrl} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                                            {currentPitch.authorName?.charAt(0) || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {currentPitch.authorName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                                        {debouncedSearch ? "Search Results" : "Recent Pitches"}
                                    </div>
                                    {displayPitches.length > 0 && (
                                        <Badge variant="secondary" className="h-5 px-2 text-[10px] font-medium bg-muted/50">
                                            {displayPitches.length}
                                        </Badge>
                                    )}
                                </div>
                                {displayPitches.length > 0 ? (
                                    <div className="space-y-2">
                                        {displayPitches.map((pitch: Pitch) => (
                                            <motion.div
                                                key={pitch._id}
                                                whileHover={{ x: 4, scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="group"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigateToPitch(pitch._id)}
                                                    className="h-auto py-3 px-4 justify-start w-full text-left hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 rounded-xl transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
                                                >
                                                    <div className="flex flex-col items-start gap-2 min-w-0 w-full">
                                                        <div className="flex w-full justify-between items-start gap-2">
                                                            <span className="font-semibold truncate text-sm leading-tight text-foreground/90 group-hover:text-foreground">
                                                                {pitch.title}
                                                            </span>
                                                            <ChevronLeft className="h-4 w-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all duration-200 text-primary shrink-0 mt-0.5" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                                                            <div className="flex items-center gap-1">
                                                                <Clock8 className="h-3 w-3" />
                                                                <span>
                                                                    {format(
                                                                        new Date(pitch._creationTime),
                                                                        "MMM d"
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-amber-400/20 text-amber-500" />
                                                                <span className="font-medium">
                                                                    {pitch.evaluation.overallScore.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8 px-4"
                                    >
                                        <div className="text-muted-foreground/40 mb-2">
                                            <FileText className="h-8 w-8 mx-auto" />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {debouncedSearch ? `No pitches found for "${debouncedSearch}"` : "No other pitches found"}
                                        </div>
                                    </motion.div>
                                )}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs gap-2 h-9 rounded-xl border-muted-foreground/20 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-200"
                                        onClick={handleBack}
                                    >
                                        <Folder className="h-3.5 w-3.5" />
                                        View all pitches
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2 py-2">
                            <SidebarMenu className="space-y-1">
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
                        
                        {/* Team Switcher */}
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <TeamSwitcher isDark={isDark} />
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