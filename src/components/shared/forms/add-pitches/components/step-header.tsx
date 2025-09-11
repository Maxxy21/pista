"use client";

import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: number;
}

export function StepHeader({ icon, title, description, progress }: StepHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <DialogHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md">{icon}</div>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-1">{description}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="px-6 pb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{progress === 50 ? "Step 1 of 2" : "Step 2 of 2"}</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
}

