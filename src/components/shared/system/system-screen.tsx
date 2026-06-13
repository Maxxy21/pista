import React from "react";
import { cn } from "@/lib/utils";

interface SystemScreenProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actions?: React.ReactNode;
    tone?: "default" | "destructive";
    className?: string;
}

export function SystemScreen({
    icon,
    title,
    description,
    actions,
    tone = "default",
    className,
}: SystemScreenProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-6 px-4 text-center",
                className,
            )}
        >
            <div
                className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    tone === "destructive"
                        ? "bg-destructive/10 text-destructive"
                        : "border border-border bg-card text-[hsl(var(--gold))]",
                )}
            >
                {icon}
            </div>
            <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold">{title}</h2>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
            </div>
            {actions && <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>}
        </div>
    );
}
