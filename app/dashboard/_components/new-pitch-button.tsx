"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {FileDialog} from "@/components/add-pitches/file-dialog";

interface NewPitchButtonProps {
    orgId: string;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "gradient" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
}

export function NewPitchButton({
                                   orgId,
                                   disabled = false,
                                   className,
                                   variant = "default",
                                   size = "default"
                               }: NewPitchButtonProps) {
    // Generate button styles based on variant
    const buttonStyles = {
        default: "",
        gradient: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
        outline: "border-primary/50 text-primary hover:bg-primary/10"
    };

    return (
        <FileDialog orgId={orgId}>
            <Button
                disabled={disabled}
                variant={variant === "outline" ? "outline" : "default"}
                size={size}
                className={cn(
                    "gap-2",
                    buttonStyles[variant],
                    className
                )}
            >
                <PlusCircle className="h-4 w-4" />
                {size !== "icon" && "New Pitch"}
            </Button>
        </FileDialog>
    );
}