"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NewPitchButtonProps {
    orgId?: string;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "gradient" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    mobileIconOnly?: boolean;
}

const BUTTON_STYLES: Record<
    NonNullable<NewPitchButtonProps["variant"]>,
    string
> = {
    default: "",
    gradient:
        "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
    outline: "border-primary/50 text-primary hover:bg-primary/10",
};

export function NewPitchButton({
    orgId,
    disabled = false,
    className,
    variant = "default",
    size = "default",
    showIcon = true,
    mobileIconOnly = false,
}: NewPitchButtonProps) {
    return (
        <Button asChild
                type="button"
                disabled={disabled}
                variant={variant === "outline" ? "outline" : "default"}
                size={size}
                className={cn(
                    mobileIconOnly ? "w-9 h-9 p-0 sm:w-auto sm:h-9 sm:gap-2 sm:px-4" : "gap-2", 
                    BUTTON_STYLES[variant], 
                    className
                )}
                aria-label="New pitch"
        >
            <Link href="/pitch/new">
                {showIcon && <PlusCircle className="h-4 w-4" aria-hidden="true" />}
                {mobileIconOnly ? (
                    <span className="hidden sm:inline">New Pitch</span>
                ) : (
                    size !== "icon" && <span>New Pitch</span>
                )}
            </Link>
        </Button>
    );
}
