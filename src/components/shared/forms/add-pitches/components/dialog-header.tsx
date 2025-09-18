"use client";

import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DialogHeaderProps {
  title: string;
  description: string;
  progress: number;
}

export function DialogHeader({ title, description, progress }: DialogHeaderProps) {
  return (
    <div className="px-6 py-4 border-b bg-muted/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}