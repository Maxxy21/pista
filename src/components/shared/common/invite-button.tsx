"use client"

import React from "react";
import { UserPlus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { CreateOrganizationModal } from "@/components/shared/navigation/create-organization-modal";
import { useWorkspace } from "@/hooks/use-workspace";

export const InviteButton = () => {
    const { state } = useSidebar();
    const workspace = useWorkspace();
    const [createOpen, setCreateOpen] = React.useState(false);

    if (workspace.mode === 'org') {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <SidebarMenuButton tooltip={state === "collapsed" ? 'Invite members' : undefined}>
                        <UserPlus />
                        <span>Invite members</span>
                    </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                    <VisuallyHidden>
                        <DialogTitle>Organization</DialogTitle>
                    </VisuallyHidden>
                    <OrganizationProfile appearance={getClerkAppearance()} routing="hash" />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <SidebarMenuButton
                tooltip={state === "collapsed" ? 'Create Organization' : undefined}
                onClick={() => setCreateOpen(true)}
            >
                <UserPlus />
                <span>Create Organization</span>
            </SidebarMenuButton>
            <CreateOrganizationModal open={createOpen} onOpenChange={setCreateOpen} />
        </>
    );
};
