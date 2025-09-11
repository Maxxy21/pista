"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressOverlayProps {
  uploadProgress: number;
  isVisible: boolean;
}

export function ProgressOverlay({ uploadProgress, isVisible }: ProgressOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full p-6 space-y-4">
        <h3 className="font-semibold text-center">Processing Your Pitch</h3>
        <Progress value={uploadProgress} className="h-2" />
        <p className="text-sm text-center text-muted-foreground">
          {uploadProgress < 50
            ? "Uploading and processing audio..."
            : "Generating transcript..."}
        </p>
      </div>
    </div>
  );
}