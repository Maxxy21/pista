"use client"

import { LogOut, User, Download } from 'lucide-react'
import { toast } from "sonner";
import {useClerk, useUser} from "@clerk/nextjs"
import {useTheme} from "next-themes"
import React, { useEffect, useState } from "react";


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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/hooks/use-workspace";
import { ThemeMenu } from "./theme-menu";
import { exportPitchesCsv } from "@/lib/utils/csv-export";

interface NavUserNavbarProps {
    isDark?: boolean
    className?: string
}

export function NavUserNavbar({isDark, className}: NavUserNavbarProps) {
    const {user} = useUser()
    const {signOut, openUserProfile} = useClerk()
    const {setTheme, theme} = useTheme()
    const workspace = useWorkspace()
    const [exportRequested, setExportRequested] = useState(false)
    const pitches = useQuery(
      api.pitches.getFilteredPitches,
      workspace.mode === 'org' && workspace.orgId ? { orgId: workspace.orgId } : (workspace.userId ? { ownerUserId: workspace.userId } : "skip")
    ) as any[] | "skip" | undefined

    const handleSignOut = async () => {
        try {
            await signOut({ redirectUrl: '/' });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        if (!exportRequested) return
        if (!Array.isArray(pitches)) return

        const toastId = toast.loading("Preparing CSV…")
        const { data, error } = exportPitchesCsv(pitches as any[])
        if (error) {
          toast.error("Export failed", { id: toastId })
        } else {
          toast.success(`Exported ${data?.rows ?? 0} rows`, { id: toastId })
        }
        setExportRequested(false)
    }, [exportRequested, pitches])

    if (!user) return null

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
                            </div>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>

                <DropdownMenuItem
                    onClick={() => openUserProfile({appearance: getClerkAppearance(isDark)})}
                    className="gap-2"
                >
                    <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                    Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="gap-2"
                    onClick={() => setExportRequested(true)}
                    disabled={!Array.isArray(pitches) || pitches.length === 0}
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
