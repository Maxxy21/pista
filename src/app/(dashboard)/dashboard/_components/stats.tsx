"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, ChevronUp, CalendarDays, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, memo } from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { motion } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ScoreBadge } from "./cards/score-badge";

interface StatCardProps {
    title: string;
    value: string | number;
    valueNode?: React.ReactNode;
    description?: React.ReactNode;
    icon: React.ElementType;
    className?: string;
    trend?: "up" | "down" | "neutral";
}

const StatCard = memo<StatCardProps>(
    ({ title, value, valueNode, description, icon: Icon, className, trend = "neutral" }) => {
        const trendColor =
            trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : "text-gray-500";

        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <Card className={cn("overflow-hidden", className)}>
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-foreground" />
                            </div>
                            {description && (
                                <div className={cn("text-xs font-medium mt-0.5 shrink-0", trendColor)}>
                                    {description}
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                {title}
                            </p>
                            <div className="text-2xl font-bold truncate">
                                {valueNode ?? value}
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
    const workspace = useWorkspace();

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
        shouldFetch
            ? (workspace.mode === 'org' && workspace.orgId
                ? { orgId: workspace.orgId }
                : userId ? { ownerUserId: userId } : {})
            : "skip"
    );

    // Memoized derived values
    const pitchGrowth = useMemo(() => {
        return stats?.recentPitches?.length
            ? "+14%"
            : "0%";
    }, [stats?.recentPitches]);

    const bestPitchScore = stats?.bestPitch?.evaluation?.overallScore ?? 0;

    const averageScore = stats?.averageScore ?? 0;

    // Loading state
    if (!shouldFetch || !stats) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} variant="stat" />
                ))}
            </div>
        );
    }

    // Merge stats with defaults to avoid undefineds
    const mergedStats = { ...defaultStats, ...stats };

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Pitches"
                value={mergedStats.totalPitches}
                description={pitchGrowth}
                trend="up"
                icon={BarChart3}
            />
            <StatCard
                title="Average Score"
                value={averageScore.toFixed(1)}
                valueNode={<ScoreBadge score={averageScore} />}
                description={`${mergedStats.totalPitches} pitches analyzed`}
                icon={LineChart}
                trend="neutral"
            />
            <StatCard
                title="Best Pitch"
                value={mergedStats.bestPitch?.title ?? "None"}
                description={<ScoreBadge score={bestPitchScore} />}
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
