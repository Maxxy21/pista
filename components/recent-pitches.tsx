"use client";

import React from "react";
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface PitchGroup {
    title: string;
    pitches: Array<{
        _id: string;
        title: string;
        _creationTime: number;
    }>;
}

interface RecentPitchesProps {
    pitches: any[];
    currentPitchId?: string;
    onPitchClick: (pitchId: string) => void;
    searchQuery?: string;
}

const groupPitchesByTime = (pitches: any[]) => {
    const groups: PitchGroup[] = [
        { title: "Today", pitches: [] },
        { title: "This Week", pitches: [] },
        { title: "This Month", pitches: [] },
        { title: "This Year", pitches: [] },
        { title: "Older", pitches: [] },
    ];

    pitches.forEach(pitch => {
        const date = new Date(pitch._creationTime);
        if (isToday(date)) {
            groups[0].pitches.push(pitch);
        } else if (isThisWeek(date)) {
            groups[1].pitches.push(pitch);
        } else if (isThisMonth(date)) {
            groups[2].pitches.push(pitch);
        } else if (isThisYear(date)) {
            groups[3].pitches.push(pitch);
        } else {
            groups[4].pitches.push(pitch);
        }
    });

    return groups.filter(group => group.pitches.length > 0);
};


export function RecentPitches({
                                  pitches,
                                  currentPitchId,
                                  onPitchClick,
                                  searchQuery = ""
                              }: RecentPitchesProps) {
    // Filter pitches based on search query
    const filteredPitches = React.useMemo(() => {
        if (!searchQuery) return pitches;

        return pitches.filter(pitch =>
            pitch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pitch.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pitches, searchQuery]);

    const groups = React.useMemo(() => {
        if (searchQuery) {
            // If searching, show all results in a single group
            return [{
                title: "Search Results",
                pitches: filteredPitches
            }];
        }

        return groupPitchesByTime(filteredPitches);
    }, [filteredPitches, searchQuery]);

    if (filteredPitches.length === 0) {
        return (
            <div className="p-4 text-sm text-muted-foreground">
                {searchQuery ? "No matches found" : "No pitches found"}
            </div>
        );
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                {searchQuery ? `Search Results (${filteredPitches.length})` : "Recent"}
            </SidebarGroupLabel>
            <SidebarMenu>
                {groups.map((group) => (
                    <Collapsible
                        key={group.title}
                        asChild
                        defaultOpen={searchQuery ? true : group.pitches.some(pitch => pitch._id === currentPitchId)}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <span>{group.title}</span>
                                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {group.pitches.map((pitch) => (
                                        <SidebarMenuSubItem key={pitch._id}>
                                            <SidebarMenuSubButton
                                                onClick={() => onPitchClick(pitch._id)}
                                                className={pitch._id === currentPitchId ? "bg-accent" : ""}
                                            >
                                                <span>{pitch.title}</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}