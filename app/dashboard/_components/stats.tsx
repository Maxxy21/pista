"use client"
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {cn} from "@/lib/utils";
import {LucideIcon, LineChart, ChevronUp, CalendarDays} from 'lucide-react'

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
        <div className={cn(
            "rounded-xl bg-card p-6 shadow-sm dark:bg-neutral-950/50 dark:shadow-[0_0_1px_1px_rgba(255,255,255,0.1)]",
            className
        )}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <Icon className="h-4 w-4 text-muted-foreground"/>
            </div>
            <div className="mt-3 space-y-1">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}

