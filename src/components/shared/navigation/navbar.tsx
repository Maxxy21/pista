"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { NavUserNavbar } from "./nav-user-navbar"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { SearchForm } from "@/components/shared/forms/search-form"

interface NavbarProps {
  title?: string
  rateLimit?: {
    used: number
    total: number
    resetTime?: Date
  }
  searchValue?: string
  setSearchValue?: (value: string) => void
}

export function Navbar({ title = "Dashboard", rateLimit, searchValue, setSearchValue }: NavbarProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const rateLimitPercentage = rateLimit ? (rateLimit.used / rateLimit.total) * 100 : 0
  const isNearLimit = rateLimitPercentage > 80

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Center section - Search (Miro-style) */}
        {searchValue !== undefined && setSearchValue && (
          <div className="flex-1 flex justify-center max-w-xl mx-4">
            <SearchForm
              value={searchValue}
              onChange={setSearchValue}
              className="w-full max-w-md"
              placeholder="Search pitches..."
              variant="standalone"
              autoFocus={false}
            />
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Rate Limit Display */}
          {rateLimit && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">API Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-muted rounded-full h-2">
                  <Progress 
                    value={rateLimitPercentage} 
                    className={`h-2 transition-colors ${
                      isNearLimit ? "text-destructive" : "text-primary"
                    }`}
                  />
                </div>
                <Badge 
                  variant={isNearLimit ? "destructive" : "secondary"}
                  className="text-xs font-mono"
                >
                  {rateLimit.used}/{rateLimit.total}
                </Badge>
              </div>
            </div>
          )}

          {/* User Profile */}
          <NavUserNavbar isDark={isDark} />
        </div>
      </div>
    </header>
  )
}