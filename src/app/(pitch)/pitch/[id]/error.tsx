"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SystemScreen } from "@/components/shared/system/system-screen";

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
        <SystemScreen
            className="min-h-screen"
            tone="destructive"
            icon={<AlertTriangle className="h-7 w-7" />}
            title="Couldn't load this pitch"
            description="The pitch may have been deleted or you may not have access to it."
            actions={
                <>
                    <Button variant="outline" className="gap-2" onClick={() => router.push("/dashboard")}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Button>
                    <Button variant="gold" className="gap-2" onClick={reset}>
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </Button>
                </>
            }
        />
    );
}
