import React from 'react';
import {motion} from "framer-motion";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";

const Footer = () => {
    return (
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
                            Pista
                        </span>
                    </motion.div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Pista. All rights reserved.
                        </p>
                        <span className="hidden md:inline text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                            Made by <Link href="https://maxwellaboagye.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Maxwell Aboagye</Link>
                        </p>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;