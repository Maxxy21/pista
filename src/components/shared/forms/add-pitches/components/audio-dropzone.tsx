"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FileDropzoneContent } from "./file-dropzone-content";

interface AudioDropzoneProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isProcessing: boolean;
  files: File[];
}

export function AudioDropzone({ getRootProps, getInputProps, isDragActive, isProcessing, files }: AudioDropzoneProps) {
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive && !isProcessing && "border-primary bg-primary/5",
        isProcessing ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-primary hover:bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <FileDropzoneContent type="audio" files={files} isDragActive={isDragActive} isProcessing={isProcessing} />
    </div>
  );
}

