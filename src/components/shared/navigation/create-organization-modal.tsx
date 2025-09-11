"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDark?: boolean;
}

export function CreateOrganizationModal({ open, onOpenChange, isDark }: CreateOrganizationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent border-none max-w-[430px]">
        <CreateOrganization appearance={getClerkAppearance(isDark)} routing="hash" />
      </DialogContent>
    </Dialog>
  );
}
