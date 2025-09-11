"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PersonalWorkspaceAvatarProps {
  className?: string;
  label?: string;
}

export function PersonalWorkspaceAvatar({ className, label = "P" }: PersonalWorkspaceAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[10px] font-bold",
        className
      )}
    >
      {label}
    </div>
  );
}

