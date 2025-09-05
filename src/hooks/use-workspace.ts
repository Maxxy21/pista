"use client"

import { useSearchParams } from "next/navigation"
import { useOrganization, useUser } from "@clerk/nextjs"

export type WorkspaceMode = "user" | "org"

export function useWorkspace() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const params = useSearchParams()

  const forced = params.get("ctx") as WorkspaceMode | null
  // Default to org mode if a Clerk organization is active and no explicit ctx override is present.
  const mode: WorkspaceMode = forced ?? (organization ? "org" as const : "user")

  return {
    mode,
    userId: user?.id || null,
    orgId: organization?.id || null,
  }
}
