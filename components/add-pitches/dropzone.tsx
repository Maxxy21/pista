import { motion, AnimatePresence } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { FilePreview } from "@/components/add-pitches/file-preview";
import { cn } from "@/lib/utils";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = {
    audio: 50 * 1024 * 1024,
    text: 5 * 1024 * 1024
};

interface DropzoneProps {
    contentType: string;
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive: boolean;
    files: File[];
    disabled?: boolean;
    uploadProgress?: number;
    isProcessing?: boolean;
}

export const Dropzone = ({
                             contentType,
                             getRootProps,
                             getInputProps,
                             isDragActive,
                             files,
                             disabled = false,
                             uploadProgress = 0,
                             isProcessing = false
                         }: DropzoneProps) => {
    const maxSize = MAX_FILE_SIZE[contentType as keyof typeof MAX_FILE_SIZE];
    const isOversize = files[0] && files[0].size > maxSize;

    const rootProps = getRootProps();

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <motion.div
                initial={{ scale: 1 }}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
                className={cn(
                    "relative p-8 rounded-lg border-2 border-dashed transition-colors",
                    isDragActive && !disabled && "border-primary bg-primary/5",
                    disabled ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer hover:border-primary",
                    isOversize && "border-destructive bg-destructive/5"
                )}
                onClick={rootProps.onClick}
                onKeyDown={rootProps.onKeyDown}
                onFocus={rootProps.onFocus}
                onBlur={rootProps.onBlur}
                onDrop={rootProps.onDrop}
                onDragEnter={rootProps.onDragEnter}
                onDragLeave={rootProps.onDragLeave}
                onDragOver={rootProps.onDragOver}
                role={rootProps.role}
                tabIndex={rootProps.tabIndex}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center gap-4">
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="text-primary"
                            >
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            >
                                <IconUpload
                                    className={cn(
                                        "h-8 w-8",
                                        disabled ? "text-muted-foreground" : "text-primary",
                                        isOversize && "text-destructive"
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isOversize ? (
                                <span className="text-destructive">
                  File too large. Maximum size is {maxSize / (1024 * 1024)}MB
                </span>
                            ) : disabled ? (
                                "Processing file..."
                            ) : isDragActive ? (
                                "Drop the files here..."
                            ) : (
                                <>
                                    Drag & drop or click to select {contentType === "audio" ? "audio" : "text"} files
                                    <br />
                                    <span className="text-xs">
                    Max size: {maxSize / (1024 * 1024)}MB
                  </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {(uploadProgress > 0 || isProcessing) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>{isProcessing ? "Processing..." : "Uploading..."}</span>
                                    <span>{Math.round(uploadProgress)}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-1" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {files.length > 0 && !isOversize && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4"
                        >
                            <FilePreview file={files[0]} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};