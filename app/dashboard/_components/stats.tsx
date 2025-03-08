"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, ChevronUp, CalendarDays, BarChart3 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    className?: string;
    trend?: "up" | "down" | "neutral";
}

function ModernStatCard({
                            title,
                            value,
                            description,
                            icon: Icon,
                            className,
                            trend = "neutral"
                        }: StatCardProps) {
    // Define trend styling
    const trendColors = {
        up: "text-green-500",
        down: "text-red-500",
        neutral: "text-blue-500",
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn("bg-background shadow-sm hover:shadow-md transition-all duration-300", className)}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                {title}
                            </h3>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">{value}</div>
                                {description && (
                                    <div className="flex items-center text-xs">
                                        {trend === "up" ? (
                                            <ChevronUp className={cn("h-3 w-3 mr-1", trendColors[trend])} />
                                        ) : trend === "down" ? (
                                            <ChevronUp className={cn("h-3 w-3 mr-1 rotate-180", trendColors[trend])} />
                                        ) : null}
                                        <span className={cn("text-muted-foreground", trend !== "neutral" && trendColors[trend])}>
                                            {description}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-md">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function ModernDashboardStats() {
    const { userId, isLoaded, isSignedIn } = useAuth();
    const defaultStats = useMemo(() => ({
        totalPitches: 0,
        averageScore: 0,
        bestPitch: null,
        recentPitches: [],
    }), []);

    // Don't even attempt to query if we're not authenticated
    const shouldSkipQuery = !isLoaded || !isSignedIn || !userId;
    const stats = useQuery(api.pitches.getPitchStats, shouldSkipQuery ? "skip" : {});

    // Show loading state while loading or no user
    if (shouldSkipQuery || !stats) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-background animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Now we know we have stats
    const mergedStats = { ...defaultStats, ...stats };

    // Calculate growth for total pitches (this would normally come from backend)
    const pitchGrowth = stats.recentPitches.length > 0 ? "+14%" : "0%";

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ModernStatCard
                title="Total Pitches"
                value={mergedStats.totalPitches}
                description={pitchGrowth}
                trend="up"
                icon={BarChart3}
            />
            <ModernStatCard
                title="Average Score"
                value={mergedStats.averageScore?.toFixed(1) ?? "0.0"}
                description={`${mergedStats.totalPitches} pitches analyzed`}
                icon={LineChart}
                trend="neutral"
            />
            <ModernStatCard
                title="Best Pitch"
                value={mergedStats.bestPitch?.title ?? "None"}
                description={mergedStats.bestPitch?.evaluation.overallScore.toFixed(1) ?? "0.0"}
                icon={ChevronUp}
                trend="up"
            />
            <ModernStatCard
                title="Recent Pitches"
                value={mergedStats.recentPitches.length}
                description="Last 7 days"
                icon={CalendarDays}
                trend="neutral"
            />
        </div>
    );
}