"use client";

import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import LogoIcon from "@/components/ui/logo-icon";

interface ProgressOverlayProps {
  uploadProgress: number;
  isVisible: boolean;
}

export function ProgressOverlay({ uploadProgress, isVisible }: ProgressOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50">
      <div className="max-w-md w-full p-8 space-y-6">
        {/* Logo and brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <LogoIcon />
          <span className="text-lg font-semibold text-foreground">Pista</span>
        </div>

        {/* Main content */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Processing Your Pitch</h3>
            <p className="text-sm text-muted-foreground">
              {uploadProgress < 25
                ? "Uploading and validating files..."
                : uploadProgress < 50
                ? "Processing audio content..."
                : uploadProgress < 75
                ? "Generating transcript..."
                : "Finalizing evaluation..."}
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>

          {/* Loading dots */}
          <LoadingSpinner variant="dots" size="sm" />
        </div>
      </div>
    </div>
  );
}