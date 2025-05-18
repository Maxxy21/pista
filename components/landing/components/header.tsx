import React from 'react';
import {motion} from "framer-motion";
import LogoIcon from "@/components/ui/logo-icon";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Header = () => {
    return (
        <motion.header
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.5}}
            className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-gradient-to-r from-primary/20 to-primary/5"
        >
            <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="flex items-center gap-2 cursor-pointer"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                >
                    <LogoIcon/>
                    <motion.span
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                        initial={{opacity: 0, x: -10}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.2}}
                    >
                        Pista
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
                            <Button variant="ghost" className="font-medium">Sign In</Button>
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <Link href="/sign-up">
                            <Button
                                className="font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                                Get Started
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </nav>
        </motion.header>
    );
};

export default Header;