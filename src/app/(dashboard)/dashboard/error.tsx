"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemScreen } from "@/components/shared/system/system-screen";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("[dashboard] render error:", error);
    }, [error]);

    return (
        <SystemScreen
            className="h-[60vh]"
            tone="destructive"
            icon={<AlertTriangle className="h-7 w-7" />}
            title="Something went wrong"
            description="We couldn't load your dashboard. This is usually a temporary issue."
            actions={
                <Button onClick={reset} variant="gold" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </Button>
            }
        />
    );
}
