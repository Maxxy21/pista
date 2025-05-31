"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileDialog } from "@/components/add-pitches/file-dialog";

interface NewPitchButtonProps {
    orgId: string;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "gradient" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
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
}: NewPitchButtonProps) {
    return (
        <FileDialog orgId={orgId}>
            <Button
                type="button"
                disabled={disabled}
                variant={variant === "outline" ? "outline" : "default"}
                size={size}
                className={cn("gap-2", BUTTON_STYLES[variant], className)}
                aria-label="Create new pitch"
            >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                {size !== "icon" && <span>New Pitch</span>}
            </Button>
        </FileDialog>
    );
}