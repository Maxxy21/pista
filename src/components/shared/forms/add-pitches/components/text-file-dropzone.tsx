"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FileDropzoneContent } from "./file-dropzone-content";

interface TextFileDropzoneProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isProcessing: boolean;
  files: File[];
}

export function TextFileDropzone({ getRootProps, getInputProps, isDragActive, isProcessing, files }: TextFileDropzoneProps) {
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
      <FileDropzoneContent type="textFile" files={files} isDragActive={isDragActive} isProcessing={isProcessing} />
    </div>
  );
}

