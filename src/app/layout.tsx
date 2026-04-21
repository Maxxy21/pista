import type {Metadata} from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-playfair",
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
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className={inter.className}>
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
