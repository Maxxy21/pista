"use client";
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileDialog } from "@/components/add-pitches/file-dialog";
import { Button } from "@/components/ui/button";

interface NewPitchButtonProps {
    orgId: string;
    disabled?: boolean;
    className?: string;
}

export const NewPitchButton = ({ orgId, disabled, className }: NewPitchButtonProps) => {
    return (
        <FileDialog
            orgId={orgId}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    disabled={disabled}
                    className={cn(
                        "flex items-center gap-2 font-medium",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    <Plus className="h-4 w-4" />
                    New Pitch
                </Button>
            </motion.div>
        </FileDialog>
    );
};