import type {Metadata} from "next";
import {Noto_Sans_Georgian} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import {ConvexClientProvider} from "@/providers/convex-client-provider";
import {ThemeProvider} from "@/providers/theme-provider";
import React, {Suspense} from "react";
import {Loading} from "@/components/auth/loading";
import {Toaster} from "@/components/ui/sonner";
import {ModalProvider} from "@/providers/modal-provider";


const defaultFont = Noto_Sans_Georgian({subsets: ["latin"]});

const ORIGIN_URL =
    process.env.NODE === "production"
        ? "https://startup-pitches.vercel.app/"
        : "http://localhost:3000";


export const metadata: Metadata = {
    title: "Pitch Perfect",
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
        <html lang="en" suppressHydrationWarning>
        <body className={defaultFont.className}>
        <Suspense fallback={<Loading/>}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ConvexClientProvider>
                    <Toaster/>
                    <ModalProvider/>
                    {children}
                    <SpeedInsights />
                    <Analytics />
                </ConvexClientProvider>
            </ThemeProvider>
        </Suspense>
        </body>
        </html>
    );
}
