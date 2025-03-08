import React from "react";
import { cn } from "@/lib/utils";

interface LogoIconProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const LogoIcon = ({ className, size = "md" }: LogoIconProps) => {
    // Define sizes based on the size prop
    const sizes = {
        sm: "h-4 w-5",
        md: "h-5 w-6",
        lg: "h-6 w-7",
    };

    return (
        <div
            className={cn(
                "font-normal flex space-x-2 items-center py-1 relative z-20",
                className
            )}
        >
            <div
                className={cn(
                    "bg-gradient-to-br from-primary to-primary/80 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 shadow-sm transition-transform duration-300",
                    sizes[size]
                )}
            />
        </div>
    );
};

export default LogoIcon;