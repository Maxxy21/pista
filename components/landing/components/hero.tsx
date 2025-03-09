'use client';

import {motion} from "framer-motion";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {animations} from "./constants";

const Hero = () => {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 -z-10"/>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"/>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"/>

            <div className="container px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animations.staggerChildren}
                    className="mx-auto max-w-3xl text-center"
                >
                    <motion.div
                        variants={animations.fadeIn}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                        Transform your startup pitch with AI
                    </motion.div>
                    <motion.h1
                        variants={animations.fadeIn}
                        className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                    >
                        Perfect Your{" "}
                        <span className="relative">
                                    <span
                                        className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                        Startup Pitch
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9C118.957 4.47226 236.914 1.23827 355 9"
                                              stroke="url(#paint0_linear)" strokeWidth="6" strokeLinecap="round"/>
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="179" y1="3" x2="179" y2="9"
                                                            gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--primary)" stopOpacity="0.3"/>
                                                <stop offset="1" stopColor="var(--primary)" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                    </motion.h1>
                    <motion.p
                        variants={animations.fadeIn}
                        className="mb-8 text-xl text-muted-foreground"
                    >
                        Get instant, expert-level feedback on your pitch deck from our AI system.
                        Identify strengths, fix weaknesses, and secure funding with confidence.
                    </motion.p>
                    <motion.div
                        variants={animations.fadeIn}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Link href="/sign-up">
                                <Button size="lg"
                                        className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2">
                                    Get Started <ArrowRight className="h-4 w-4"/>
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Preview Image */}
                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5, duration: 0.8}}
                    className="mt-16 mx-auto max-w-4xl"
                >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/10">
                        {/* This would be your app preview image */}
                        <div
                            className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                            <div
                                className="w-full h-full bg-zinc-100 dark:bg-zinc-900 text-center flex flex-col items-center justify-center px-4">
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
    );
}

export default Hero