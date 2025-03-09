import React from 'react';
import {motion} from "framer-motion";
import {animations, steps} from "./constants";

const HowItWorks = () => {
    return (
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
                    <div
                        className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 transform -translate-y-1/2 z-0"/>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={animations.staggerChildren}
                        className="grid gap-12 md:grid-cols-3 relative z-10"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                variants={animations.fadeIn}
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
    )
};

export default HowItWorks;