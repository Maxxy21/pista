"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileDialog } from "@/components/add-pitches/file-dialog";
import {Button} from "@/components/ui/button";

interface NewPitchButtonProps {
   orgId: string;
    disabled?: boolean;
}

export const NewPitchButton = ({orgId, disabled }: NewPitchButtonProps) => {
    return (
        <FileDialog
            orgId={orgId}
            disabled={disabled}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    disabled={disabled}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:bg-blue-700",
                        disabled && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
                    )}
                >
                    <Plus className="h-4 w-4" />
                    Add Pitch
                </Button>
            </motion.div>
        </FileDialog>
    );
};