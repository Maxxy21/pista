"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus, Check, Building2 } from "lucide-react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TeamSwitcherProps {
    isDark?: boolean;
    className?: string;
}

export function TeamSwitcher({ isDark, className }: TeamSwitcherProps) {
    const { isMobile, state } = useSidebar();
    const { organization } = useOrganization();
    const { user } = useUser();
    const { userMemberships, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme();
    const isDarkTheme = isDark ?? resolvedTheme === "dark";
    const [pending, setPending] = React.useState<string | "personal" | null>(null);

    const organizations =
        userMemberships.data?.map((membership) => ({
            id: membership.organization.id,
            name: membership.organization.name,
            imageUrl: membership.organization.imageUrl,
            role: membership.role,
        })) ?? [];

    const handleSetActive = React.useCallback(
        async (orgId: string | null) => {
            try {
                setPending(orgId ?? "personal");
                await setActive?.({ organization: orgId });

                // Update workspace context in URL: remove or set ctx
                const current = new URLSearchParams(Array.from(searchParams.entries()));
                if (orgId) current.set("ctx", "org");
                else current.delete("ctx");
                const q = current.toString();
                router.replace(`${pathname}${q ? `?${q}` : ""}`);
            } finally {
                setPending(null);
            }
        },
        [pathname, router, searchParams, setActive]
    );

    const isPersonalActive = !organization;

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
                            tooltip={state === "collapsed" ? "Switch workspace" : undefined}
                            aria-label={
                                organization
                                    ? `Current organization: ${organization.name}`
                                    : "Personal Workspace"
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
                                    <div className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border">
                                        {user?.imageUrl ? (
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.fullName ?? "You"}
                                                width={28}
                                                height={28}
                                                className="aspect-square h-full w-full"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid flex-1 text-left text-sm">
                                        <span className="truncate font-medium">Personal Workspace</span>
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
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Personal</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => handleSetActive(null)}
                            disabled={pending !== null}
                            className={cn(
                                "gap-2 p-2 rounded-md",
                                isPersonalActive && "bg-primary/10"
                            )}
                            role="menuitemradio"
                            aria-checked={isPersonalActive}
                        >
                            <div className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border">
                                {user?.imageUrl ? (
                                    <Image
                                        src={user.imageUrl}
                                        alt={user.fullName ?? "You"}
                                        width={28}
                                        height={28}
                                        className="aspect-square h-full w-full"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">Personal Workspace</p>
                                {user?.primaryEmailAddress?.emailAddress && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user.primaryEmailAddress.emailAddress}
                                    </p>
                                )}
                            </div>
                            {isPersonalActive && (
                                <Check className="h-4 w-4 text-primary ml-2" />
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Organizations</DropdownMenuLabel>
                        <div className="max-h-60 overflow-y-auto">
                            {userMemberships.isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={`skeleton-${i}`}
                                        className="flex items-center gap-2 p-2"
                                    >
                                        <div className="h-7 w-7 rounded-md border border-border bg-muted animate-pulse" />
                                        <div className="flex-1 space-y-1">
                                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : organizations.length === 0 ? (
                                <div className="px-2 py-3 text-xs text-muted-foreground">
                                    You don’t belong to any organizations yet.
                                </div>
                            ) : (
                                organizations.map((org) => (
                                    <DropdownMenuItem
                                        key={org.id}
                                        onClick={() => handleSetActive(org.id)}
                                        disabled={pending !== null}
                                        className={cn(
                                            "gap-2 p-2 rounded-md",
                                            organization?.id === org.id && "bg-primary/10"
                                        )}
                                        role="menuitemradio"
                                        aria-checked={organization?.id === org.id}
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
                                ))
                            )}
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
                                        baseTheme: isDarkTheme ? dark : undefined,
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
