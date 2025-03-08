'use client';

import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, MessageSquareText, Award } from "lucide-react";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LogoIcon from "@/components/ui/logo-icon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ModernLandingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && user) {
            router.push("/dashboard");
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) return null;
    if (user) return null;

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerChildren = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* Modern Navigation with Gradient Border */}
            <motion.header
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.5}}
                className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-gradient-to-r from-primary/20 to-primary/5"
            >
                <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <LogoIcon/>
                        <motion.span
                            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                            initial={{opacity: 0, x: -10}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.2}}
                        >
                            Pitch Perfect
                        </motion.span>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                    >
                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Link href="/sign-in">
                                <Button variant="ghost" className="font-medium">Sign In</Button>
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Link href="/sign-up">
                                <Button className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                                    Get Started
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </nav>
            </motion.header>

            <div className="h-16"/>
            <main className="flex-1">
                {/* Hero Section with Gradient Background */}
                <section className="relative py-24 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 -z-10"/>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"/>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"/>

                    <div className="container px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerChildren}
                            className="mx-auto max-w-3xl text-center"
                        >
                            <motion.div
                                variants={fadeIn}
                                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                                Transform your startup pitch with AI
                            </motion.div>
                            <motion.h1
                                variants={fadeIn}
                                className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                            >
                                Perfect Your{" "}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                        Startup Pitch
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9C118.957 4.47226 236.914 1.23827 355 9" stroke="url(#paint0_linear)" strokeWidth="6" strokeLinecap="round"/>
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="179" y1="3" x2="179" y2="9" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--primary)" stopOpacity="0.3"/>
                                                <stop offset="1" stopColor="var(--primary)" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </motion.h1>
                            <motion.p
                                variants={fadeIn}
                                className="mb-8 text-xl text-muted-foreground"
                            >
                                Get instant, expert-level feedback on your pitch deck from our AI system.
                                Identify strengths, fix weaknesses, and secure funding with confidence.
                            </motion.p>
                            <motion.div
                                variants={fadeIn}
                                className="flex flex-wrap justify-center gap-4"
                            >
                                <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                    <Link href="/sign-up">
                                        <Button size="lg" className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2">
                                            Get Started <ArrowRight className="h-4 w-4"/>
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Preview Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-16 mx-auto max-w-4xl"
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/10">
                                {/* This would be your app preview image */}
                                <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 text-center flex flex-col items-center justify-center px-4">
                                        <div className="w-full max-w-sm bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="h-3 w-24 bg-primary/30 rounded"></div>
                                                <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                                                <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-600 rounded"></div>
                                                <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-600 rounded"></div>
                                                <div className="h-4 w-4/6 bg-zinc-100 dark:bg-zinc-600 rounded"></div>
                                            </div>
                                            <div className="mt-6 flex justify-between">
                                                <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                                                <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section with Cards */}
                <section className="py-20 lg:py-32 relative overflow-hidden">
                    <div className="absolute -top-96 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full filter blur-3xl -z-10 transform -translate-x-1/2"/>
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Transform Your Pitch with AI</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Our platform leverages advanced AI to analyze every aspect of your pitch
                                and provide actionable insights.
                            </p>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerChildren}
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {features.map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    variants={fadeIn}
                                    whileHover={{y: -8, transition: { duration: 0.2 }}}
                                    className="rounded-xl border bg-background/50 backdrop-blur-sm p-8 shadow-sm"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                        <feature.icon className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How It Works Section with Steps */}
                <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/10 to-muted/30 -z-10"/>
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Getting feedback on your pitch is simple and quick with our intuitive platform.
                            </p>
                        </div>

                        <div className="relative">
                            {/* Connection Line */}
                            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 transform -translate-y-1/2 z-0"/>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                                variants={staggerChildren}
                                className="grid gap-12 md:grid-cols-3 relative z-10"
                            >
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={step.title}
                                        variants={fadeIn}
                                        className="relative flex flex-col items-center text-center"
                                    >
                                        <motion.div
                                            whileHover={{scale: 1.1}}
                                            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary relative"
                                        >
                                            <span>{index + 1}</span>
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Modern CTA Section with Card Design */}
                <section className="py-20 lg:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 -z-10"/>
                    <div className="absolute -bottom-64 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"/>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="container px-4 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto max-w-4xl">
                            <div className="rounded-2xl bg-gradient-to-b from-background to-muted/20 p-2 shadow-lg border border-primary/10">
                                <div className="rounded-xl bg-background p-8 sm:p-10 lg:p-12 text-center backdrop-blur-sm">
                                    <h2 className="text-3xl font-bold mb-4">
                                        Ready to Perfect Your Pitch?
                                    </h2>
                                    <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
                                        Join thousands of startups who have improved their pitch decks with our
                                        AI-powered platform. Get started today.
                                    </p>
                                    <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                        <Link href="/sign-up">
                                            <Button size="lg" className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2">
                                                Get Started Now <ArrowRight className="h-4 w-4"/>
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <motion.footer
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.5}}
                className="border-t border-gradient-to-r from-primary/20 to-primary/5 py-12 bg-background"
            >
                <div className="container px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <motion.div
                            whileHover={{scale: 1.05}}
                            className="flex items-center gap-2"
                        >
                            <LogoIcon/>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Pitch Perfect
                            </span>
                        </motion.div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Pitch Perfect. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}

const features = [
    {
        title: "AI-Powered Analysis",
        description:
            "Our advanced AI evaluates your pitch across multiple dimensions, providing comprehensive feedback that highlights strengths and areas for improvement.",
        icon: Sparkles,
    },
    {
        title: "Instant Feedback",
        description:
            "Get detailed feedback in minutes, not days. Make improvements in real-time and iterate quickly on your pitch deck.",
        icon: Zap,
    },
    {
        title: "Expert Insights",
        description:
            "Our AI is trained on thousands of successful pitch decks and investor feedback to provide industry-specific recommendations.",
        icon: Award,
    },
    {
        title: "Comprehensive Evaluation",
        description:
            "Receive scores and detailed analysis on your problem-solution fit, business model, team capabilities, and presentation quality.",
        icon: Target,
    },
    {
        title: "Follow-up Q&A",
        description:
            "Get AI-generated questions that investors might ask and practice your responses for a more complete pitch evaluation.",
        icon: MessageSquareText,
    },
    {
        title: "Multiple Upload Options",
        description:
            "Upload audio recordings, text files, or type your pitch directly. Our flexible system works with your preferred format.",
        icon: CheckCircle2,
    },
];

const steps = [
    {
        title: "Upload Your Pitch",
        description:
            "Simply upload your pitch as audio, text file, or type it directly into our platform. We support multiple formats for your convenience.",
    },
    {
        title: "AI Analysis",
        description:
            "Our AI analyzes your pitch across key dimensions including problem-solution fit, business model, team capabilities, and presentation quality.",
    },
    {
        title: "Get Detailed Feedback",
        description:
            "Receive a comprehensive evaluation with specific scores, strengths, improvements, and actionable recommendations to enhance your pitch.",
    },
];