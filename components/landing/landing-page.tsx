'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/landing/components/header";
import Hero from "@/components/landing/components/hero";
import Features from "./components/features";
import HowItWorks from "@/components/landing/components/how-it-works";
import CTA from "@/components/landing/components/cta";
import Footer from "@/components/landing/components/footer";


export default function LandingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && user) {
            router.push("/dashboard");
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) return null;
    if (user) return null;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="h-16"/>
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}