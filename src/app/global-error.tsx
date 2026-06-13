"use client";

import { useEffect } from "react";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemScreen } from "@/components/shared/system/system-screen";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error("[global] render error:", error);
    }, [error]);

    return (
        <html lang="en" className={`${hanken.variable} ${fraunces.variable} ${jetbrainsMono.variable} dark`}>
            <body className={hanken.className}>
                <SystemScreen
                    className="min-h-screen bg-background"
                    tone="destructive"
                    icon={<AlertTriangle className="h-7 w-7" />}
                    title="Something went wrong"
                    description="An unexpected error occurred. Please try again."
                    actions={
                        <>
                            <Button variant="gold" className="gap-2" onClick={reset}>
                                <RefreshCw className="h-4 w-4" />
                                Try again
                            </Button>
                            <Button asChild variant="ghost">
                                <a href="/">Go home</a>
                            </Button>
                        </>
                    }
                />
            </body>
        </html>
    );
}