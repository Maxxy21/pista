"use client"

import React, { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { NavUserNavbar } from "@/components/shared/navigation/nav-user-navbar"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { SearchForm } from "@/components/shared/forms/search-form"
import { useDashboardState } from "../_hooks/use-dashboard-state"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"

export function DashboardNavbar() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const searchParams = useSearchParams()
  
  const { searchValue, setSearchValue } = useDashboardState(searchParams)


  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-2 md:gap-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hidden sm:block">
            Dashboard
          </h1>
        </div>

        {/* Center section - Search (responsive) */}
        <div className="flex-1 flex justify-center mx-4 md:mx-8 max-w-none">
          <SearchForm
            value={searchValue}
            onChange={setSearchValue}
            className="w-full max-w-sm md:max-w-md lg:max-w-lg"
            placeholder="Search pitches..."
            variant="standalone"
            autoFocus={false}
          />
        </div>

        {/* Right section - Export + User */}
        <div className="flex items-center gap-3 ml-auto">
          <ExportCsvButton />
          <NavUserNavbar isDark={isDark} />
        </div>
      </div>
    </header>
  )
}

function ExportCsvButton() {
  const [exportRequested, setExportRequested] = useState(false)
  const { organization } = useOrganization()
  const pitches = useQuery(
    api.pitches.getFilteredPitches,
    organization ? { orgId: organization.id } : "skip"
  ) as any[] | "skip" | undefined

  useEffect(() => {
    if (!exportRequested) return
    if (!organization || !Array.isArray(pitches)) return

    const rows: string[] = []
    const headers = [
      'id','title','type','author','createdAt','overallScore','evaluatedAt','modelVersion','promptVersion','policyVersion'
    ]
    rows.push(headers.join(','))

    for (const p of pitches) {
      const id = String(p._id)
      const title = JSON.stringify(p.title ?? "")
      const type = JSON.stringify(p.type ?? "")
      const author = JSON.stringify(p.authorName ?? "")
      const createdAt = new Date(p.createdAt).toISOString()

      const ev = p.evaluation || {}
      const overallScore = String(ev.overallScore ?? '')
      const meta = ev.metadata || {}
      const evaluatedAt = meta.evaluatedAt ?? ''
      const modelVersion = JSON.stringify(meta.modelVersion ?? '')
      const promptVersion = JSON.stringify(meta.promptVersion ?? '')
      const policyVersion = JSON.stringify(meta.policyVersion ?? '')

      rows.push([
        id,
        title,
        type,
        author,
        createdAt,
        overallScore,
        evaluatedAt,
        modelVersion,
        promptVersion,
        policyVersion,
      ].join(','))
    }

    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pitches-export-${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportRequested(false)
  }, [exportRequested, organization, pitches])

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3 font-medium hover:bg-muted/50 hover:border-muted-foreground/30"
      onClick={() => setExportRequested(true)}
      aria-label="Export CSV"
      disabled={!organization || !Array.isArray(pitches)}
    >
      Export CSV
    </Button>
  )
}
