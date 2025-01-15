"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { LucideIcon, LineChart, ChevronUp, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardStats() {
    const stats = useQuery(api.pitches.getPitchStats);

    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Pitches"
                value={stats.totalPitches}
                icon={LineChart}
            />
            <StatCard
                title="Average Score"
                value={stats.averageScore?.toFixed(1) ?? "0.0"}
                description={`${stats.totalPitches} pitches`}
                icon={ChevronUp}
            />
            <StatCard
                title="Best Pitch"
                value={stats.bestPitch?.title ?? "None"}
                description={stats.bestPitch?.evaluation.overallScore.toFixed(1) ?? "0.0"}
                icon={ChevronUp}
            />
            <StatCard
                title="Recent Pitches"
                value={stats.recentPitches.length}
                description="Last 7 days"
                icon={CalendarDays}
            />
        </div>
    );
}

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    className?: string
}

function StatCard({
                      title,
                      value,
                      description,
                      icon: Icon,
                      className
                  }: StatCardProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <Icon className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
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
    )
}