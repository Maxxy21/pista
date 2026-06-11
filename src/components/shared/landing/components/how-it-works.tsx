'use client';

import { motion } from "framer-motion";
import { animations, steps } from "./constants";

const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="py-24 lg:py-32"
            style={{ borderTop: "1px solid var(--landing-border)" }}
        >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p
                        className="text-xs uppercase tracking-widest mb-4 font-medium"
                        style={{ color: "var(--landing-text-muted)" }}
                    >
                        How it works
                    </p>
                    <h2
                        className="font-display text-4xl sm:text-5xl tracking-tight leading-[1.1] mb-4"
                        style={{ color: "var(--landing-cream)" }}
                    >
                        From pitch to feedback
                        <br />
                        <span style={{ color: "var(--landing-text-muted)" }}>in 3 steps</span>
                    </h2>
                    <p className="text-base max-w-md mx-auto" style={{ color: "var(--landing-text-muted)" }}>
                        No setup, no scheduling. Just paste your pitch and get expert-level analysis instantly.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={animations.staggerChildren}
                    className="relative grid gap-8 md:grid-cols-3 max-w-4xl mx-auto"
                >
                    {/* Connecting line */}
                    <div
                        className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
                        style={{ background: "var(--landing-border)" }}
                    />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            variants={animations.fadeIn}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Gradient shell number circle */}
                            <div className="mb-6 relative z-10" style={{ padding: "1px", borderRadius: "9999px", background: "linear-gradient(to right bottom, rgba(242,234,211,0.3), rgba(242,234,211,0.05), rgba(0,0,0,0))" }}>
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full font-mono text-sm font-bold tracking-wide"
                                    style={{
                                        background: "var(--landing-surface)",
                                        color: "var(--landing-cream)",
                                        boxShadow: "rgba(255,255,255,0.02) 0px 0px 40px 0px inset",
                                    }}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                            </div>
                            <h3 className="text-base font-semibold mb-2" style={{ color: "var(--landing-cream)" }}>
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
