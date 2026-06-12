"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OrgAvatarProps {
  name: string;
  imageUrl?: string | null;
  /** Clerk's `organization.hasImage` — false for auto-generated avatars. */
  hasImage?: boolean;
  /** Box size in px. */
  size?: number;
  className?: string;
}

/**
 * Organization avatar. Renders the uploaded logo only when the org actually
 * has one (`hasImage`); otherwise renders a warm gold initial so generated
 * Clerk avatars never introduce off-palette colors.
 */
export function OrgAvatar({ name, imageUrl, hasImage, size = 28, className }: OrgAvatarProps) {
  const showImage = Boolean(hasImage && imageUrl);
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border",
        className
      )}
      style={{ height: size, width: size }}
    >
      {showImage ? (
        <Image
          src={imageUrl as string}
          alt={name}
          width={size}
          height={size}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-display font-semibold uppercase leading-none"
          style={{
            background: "hsl(var(--gold))",
            color: "hsl(var(--gold-foreground))",
            fontSize: Math.round(size * 0.45),
          }}
        >
          {name?.charAt(0) || "O"}
        </span>
      )}
    </div>
  );
}
