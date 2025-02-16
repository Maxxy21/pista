"use client";

import {useQuery} from "convex/react";
import {useAuth} from "@clerk/nextjs";
import {api} from "@/convex/_generated/api";
import {Card, CardContent} from "@/components/ui/card";
import {LineChart, ChevronUp, CalendarDays} from 'lucide-react';
import {cn} from "@/lib/utils";
import {useMemo} from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    className?: string;
}

function StatCard({
                      title,
                      value,
                      description,
                      icon: Icon,
                      className
                  }: StatCardProps) {
    return (
        <Card className={cn("bg-background", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        {title}
                    </h3>
                    <Icon className="h-4 w-4 text-muted-foreground"/>
                </div>
                <div className="space-y-1">
                    <div className="text-2xl font-bold">{value}</div>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}



export function DashboardStats() {
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-background animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20"/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Now we know we have stats
    const mergedStats = { ...defaultStats, ...stats };
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Pitches"
                value={mergedStats.totalPitches}
                icon={LineChart}
            />
            <StatCard
                title="Average Score"
                value={mergedStats.averageScore?.toFixed(1) ?? "0.0"}
                description={`${mergedStats.totalPitches} pitches`}
                icon={ChevronUp}
            />
            <StatCard
                title="Best Pitch"
                value={mergedStats.bestPitch?.title ?? "None"}
                description={mergedStats.bestPitch?.evaluation.overallScore.toFixed(1) ?? "0.0"}
                icon={ChevronUp}
            />
            <StatCard
                title="Recent Pitches"
                value={mergedStats.recentPitches.length}
                description="Last 7 days"
                icon={CalendarDays}
            />
        </div>
    );
}