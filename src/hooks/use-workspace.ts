"use client"

import { useSearchParams } from "next/navigation"
import { useOrganization, useUser } from "@clerk/nextjs"

export type WorkspaceMode = "user" | "org"

export function useWorkspace() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const params = useSearchParams()

  const forced = params.get("ctx") as WorkspaceMode | null
  const mode: WorkspaceMode = forced ?? "user"

  return {
    mode,
    userId: user?.id || null,
    orgId: organization?.id || null,
  }
}

