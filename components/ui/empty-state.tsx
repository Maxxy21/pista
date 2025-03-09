import React from "react";
import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useOptimizedAnimations } from "@/hooks/use-optimized-animations";
import { LazyLoadSection } from "@/components/lazy-load-section";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    imageSize?: number;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title,
    description,
    imageSrc,
    imageAlt = "Empty state illustration",
    imageSize = 140,
    action,
    className
}: EmptyStateProps) {
    const { animations } = useOptimizedAnimations();

    return (
        <LazyLoadSection className={cn(
            "flex flex-col items-center justify-center py-10",
            className
        )}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.staggerChildren}
                className="flex flex-col items-center"
            >
                <motion.div variants={animations.fadeIn}>
                    <OptimizedImage
                        src={imageSrc}
                        height={imageSize}
                        width={imageSize}
                        alt={imageAlt}
                        className="mx-auto mb-6"
                    />
                </motion.div>
                
                <motion.h2 
                    className="text-2xl font-semibold text-center"
                    variants={animations.slideUp}
                >
                    {title}
                </motion.h2>
                
                <motion.p 
                    className="text-muted-foreground text-sm mt-2 text-center max-w-md"
                    variants={animations.slideUp}
                >
                    {description}
                </motion.p>
                
                {action && (
                    <motion.div 
                        className="mt-6"
                        variants={animations.scale}
                    >
                        {action}
                    </motion.div>
                )}
            </motion.div>
        </LazyLoadSection>
    );
} 