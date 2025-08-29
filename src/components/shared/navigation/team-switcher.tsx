"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus, Check, Building2 } from "lucide-react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { CreateOrganization } from "@clerk/nextjs";
import { motion } from "framer-motion";

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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";

interface TeamSwitcherProps {
    isDark?: boolean;
    className?: string;
}

export function TeamSwitcher({ isDark, className }: TeamSwitcherProps) {
    const { isMobile } = useSidebar();
    const { organization } = useOrganization();
    const { userMemberships, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    const organizations =
        userMemberships.data?.map((membership) => ({
            id: membership.organization.id,
            name: membership.organization.name,
            imageUrl: membership.organization.imageUrl,
            role: membership.role,
        })) ?? [];

    const handleSetActive = React.useCallback(
        (orgId: string) => {
            setActive?.({ organization: orgId });
        },
        [setActive]
    );

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                "bg-muted/40 border border-border shadow-sm rounded-lg data-[state=open]:bg-muted/60",
                                className
                            )}
                            aria-label={
                                organization
                                    ? `Current organization: ${organization.name}`
                                    : "Select Organization"
                            }
                        >
                            {organization ? (
                                <>
                                    <div className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border">
                                        <Image
                                            src={organization.imageUrl}
                                            alt={organization.name}
                                            width={28}
                                            height={28}
                                            className="aspect-square h-full w-full"
                                        />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm">
                                        <span className="truncate font-medium">
                                            {organization.name}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm">
                                        <span className="truncate font-medium">
                                            Select Organization
                                        </span>
                                    </div>
                                </>
                            )}
                            <motion.div
                                whileTap={{ rotate: 180 }}
                                transition={{ duration: 0.2 }}
                                className="ml-auto"
                            >
                                <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </motion.div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-1 shadow-lg border-border"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                            Organizations
                        </DropdownMenuLabel>
                        <div className="max-h-60 overflow-y-auto">
                            {organizations.map((org) => (
                                <DropdownMenuItem
                                    key={org.id}
                                    onClick={() => handleSetActive(org.id)}
                                    className={cn(
                                        "gap-2 p-2 rounded-md",
                                        organization?.id === org.id && "bg-primary/10"
                                    )}
                                    aria-current={organization?.id === org.id}
                                >
                                    <div className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border">
                                        <Image
                                            src={org.imageUrl}
                                            alt={org.name}
                                            width={28}
                                            height={28}
                                            className="aspect-square h-full w-full"
                                        />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{org.name}</p>
                                        <p className="text-xs text-muted-foreground truncate capitalize">
                                            {org.role.toLowerCase()}
                                        </p>
                                    </div>
                                    {organization?.id === org.id && (
                                        <Check className="h-4 w-4 text-primary ml-2" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator className="my-1" />
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    className="gap-2 p-2 rounded-md focus:bg-primary/10 focus:text-primary"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/70">
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-sm font-medium">
                                        Create Organization
                                    </div>
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="p-0 bg-transparent border-none max-w-[430px]">
                                <CreateOrganization
                                    appearance={{
                                        baseTheme: isDark ? dark : undefined,
                                        elements: {
                                            formButtonPrimary:
                                                "bg-primary text-primary-foreground hover:bg-primary/90",
                                            card: "bg-background border border-border shadow-lg",
                                            headerTitle: "text-xl font-bold",
                                        },
                                    }}
                                    routing="hash"
                                />
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}