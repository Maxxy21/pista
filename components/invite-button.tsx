"use client"

import {Plus, UserPlus} from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {dark} from "@clerk/themes";

interface InviteButtonProps {
    isDark?: boolean;
}

export const InviteButton = ({ isDark }: InviteButtonProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton >
                            <UserPlus/>
                            <span>Invite members</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                <OrganizationProfile
                    appearance={{ baseTheme: isDark ? dark : undefined }}
                    routing="hash"
                />
            </DialogContent>
        </Dialog>
    );
};