'use client';

import { motion } from "framer-motion";
import Link from "next/link";

const CTA = () => {
    return (
        <section
            className="py-24 lg:py-32"
            style={{ borderTop: "1px solid var(--landing-border)" }}
        >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto max-w-2xl"
                >
                    {/* Gradient shell card */}
                    <div className="gradient-shell">
                        <div className="gradient-shell-inner p-12 sm:p-16 text-center">
                            <p
                                className="text-xs uppercase tracking-widest mb-5 font-medium"
                                style={{ color: "var(--landing-text-muted)" }}
                            >
                                Get started free
                            </p>
                            <h2
                                className="font-display text-4xl sm:text-5xl tracking-tight leading-[1.1] mb-5"
                                style={{ color: "var(--landing-cream)" }}
                            >
                                Ready to perfect
                                <br />your pitch?
                            </h2>
                            <p
                                className="text-base mb-10 max-w-sm mx-auto leading-relaxed"
                                style={{ color: "var(--landing-text-muted)" }}
                            >
                                Stop guessing what investors want to hear. Get structured, honest feedback from AI trained on what actually matters.
                            </p>
                            <Link
                                href="/sign-up"
                                className="inline-block px-10 py-4 text-sm font-medium rounded-full transition-opacity duration-150 hover:opacity-85"
                                style={{ background: "var(--landing-cream)", color: "#0e0d0c" }}
                            >
                                Evaluate my pitch
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
