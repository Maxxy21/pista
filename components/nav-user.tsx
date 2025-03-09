"use client"

import {ChevronsUpDown, LogOut, Settings, Languages, CreditCard, Sun, Moon, Laptop, User, Shield} from 'lucide-react'
import {useClerk, useUser} from "@clerk/nextjs"
import {useTheme} from "next-themes"
import { motion } from "framer-motion";

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
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button"
import {dark} from "@clerk/themes"
import {useRouter} from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface NavUserProps {
    isDark?: boolean
    className?: string
}

export function NavUser({isDark, className}: NavUserProps) {
    const {isMobile} = useSidebar()
    const {user} = useUser()
    const {signOut} = useClerk()
    const {setTheme, theme} = useTheme()
    const {openUserProfile} = useClerk();
    const router = useRouter()

    if (!user) return null

    const handleSignOut = async () => {
        try {
            await signOut({ redirectUrl: '/' });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 ring-2 ring-white/10">
                                <AvatarImage src={user.imageUrl} alt={user.fullName || ''}/>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                  {user.fullName}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {user.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>
                            <motion.div
                                animate={{ rotate: 180 }}
                                initial={{ rotate: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-auto"
                            >
                                <ChevronsUpDown className="size-4 text-muted-foreground" />
                            </motion.div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg border-border"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
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
                        <DropdownMenuItem
                            onClick={() => openUserProfile({appearance: {baseTheme: isDark ? dark : undefined}})}
                            className="gap-2"
                        >
                            <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                            Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <Shield className="mr-2 h-4 w-4 text-muted-foreground"/>
                            Privacy & Security
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="gap-2">
                                    {theme === "light" && <Sun className="mr-2 h-4 w-4 text-muted-foreground"/>}
                                    {theme === "dark" && <Moon className="mr-2 h-4 w-4 text-muted-foreground"/>}
                                    {theme === "system" && <Laptop className="mr-2 h-4 w-4 text-muted-foreground"/>}
                                    <span>Theme</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                                        <Sun className="mr-2 h-4 w-4"/>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                                        <Moon className="mr-2 h-4 w-4"/>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                                        <Laptop className="mr-2 h-4 w-4"/>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-500 focus:text-red-500">
                            <LogOut className="mr-2 h-4 w-4"/>
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}