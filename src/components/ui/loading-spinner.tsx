import React from "react";
import { cn } from "@/lib/utils";
import LogoIcon from "@/components/ui/logo-icon";

interface LoadingSpinnerProps {
  className?: string;
  variant?: "default" | "minimal" | "logo" | "dots";
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ 
  className, 
  variant = "default", 
  size = "md",
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  if (variant === "logo") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="relative">
          <div className="animate-pulse duration-1000 flex items-center gap-3">
            <LogoIcon size={size}/>
            <h1 className={cn(
              "font-bold text-foreground",
              size === "sm" && "text-lg",
              size === "md" && "text-xl", 
              size === "lg" && "text-2xl"
            )}>Pista</h1>
          </div>
          <div className="absolute inset-0 animate-pulse-subtle opacity-20 blur-sm">
            <div className="flex items-center gap-3">
              <LogoIcon size={size}/>
              <h1 className={cn(
                "font-bold text-primary",
                size === "sm" && "text-lg",
                size === "md" && "text-xl", 
                size === "lg" && "text-2xl"
              )}>Pista</h1>
            </div>
          </div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex space-x-1">
          <div className={cn(
            "bg-primary rounded-full animate-bounce [animation-delay:-0.3s]",
            size === "sm" && "w-1.5 h-1.5",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-3 h-3"
          )}></div>
          <div className={cn(
            "bg-primary rounded-full animate-bounce [animation-delay:-0.15s]",
            size === "sm" && "w-1.5 h-1.5",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-3 h-3"
          )}></div>
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            size === "sm" && "w-1.5 h-1.5",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-3 h-3"
          )}></div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )} />
    );
  }

  // Default spinner
  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}