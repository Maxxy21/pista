import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import LogoIcon from "@/components/ui/logo-icon";

const Logo = () => {
    return (
        <Link
            href="/dashboard"
            className="font-normal flex items-center gap-2.5 py-1 relative z-20"
        >
            <LogoIcon size="md" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-lg font-semibold tracking-tight whitespace-pre"
            >
                <span className="text-gold">Pi</span>
                <span className="text-foreground">sta</span>
            </motion.span>
        </Link>
    );
};

export default Logo;
