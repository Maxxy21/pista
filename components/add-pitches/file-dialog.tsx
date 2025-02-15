// FileDialog.tsx
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadForm } from "./upload-form";
import { cn } from "@/lib/utils";

interface FileDialogProps {
    children: React.ReactNode;
    orgId: string;
    disabled?: boolean;
}

export const FileDialog = ({children, disabled, orgId}: FileDialogProps) => {
    const [currentStep, setCurrentStep] = React.useState<"upload" | "questions" | "review">("upload");

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900",
                    currentStep === "review" ? "max-w-4xl" : "max-w-lg"
                )}
            >
                <DialogHeader>
                    <DialogTitle>Create a Pitch</DialogTitle>
                    <DialogDescription>
                        Upload your audio, text file, or write your pitch directly.
                    </DialogDescription>
                </DialogHeader>
                <UploadForm
                    orgId={orgId}
                    onStepChange={setCurrentStep}
                />
            </DialogContent>
        </Dialog>
    );
};