import React from 'react';
import {motion} from "framer-motion";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

const CTA = () => {
    return (
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
    );
};

export default CTA;