"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Upload } from "lucide-react";

interface FileDropzoneContentProps {
  type: "audio" | "textFile";
  files: File[];
  isDragActive: boolean;
  isProcessing: boolean;
}

export function FileDropzoneContent({ type, files, isDragActive, isProcessing }: FileDropzoneContentProps) {
  const hasFile = files.length > 0;
  const sizeMb = hasFile ? (files[0].size / (1024 * 1024)).toFixed(2) : null;

  if (hasFile) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {type === "audio" ? (
            <Mic className="h-8 w-8 text-primary" />
          ) : (
            <FileText className="h-8 w-8 text-primary" />
          )}
        </div>
        <p className="font-medium">{files[0].name}</p>
        <p className="text-sm text-muted-foreground">{sizeMb} MB</p>
      </div>
    );
  }

  const dropLabel = type === "audio" ? "audio" : "text";
  const supportText = type === "audio" ? "Supports MP3, WAV, M4A (max 50MB)" : "Supports TXT files (max 5MB)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <p className="font-medium">
        {isDragActive ? `Drop the ${dropLabel} file here` : `Drag & drop your ${dropLabel} file here`}
      </p>
      <p className="text-sm text-muted-foreground">{supportText}</p>
      <Button size="sm" variant="outline" type="button">
        Browse files
      </Button>
    </div>
  );
}

