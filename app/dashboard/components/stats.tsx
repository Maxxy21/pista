"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, ChevronUp, CalendarDays, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    className?: string;
    trend?: "up" | "down" | "neutral";
}

const StatCard = memo<StatCardProps>(
    ({ title, value, description, icon: Icon, className, trend = "neutral" }) => {
        const trendColor =
            trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : "text-gray-500";

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className={cn("overflow-hidden", className)}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {title}
                                </p>
                                <h3 className="text-2xl font-bold">{value}</h3>
                                {description && (
                                    <p className={cn("text-xs mt-1", trendColor)}>
                                        {description}
                                    </p>
                                )}
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }
);

StatCard.displayName = "StatCard";

export function DashboardStats() {
    const { userId, isLoaded, isSignedIn } = useAuth();

    // Default stats for fallback/merging
    const defaultStats = useMemo(
        () => ({
            totalPitches: 0,
            averageScore: 0,
            bestPitch: null as null | {
                title: string;
                evaluation: { overallScore: number };
            },
            recentPitches: [] as Array<unknown>,
        }),
        []
    );

    // Only fetch stats if user is loaded and signed in
    const shouldFetch = isLoaded && isSignedIn && !!userId;
    const stats = useQuery(
        api.pitches.getPitchStats,
        shouldFetch ? {} : "skip"
    );

    // Memoized derived values
    const pitchGrowth = useMemo(() => {
        return stats?.recentPitches?.length
            ? "+14%"
            : "0%";
    }, [stats?.recentPitches]);

    const bestPitchScore = useMemo(() => {
        return stats?.bestPitch?.evaluation?.overallScore?.toFixed(1) ?? "0.0";
    }, [stats?.bestPitch]);

    const averageScoreFormatted = useMemo(() => {
        return stats?.averageScore?.toFixed(1) ?? "0.0";
    }, [stats?.averageScore]);

    // Loading state
    if (!shouldFetch || !stats) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} variant="stat" />
                ))}
            </div>
        );
    }

    // Merge stats with defaults to avoid undefineds
    const mergedStats = { ...defaultStats, ...stats };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Pitches"
                value={mergedStats.totalPitches}
                description={pitchGrowth}
                trend="up"
                icon={BarChart3}
            />
            <StatCard
                title="Average Score"
                value={averageScoreFormatted}
                description={`${mergedStats.totalPitches} pitches analyzed`}
                icon={LineChart}
                trend="neutral"
            />
            <StatCard
                title="Best Pitch"
                value={mergedStats.bestPitch?.title ?? "None"}
                description={bestPitchScore}
                icon={ChevronUp}
                trend="up"
            />
            <StatCard
                title="Recent Pitches"
                value={mergedStats.recentPitches.length}
                description="Last 7 days"
                icon={CalendarDays}
                trend="neutral"
            />
        </div>
    );
}

export default DashboardStats;