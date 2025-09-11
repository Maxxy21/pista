"use client";

import * as React from "react";
import { ArrowLeft, Star, FileText, Folder, PlusCircle } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useOrganization, useAuth, useUser } from "@clerk/nextjs";
import { useWorkspace } from "@/hooks/use-workspace";
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
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { type UniversalPitchData } from "@/lib/types/pitch";
// User menu and team switcher consolidated into top navbar
import { SearchForm } from "../forms/search-form";
import { InviteButton } from "../common/invite-button";
import { useTheme } from "next-themes";
import LogoIcon from "@/components/ui/logo-icon";
import { Badge } from "@/components/ui/badge";
// Avatar moved into CurrentPitchBanner component
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { CurrentPitchBanner } from "./pitch-current-banner";
import { PitchListItem } from "./pitch-list-item";
import { downloadCsvFromRows } from "@/lib/utils/pitch-export";

// Using shared pitch type from lib/types

export function PitchDetailsSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { organization } = useOrganization();
    const workspace = useWorkspace();
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const { state } = useSidebar();

    React.useEffect(() => {
        const searchQuery = searchParams.get("search") || "";
        if (searchQuery) {
            setSearch(searchQuery);
        }
    }, [searchParams]);

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
        router.replace(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleSearchChange = React.useCallback((value: string) => {
        setSearch(value);
    }, []);

    const queryParams = isAuthLoaded && isSignedIn
        ? (workspace.mode === 'org' && workspace.orgId
            ? { orgId: workspace.orgId, search: debouncedSearch, sortBy: "date" as const }
            : user?.id ? { ownerUserId: user.id, search: debouncedSearch, sortBy: "date" as const } : "skip")
        : "skip";
    const pitches = useQuery(api.pitches.getFilteredPitches, queryParams);
    

    const currentPitch = useQuery(
        api.pitches.getPitch,
        isAuthLoaded && isSignedIn && params.id
            ? {
                  id: params.id as Id<"pitches">,
              }
            : "skip"
    );

    const { mutate: updatePitch, pending: updating } = useApiMutation(api.pitches.update);
    const { mutate: createPitch, pending: duplicating } = useApiMutation(api.pitches.create);

    const onReevaluate = React.useCallback(async () => {
        try {
            if (!currentPitch) return;
            toast.loading("Re-evaluating…", { id: "reeval" });
            const res = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: currentPitch.text, questions: currentPitch.questions ?? [] }),
            });
            if (!res.ok) throw new Error("Evaluation failed");
            const evaluation = await res.json();
            await updatePitch({ id: currentPitch._id, evaluation, status: "evaluated" });
            toast.success("Pitch re-evaluated", { id: "reeval" });
        } catch (e: any) {
            toast.error(e?.message || "Failed to re-evaluate", { id: "reeval" });
        }
    }, [currentPitch, updatePitch]);

    const onDuplicate = React.useCallback(async () => {
        try {
            if (!currentPitch) return;
            toast.loading("Duplicating…", { id: "dup" });
            const newId = await createPitch({
                orgId: currentPitch.orgId || undefined,
                title: `${currentPitch.title} (Copy)`,
                text: currentPitch.text,
                type: currentPitch.type,
                status: currentPitch.status,
                evaluation: currentPitch.evaluation,
                questions: currentPitch.questions || [],
            });
            toast.success("Pitch duplicated", { id: "dup" });
            router.push(`/pitch/${newId}`);
        } catch (e: any) {
            toast.error(e?.message || "Failed to duplicate", { id: "dup" });
        }
    }, [currentPitch, createPitch, router]);

    const onExport = React.useCallback(() => {
        try {
            if (!currentPitch) return;
            const headers = [
                "id",
                "title",
                "type",
                "author",
                "createdAt",
                "overallScore",
                "evaluatedAt",
                "modelVersion",
                "promptVersion",
                "policyVersion",
            ];
            const ev: any = currentPitch.evaluation || {};
            const meta: any = ev.metadata || {};
            const row = [
                String(currentPitch._id),
                JSON.stringify(currentPitch.title ?? ""),
                JSON.stringify(currentPitch.type ?? ""),
                JSON.stringify(currentPitch.authorName ?? ""),
                new Date(currentPitch.createdAt).toISOString(),
                String(ev.overallScore ?? ""),
                meta.evaluatedAt ?? "",
                JSON.stringify(meta.modelVersion ?? ""),
                JSON.stringify(meta.promptVersion ?? ""),
                JSON.stringify(meta.policyVersion ?? ""),
            ];
            const csv = [headers.join(","), row.join(",")].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pitch-${String(currentPitch._id)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            toast.error("Failed to export");
        }
    }, [currentPitch]);

    const displayPitches = React.useMemo(() => {
        if (!pitches) {
            return [] as UniversalPitchData[];
        }
        
        const filtered = debouncedSearch 
            ? pitches // Show all search results including current pitch
            : (pitches as UniversalPitchData[]).filter((pitch) => pitch._id !== params.id);
        
        const limited = debouncedSearch ? filtered : filtered.slice(0, 5);
        return limited as unknown as UniversalPitchData[];
    }, [pitches, params.id, debouncedSearch]);

    React.useEffect(() => {
        if (isAuthLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isAuthLoaded, isSignedIn, router]);

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
    if (!isAuthLoaded) {
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
                              {organization.imageUrl ? (
                                <Image
                                  src={organization.imageUrl}
                                  alt={organization.name}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <span className="truncate" title={organization.name}>{organization.name}</span>
                          </div>
                        )}
                        {isAuthLoaded && (
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
                                    {(() => {
                                      const pitchOrg = currentPitch.orgId;
                                      const inOrg = workspace.mode === 'org' && !!workspace.orgId;
                                      const mismatch = (inOrg && !pitchOrg) || (!inOrg && !!pitchOrg);
                                      const note = mismatch
                                        ? `Viewing a ${pitchOrg ? 'team' : 'personal'} pitch in ${inOrg ? 'organization' : 'personal'} context.`
                                        : null;
                                      return (
                                        <CurrentPitchBanner
                                          title={currentPitch.title}
                                          creationTime={currentPitch._creationTime}
                                          score={currentPitch.evaluation.overallScore}
                                          typeBadge={renderTypeBadge(currentPitch.type)}
                                          authorName={currentPitch.authorName}
                                          userImageUrl={user?.imageUrl || null}
                                          contextNote={note}
                                        />
                                      );
                                    })()}
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
                                        {displayPitches.map((pitch: UniversalPitchData) => (
                                          <PitchListItem
                                            key={pitch._id}
                                            title={pitch.title}
                                            creationTime={pitch._creationTime}
                                            score={pitch.evaluation.overallScore}
                                            onClick={() => navigateToPitch(pitch._id)}
                                          />
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
                                        aria-label="Favorite Pitch"
                                    >
                                        <Star className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        className="rounded-lg transition-all duration-200 hover:shadow-sm"
                                        tooltip="All Pitches"
                                        onClick={handleBack}
                                        aria-label="All Pitches"
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
                        
                        {/* User Profile and Team Switcher moved to top avatar menu for consistency */}
                    </>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
