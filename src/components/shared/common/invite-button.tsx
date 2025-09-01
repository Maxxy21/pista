"use client"

import {UserPlus, Building2} from "lucide-react";
import { OrganizationProfile, CreateOrganization } from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {dark} from "@clerk/themes";
import { useWorkspace } from "@/hooks/use-workspace";

interface InviteButtonProps {
    isDark?: boolean;
}

export const InviteButton = ({ isDark }: InviteButtonProps) => {
    const { state } = useSidebar();
    const workspace = useWorkspace();
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton tooltip={state === "collapsed" ? (workspace.mode === 'org' ? 'Invite members' : 'Create Team') : undefined}>
                    <UserPlus />
                    <span>{workspace.mode === 'org' ? 'Invite members' : 'Create Team'}</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                <VisuallyHidden>
                    <DialogTitle>Organization</DialogTitle>
                </VisuallyHidden>
                {workspace.mode === 'org' ? (
                    <OrganizationProfile
                        appearance={{ baseTheme: isDark ? dark : undefined }}
                        routing="hash"
                    />
                ) : (
                    <CreateOrganization
                        appearance={{ baseTheme: isDark ? dark : undefined }}
                        routing="hash"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
