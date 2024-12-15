"use client";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterState {
    categories: string[];
    scoreRange: {
        min: number;
        max: number;
    };
    sortBy: "date" | "score";
}

interface FilterPanelProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    className?: string;
}

export const FilterPanel = React.memo(({ filters, onChange, className }: FilterPanelProps) => {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter by</span>
                <Select
                    value="all"
                    onValueChange={(value) => {
                        // Handle filter change
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All boards" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All pitches</SelectItem>
                            <SelectItem value="high-score">High Score (8+)</SelectItem>
                            <SelectItem value="medium-score">Medium Score (5-8)</SelectItem>
                            <SelectItem value="low-score">Low Score (5)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Owned by</span>
                <Select
                    value="anyone"
                    onValueChange={(value) => {
                        // Handle ownership filter
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Owned by anyone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="anyone">Anyone</SelectItem>
                            <SelectItem value="me">Me</SelectItem>
                            <SelectItem value="team">Team members</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Select
                    value={filters.sortBy}
                    onValueChange={(value: "date" | "score") => {
                        onChange({
                            ...filters,
                            sortBy: value
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="date">Last opened</SelectItem>
                            <SelectItem value="score">Highest score</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
});

FilterPanel.displayName = "FilterPanel";