"use client";

import * as React from "react";
import Image from "next/image";
import {ChevronsUpDown, Plus} from "lucide-react";
import {useOrganization, useOrganizationList} from "@clerk/nextjs";
import {CreateOrganization} from "@clerk/nextjs";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import {useTheme} from "next-themes";
import {dark} from "@clerk/themes";

interface TeamSwitcherProps {
    isDark?: boolean;
}

export function TeamSwitcher({isDark}: TeamSwitcherProps) {
    const {isMobile} = useSidebar();
    const {organization} = useOrganization();
    const {userMemberships, setActive} = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    const organizations = userMemberships.data?.map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        imageUrl: membership.organization.imageUrl,
    })) || [];


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {organization && (
                                <>

                                    <div
                                        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Image
                                            src={organization.imageUrl}
                                            alt={organization.name}
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {organization.name}
                    </span>
                                    </div>
                                </>
                            )}
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizations
                        </DropdownMenuLabel>
                        {organizations.map((org, index) => (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => setActive?.({organization: org.id})}
                                className="gap-2 p-2"
                            >
                                <div
                                    className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                                    <Image
                                        src={org.imageUrl}
                                        alt={org.name}
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span className="flex-1">{org.name}</span>
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem className="gap-2 p-2" onSelect={(e) => e.preventDefault()}>
                                    <div
                                        className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <Plus className="size-4"/>
                                    </div>
                                    <div className="font-medium text-muted-foreground">
                                        Create Organization
                                    </div>
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="p-0 bg-transparent border-none max-w-[430px]">
                                <CreateOrganization appearance={{baseTheme: isDark ? dark : undefined}}
                                                    routing={"hash"}/>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}