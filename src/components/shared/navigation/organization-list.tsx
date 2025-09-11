"use client";

import React from "react";
import Image from "next/image";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrgItem {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
}

interface OrganizationListProps {
  items: OrgItem[];
  activeId?: string | null;
  pending?: boolean;
  onSelect: (id: string) => void;
}

export function OrganizationList({ items, activeId, pending, onSelect }: OrganizationListProps) {
  if (items.length === 0) return null;
  return (
    <div className="max-h-60 overflow-y-auto">
      {items.map((org) => (
        <DropdownMenuItem
          key={org.id}
          onClick={() => onSelect(org.id)}
          disabled={pending}
          className={cn("gap-2 p-2 rounded-md", activeId === org.id && "bg-primary/10")}
          role="menuitemradio"
          aria-checked={activeId === org.id}
        >
          <div className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border">
            <Image src={org.imageUrl} alt={org.name} width={28} height={28} className="aspect-square h-full w-full" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{org.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{org.role.toLowerCase()}</p>
          </div>
          {activeId === org.id && <Check className="h-4 w-4 text-primary ml-2" />}
        </DropdownMenuItem>
      ))}
    </div>
  );
}

