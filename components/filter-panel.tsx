"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleScoreRangeChange = (value: string) => {
        const ranges = {
            "all": { min: 0, max: 10 },
            "high-score": { min: 8, max: 10 },
            "medium-score": { min: 5, max: 7.9 },
            "low-score": { min: 0, max: 4.9 }
        };

        onChange({
            ...filters,
            scoreRange: ranges[value as keyof typeof ranges]
        });
    };

    return (
        <div className={cn("space-y-4 w-full", className)}>
            <div className="flex flex-wrap items-center gap-2 md:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full"
                >
                    <span>Filters</span>
                    <ChevronDown className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                    )} />
                </Button>
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:!h-auto md:!opacity-100"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Score range</span>
                            <Select
                                value={
                                    filters.scoreRange.min === 8 ? "high-score" :
                                    filters.scoreRange.min === 5 ? "medium-score" :
                                    filters.scoreRange.min === 0 && filters.scoreRange.max === 4.9 ? "low-score" : "all"
                                }
                                onValueChange={handleScoreRangeChange}
                            >
                                <SelectTrigger className="w-full md:w-[140px] lg:w-[180px]">
                                    <SelectValue placeholder="All scores" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All scores</SelectItem>
                                        <SelectItem value="high-score">High Score (8+)</SelectItem>
                                        <SelectItem value="medium-score">Medium Score (5-8)</SelectItem>
                                        <SelectItem value="low-score">Low Score (≤5)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by</span>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value: "date" | "score") => {
                                    onChange({
                                        ...filters,
                                        sortBy: value
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full md:w-[140px] lg:w-[180px]">
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
                </motion.div>
            </AnimatePresence>
        </div>
    );
});

FilterPanel.displayName = "FilterPanel";

