'use client';

import { ArrowRight, CheckCircle2, Sparkles, Target, Zap } from "lucide-react";
import {SignInButton, SignUpButton, useUser} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LogoIcon from "@/components/ui/logo-icon";
import { useRouter } from "next/navigation";
import {useEffect} from "react";
import Link from "next/link";

export default function LandingPage() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    if (user) {
        return null;
    }

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
            {/* Navigation */}
            <motion.header
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.5}}
                className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-md z-50"
            >
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <LogoIcon/>
                        <motion.span
                            className="text-xl font-bold"
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
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Link href="/sign-up">
                                <Button>Get Started</Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </nav>
            </motion.header>

            <div className="h-16"/>
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-background py-20">
                    <div className="container px-4">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerChildren}
                            className="mx-auto max-w-3xl text-center"
                        >
                            <motion.h1
                                variants={fadeIn}
                                className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
                            >
                                Perfect Your Startup Pitch with{" "}
                                <span
                                    className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    AI-Powered
                                </span>{" "}
                                Evaluation
                            </motion.h1>
                            <motion.p
                                variants={fadeIn}
                                className="mb-8 text-xl text-muted-foreground"
                            >
                                Get instant, detailed feedback on your pitch deck from our advanced AI system.
                                Improve your chances of success with data-driven insights.
                            </motion.p>
                            <motion.div
                                variants={fadeIn}
                                className="flex flex-wrap justify-center gap-4"
                            >
                                <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                    <Link href="/sign-up">
                                        <Button size="lg" className="gap-2">
                                            Start Now <ArrowRight className="h-4 w-4"/>
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t bg-muted/50 py-20">
                    <div className="container px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerChildren}
                            className="grid gap-6 md:grid-cols-2"
                        >
                            {features.map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    variants={fadeIn}
                                    whileHover={{scale: 1.02}}
                                    className="rounded-lg border bg-background p-6"
                                >
                                    <feature.icon className="mb-4 h-12 w-12 text-primary"/>
                                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="border-t py-20">
                    <div className="container px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerChildren}
                            className="grid gap-8 md:grid-cols-3"
                        >
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    variants={fadeIn}
                                    className="text-center"
                                >
                                    <motion.div
                                        whileHover={{scale: 1.1}}
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground mx-auto"
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t bg-muted/50 py-20">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="container px-4"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Ready to Perfect Your Pitch?
                            </h2>
                            <p className="mb-8 text-muted-foreground">
                                Join thousands of startups who have improved their pitch decks with our
                                AI-powered platform.
                            </p>
                            <motion.div whileHover={{scale: 1.05}}>
                                <Link href="/sign-up">
                                    <Button size="lg" className="gap-2">
                                        Get Started Now <ArrowRight className="h-4 w-4"/>
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <motion.footer
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.5}}
                className="border-t bg-background py-12"
            >
                <div className="container px-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <motion.div
                            whileHover={{scale: 1.05}}
                            className="flex items-center gap-2"
                        >
                            <LogoIcon/>
                            <span className="text-xl font-bold"> Pitch Perfect</span>
                        </motion.div>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}

// ... rest of the code remains the same

const features = [
    {
        title: "AI-Powered Analysis",
        description:
            "Our advanced AI analyzes your pitch deck across multiple dimensions, providing detailed feedback and suggestions for improvement.",
        icon: Sparkles,
    },
    {
        title: "Real-Time Feedback",
        description:
            "Get instant feedback on your pitch deck's content, structure, and presentation. Make improvements in real-time.",
        icon: Zap,
    },
]

const steps = [
    {
        title: "Upload Your Pitch",
        description:
            "Simply upload your pitch deck or paste your pitch text into our platform.",
    },
    {
        title: "AI Analysis",
        description:
            "Our AI analyzes your pitch across multiple dimensions and benchmarks against industry standards.",
    },
    {
        title: "Get Detailed Feedback",
        description:
            "Receive comprehensive feedback and actionable suggestions to improve your pitch.",
    },
]
