"use client"

import React from "react"
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

        {/* Right section - User avatar pushed to end */}
        <div className="flex items-center ml-auto">
          <NavUserNavbar isDark={isDark} />
        </div>
      </div>
    </header>
  )
}