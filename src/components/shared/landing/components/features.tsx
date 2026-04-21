'use client';

import React from "react";
import { motion } from "framer-motion";
import { animations, features } from "./constants";

const Features = () => {
    const [featured, ...rest] = features;

    return (
        <section className="py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Section label */}
                <div className="mb-14 text-center">
                    <p
                        className="text-xs uppercase tracking-widest mb-4 font-medium"
                        style={{ color: "var(--landing-text-muted)" }}
                    >
                        What you get
                    </p>
                    <h2
                        className="font-playfair text-4xl sm:text-5xl tracking-tight leading-[1.1] mb-4"
                        style={{ color: "var(--landing-cream)" }}
                    >
                        Everything you need
                        <br />
                        <span style={{ color: "var(--landing-text-muted)" }}>to nail your pitch</span>
                    </h2>
                    <p className="text-base max-w-lg mx-auto" style={{ color: "var(--landing-text-muted)" }}>
                        Pista gives you the same rigorous evaluation framework VCs use, without the gatekeeping.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={animations.staggerChildren}
                    className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
                >
                    {/* Featured card — spans 2 cols */}
                    <motion.div variants={animations.fadeIn} className="lg:col-span-2">
                        <div className="gradient-shell h-full">
                            <div className="gradient-shell-inner p-8 h-full">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                                    style={{ background: "var(--landing-cream-faint)", border: "1px solid var(--landing-border)" }}
                                >
                                    <featured.icon className="h-5 w-5" style={{ color: "var(--landing-cream)" }} />
                                </div>
                                <h3
                                    className="text-xl font-semibold mb-3"
                                    style={{ color: "var(--landing-cream)" }}
                                >
                                    {featured.title}
                                </h3>
                                <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--landing-text-muted)" }}>
                                    {featured.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Standard cards */}
                    {rest.map((feature) => (
                        <motion.div key={feature.title} variants={animations.fadeIn}>
                            <div className="gradient-shell-sm h-full">
                                <div className="gradient-shell-sm-inner p-6 h-full">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                                        style={{ background: "var(--landing-cream-faint)", border: "1px solid var(--landing-border)" }}
                                    >
                                        <feature.icon className="h-4 w-4" style={{ color: "var(--landing-cream)" }} />
                                    </div>
                                    <h3
                                        className="text-sm font-semibold mb-2"
                                        style={{ color: "var(--landing-cream)" }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
