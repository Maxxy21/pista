"use client";

import React from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useOrganization } from "@clerk/nextjs";

export function WorkspaceBadge() {
  const workspace = useWorkspace();
  const { organization } = useOrganization();

  if (workspace.mode !== "org") return null;

  return (
    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex h-6 items-center rounded-md border px-2 bg-muted/40">
        {organization?.name || "Organization"}
      </span>
    </div>
  );
}

