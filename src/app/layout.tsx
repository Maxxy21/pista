import type {Metadata} from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
    subsets: ["latin"],
    variable: "--font-hanken",
    display: "swap",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});
import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

import {ConvexClientProvider} from "@/providers/convex-client-provider";
import {ThemeProvider} from "@/providers/theme-provider";
import React, {Suspense} from "react";
import {Loading} from "@/components/shared/auth/loading";
import {Toaster} from "@/components/ui/sonner";
import {ModalProvider} from "@/providers/modal-provider";
import { EvaluationProgressOverlay } from "@/components/shared/progress/evaluation-progress";



const ORIGIN_URL =
    process.env.NODE === "production"
        ? "https://pista-app.vercel.app/"
        : "http://localhost:3000";


export const metadata: Metadata = {
    title: "Pista",
    description: "Evaluate your startup pitches using AI:",
    metadataBase: new URL(ORIGIN_URL),
    alternates: {
        canonical: ORIGIN_URL,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${hanken.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        <body className={hanken.className}>
        <Suspense fallback={<Loading/>}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                forcedTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
            >
                <ConvexClientProvider>
                    <Toaster/>
                    <ModalProvider/>
                    <EvaluationProgressOverlay />
                    {children}
                    {/*<SpeedInsights />*/}
                    <Analytics />
                </ConvexClientProvider>
            </ThemeProvider>
        </Suspense>
        </body>
        </html>
    );
}
