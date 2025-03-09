'use client';

import {motion} from "framer-motion";
import {animations,features} from "./constants";

const Features = () => {
    return (
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
                            variants={animations.staggerChildren}
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {features.map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    variants={animations.fadeIn}
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
    );
};

export default Features;