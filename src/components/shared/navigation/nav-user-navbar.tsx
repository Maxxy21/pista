"use client"

import { LogOut, User, Download, Check } from 'lucide-react'
import { toast } from "sonner";
import {useClerk, useUser, useOrganization, useOrganizationList} from "@clerk/nextjs"
import {useTheme} from "next-themes"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {dark} from "@clerk/themes"
// import {useRouter} from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useWorkspace } from "@/hooks/use-workspace";
import { ThemeMenu } from "./theme-menu";

interface NavUserNavbarProps {
    isDark?: boolean
    className?: string
}

export function NavUserNavbar({isDark, className}: NavUserNavbarProps) {
    const {user} = useUser()
    const {signOut, openUserProfile} = useClerk()
    const {setTheme, theme} = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { organization } = useOrganization()
    const workspace = useWorkspace()
    const [exportRequested, setExportRequested] = useState(false)
    const { userMemberships, setActive } = useOrganizationList({ userMemberships: { infinite: true } })
    const pitches = useQuery(
      api.pitches.getFilteredPitches,
      workspace.mode === 'org' && workspace.orgId ? { orgId: workspace.orgId } : (workspace.userId ? { ownerUserId: workspace.userId } : "skip")
    ) as any[] | "skip" | undefined

    if (!user) return null

    const setCtx = (mode: 'user' | 'org') => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (mode === 'user') current.delete('ctx')
        else current.set('ctx', 'org')
        const q = current.toString()
        router.replace(`${pathname}${q ? `?${q}` : ''}`)
    }

    const handleSignOut = async () => {
        try {
            await signOut({ redirectUrl: '/' });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        if (!exportRequested) return
        if (!organization || !Array.isArray(pitches)) return

        const toastId = toast.loading("Preparing CSV…")
        const rows: string[] = []
        const headers = [
          'id','title','type','author','createdAt','overallScore','evaluatedAt','modelVersion','promptVersion','policyVersion'
        ]
        rows.push(headers.join(','))

        try {
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
          toast.success(`Exported ${Math.max(rows.length - 1, 0)} rows`, { id: toastId })
        } catch (e) {
          toast.error("Export failed", { id: toastId })
        } finally {
          setExportRequested(false)
        }
    }, [exportRequested, organization, pitches])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "h-8 w-8 p-0 rounded-full hover:bg-muted/40 data-[state=open]:bg-muted/60",
                        className
                    )}
                >
                    <Avatar className="h-8 w-8 ring-2 ring-white/10">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || ''}/>
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 rounded-lg shadow-lg border-border"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                        <Avatar className="h-9 w-9 ring-2 ring-white/10">
                            <AvatarImage src={user.imageUrl} alt={user.fullName || ''} className="object-cover"/>
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <div className="flex items-center gap-2">
                                <span className="truncate font-semibold">
                                    {user.fullName}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="h-5 text-[10px] bg-primary/5 text-primary border-primary/20 font-medium"
                                >
                                    Pro
                                </Badge>
                            </div>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                
                {/* Organization submenu removed; use sidebar team switcher */}
                <DropdownMenuItem
                    onClick={() => openUserProfile({appearance: {baseTheme: isDark ? dark : undefined}})}
                    className="gap-2"
                >
                    <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                    Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="gap-2"
                    onClick={() => setExportRequested(true)}
                    disabled={!organization || !Array.isArray(pitches)}
                >
                    <Download className="mr-2 h-4 w-4 text-muted-foreground"/>
                    Export CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                  <ThemeMenu theme={theme} setTheme={setTheme} />
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4"/>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
