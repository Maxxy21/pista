import React from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {UploadForm} from "./upload-form";

interface FileDialogProps {
    children: React.ReactNode;
    orgId: string;
    disabled?: boolean;
}

export const FileDialog = ({children, disabled, orgId}: FileDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle>Create a Pitch</DialogTitle>
                    <DialogDescription>
                        Upload your audio, text file, or write your pitch directly.
                    </DialogDescription>
                </DialogHeader>
                <UploadForm orgId={orgId}/>
            </DialogContent>
        </Dialog>
    );
};