'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { animations, stats } from "./constants";
import { VerdictCard } from "./verdict-card";

const Hero = () => {
    return (
        <section className="relative pt-32 pb-0 overflow-hidden">
            {/* Ambient warm glow */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            >
                <div
                    className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
                    style={{
                        background: "radial-gradient(ellipse at center, hsl(var(--foreground)) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animations.staggerChildren}
                    className="mx-auto max-w-3xl text-center"
                >
                    {/* Badge */}
                    <motion.div variants={animations.fadeIn} className="mb-8">
                        <span
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide"
                            style={{
                                border: "1px solid var(--landing-border)",
                                color: "var(--landing-cream-muted)",
                                background: "var(--landing-cream-faint)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: "hsl(var(--score-high))" }}
                            />
                            AI-powered pitch evaluation
                        </span>
                    </motion.div>

                    {/* Headline — Playfair Display */}
                    <motion.h1
                        variants={animations.fadeIn}
                        className="font-display text-6xl sm:text-7xl lg:text-[80px] leading-[1.05] tracking-[-0.03em] mb-6"
                        style={{ color: "var(--landing-cream)" }}
                    >
                        Pitch smarter.
                        <br />
                        <span style={{ color: "var(--landing-text-muted)" }}>
                            Close faster.
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={animations.fadeIn}
                        className="text-lg leading-relaxed max-w-xl mx-auto mb-10"
                        style={{ color: "var(--landing-text-muted)" }}
                    >
                        Submit your startup pitch and get structured AI analysis: scoring,
                        risk assessment, investor questions, and actionable improvements in under 60 seconds.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={animations.fadeIn}
                        className="flex flex-wrap justify-center gap-3 mb-16"
                    >
                        <Link
                            href="/sign-up"
                            className="px-8 py-3.5 text-sm font-medium rounded-full transition-opacity duration-150 hover:opacity-85 bg-gold text-gold-foreground"
                        >
                            Evaluate my pitch
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-3.5 text-sm font-medium rounded-full transition-colors duration-150"
                            style={{
                                border: "1px solid var(--landing-border)",
                                color: "var(--landing-text-muted)",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "var(--landing-border-hover)";
                                e.currentTarget.style.color = "var(--landing-text)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "var(--landing-border)";
                                e.currentTarget.style.color = "var(--landing-text-muted)";
                            }}
                        >
                            See how it works
                        </a>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        variants={animations.fadeIn}
                        className="flex flex-wrap justify-center gap-10 mb-20"
                    >
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center gap-1">
                                <span
                                    className="text-2xl font-bold tabular-nums font-mono"
                                    style={{ color: "var(--landing-cream)" }}
                                >
                                    {stat.value}
                                </span>
                                <span className="text-xs uppercase tracking-widest" style={{ color: "var(--landing-text-muted)" }}>
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Live verdict card */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto max-w-md"
                >
                    <VerdictCard />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
