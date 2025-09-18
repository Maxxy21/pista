import React from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import LogoIcon from "@/components/ui/logo-icon";

interface ProcessingToastProps {
  title: string;
  message: string;
  progress?: number;
}

export function showProcessingToast({ title, message, progress }: ProcessingToastProps) {
  return toast.custom((t) => (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-lg backdrop-blur-sm max-w-sm">
      <div className="relative flex-shrink-0">
        <LogoIcon size="sm" />
        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse-subtle" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground truncate">{title}</h3>
          <LoadingSpinner variant="minimal" size="sm" />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{message}</p>
        {progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  ), {
    duration: Infinity, // Keep showing until manually dismissed
    id: `processing-${title.toLowerCase().replace(/\s+/g, '-')}`, // Unique ID to prevent duplicates
  });
}

export function showSuccessToast(message: string) {
  return toast.custom((t) => (
    <div className="flex items-center gap-3 p-4 bg-card border border-green-200 dark:border-green-800 rounded-lg shadow-lg backdrop-blur-sm max-w-sm">
      <div className="flex-shrink-0">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{message}</p>
      </div>
    </div>
  ), {
    duration: 4000,
  });
}

export function showErrorToast(message: string) {
  return toast.custom((t) => (
    <div className="flex items-center gap-3 p-4 bg-card border border-red-200 dark:border-red-800 rounded-lg shadow-lg backdrop-blur-sm max-w-sm">
      <div className="flex-shrink-0">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{message}</p>
      </div>
    </div>
  ), {
    duration: 5000,
  });
}

export function dismissProcessingToast(id: string) {
  toast.dismiss(`processing-${id.toLowerCase().replace(/\s+/g, '-')}`);
}