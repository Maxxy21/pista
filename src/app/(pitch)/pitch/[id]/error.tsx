"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PitchError({ error, reset }: ErrorProps) {
    const router = useRouter();

    useEffect(() => {
        console.error("[pitch] render error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6 text-center px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Couldn't load this pitch</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                    The pitch may have been deleted or you may not have access to it.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </Button>
                <Button variant="ghost" className="gap-2" onClick={reset}>
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </Button>
            </div>
        </div>
    );
}
