"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";

function StatCell({
    label,
    children,
    sub,
}: {
    label: string;
    children: React.ReactNode;
    sub?: React.ReactNode;
}) {
    return (
        <div className="px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
                {label}
            </p>
            <div className="mt-2 font-mono text-2xl font-medium leading-none tracking-tight">
                {children}
            </div>
            {sub && <p className="mt-1.5 text-[11px] text-muted-foreground">{sub}</p>}
        </div>
    );
}

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

    const bestPitchScore = stats?.bestPitch?.evaluation?.overallScore ?? 0;

    const averageScore = stats?.averageScore ?? 0;

    // Loading state
    if (!shouldFetch || !stats) {
        return (
            <div className="grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-4">
                        <div className="h-3 w-20 rounded bg-muted" />
                        <div className="mt-3 h-7 w-14 rounded bg-muted" />
                    </div>
                ))}
            </div>
        );
    }

    // Merge stats with defaults to avoid undefineds
    const mergedStats = { ...defaultStats, ...stats };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-4"
        >
            <StatCell label="Total pitches" sub={`${mergedStats.totalPitches} analyzed`}>
                {mergedStats.totalPitches}
            </StatCell>
            <StatCell label="Average score">
                <ScoreRing score={averageScore} size="md" />
            </StatCell>
            <StatCell
                label="Best pitch"
                sub={mergedStats.bestPitch ? `${bestPitchScore.toFixed(1)} / 10` : undefined}
            >
                <span className="block truncate font-display text-lg">
                    {mergedStats.bestPitch?.title ?? "None"}
                </span>
            </StatCell>
            <StatCell label="Recent" sub="last 7 days">
                {mergedStats.recentPitches.length}
            </StatCell>
        </motion.div>
    );
}

export default DashboardStats;
