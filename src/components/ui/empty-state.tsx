import React from "react";
import { motion } from "framer-motion";
import { useOptimizedAnimations } from "@/hooks/use-optimized-animations";
import { LazyLoadSection } from "@/components/shared/common/lazy-load-section";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
    const { animations } = useOptimizedAnimations();

    return (
        <LazyLoadSection className={cn("flex flex-col items-center justify-center py-10", className)}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.staggerChildren}
                className="flex flex-col items-center"
            >
                <motion.div variants={animations.fadeIn}>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-[hsl(var(--gold))]">
                        {icon}
                    </div>
                </motion.div>

                <motion.h2
                    className="text-center font-display text-2xl font-semibold"
                    variants={animations.slideUp}
                >
                    {title}
                </motion.h2>

                <motion.p
                    className="mt-2 max-w-md text-center text-sm text-muted-foreground"
                    variants={animations.slideUp}
                >
                    {description}
                </motion.p>

                {action && (
                    <motion.div className="mt-6" variants={animations.scale}>
                        {action}
                    </motion.div>
                )}
            </motion.div>
        </LazyLoadSection>
    );
}
