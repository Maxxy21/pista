"use client"

import {UserPlus} from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {dark} from "@clerk/themes";

interface InviteButtonProps {
    isDark?: boolean;
}

export const InviteButton = ({ isDark }: InviteButtonProps) => {
    const { state } = useSidebar();
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton tooltip={state === "collapsed" ? "Invite members" : undefined}>
                    <UserPlus />
                    <span>Invite members</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                <VisuallyHidden>
                    <DialogTitle>Organization Management</DialogTitle>
                </VisuallyHidden>
                <OrganizationProfile
                    appearance={{ baseTheme: isDark ? dark : undefined }}
                    routing="hash"
                />
            </DialogContent>
        </Dialog>
    );
};