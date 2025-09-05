'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/components/ui/logo-icon";

export default function SimpleLandingV2() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isSignedIn = status === "authenticated" && session;

    useEffect(() => {
        if (status === "authenticated" && session) {
            router.push("/dashboard");
        }
    }, [session, status, router]);

    if (status === "loading") return <div>Loading...</div>;
    if (session) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Simple Header */}
            <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <LogoIcon />
                        <span className="text-xl font-bold text-primary">
                            Pista
                        </span>
                    </Link>
                    
                    <Link href="/auth/sign-in">
                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 pt-16">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <LogoIcon className="w-16 h-16" />
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Perfect Your Startup Pitch
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                            Get AI-powered feedback on your pitch deck to secure funding with confidence.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="space-y-4">
                        <Link href="/auth/sign-up">
                            <Button size="lg" className="gap-2 px-8 py-4 text-lg">
                                Get Started
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Bachelor thesis project by Berni
                        </p>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2024 Pista. Bachelor thesis project.
                </div>
            </footer>
        </div>
    );
}