"use client";

import React from "react";
import { PersonalWorkspaceAvatar } from "./personal-workspace-avatar";

interface PersonalWorkspaceLabelProps {
  subtitleEmail?: string | null;
}

export function PersonalWorkspaceLabel({ subtitleEmail }: PersonalWorkspaceLabelProps) {
  return (
    <>
      <PersonalWorkspaceAvatar />
      <div className="grid flex-1 text-left text-sm overflow-hidden">
        <span className="truncate font-medium">Personal Workspace</span>
        {subtitleEmail ? (
          <span className="truncate text-xs text-muted-foreground">{subtitleEmail}</span>
        ) : null}
      </div>
    </>
  );
}

