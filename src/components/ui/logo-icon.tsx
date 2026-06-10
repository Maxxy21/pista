import React from "react";
import { cn } from "@/lib/utils";

interface LogoIconProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const px = { sm: 18, md: 22, lg: 28 } as const;

const LogoIcon = ({ className, size = "md" }: LogoIconProps) => {
    const s = px[size];
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            aria-label="Pista"
            className={cn("text-foreground flex-shrink-0", className)}
        >
            {/* pi top bar */}
            <rect x="3" y="3.4" width="18" height="2.6" rx="1.3" fill="currentColor" />
            {/* three rising score bars; rightmost is gold */}
            <rect x="5.5" y="12.5" width="3" height="8" rx="1.5" fill="currentColor" fillOpacity="0.55" />
            <rect x="10.5" y="7" width="3" height="13.5" rx="1.5" fill="currentColor" fillOpacity="0.85" />
            <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" style={{ fill: "hsl(var(--gold))" }} />
        </svg>
    );
};

export default LogoIcon;
