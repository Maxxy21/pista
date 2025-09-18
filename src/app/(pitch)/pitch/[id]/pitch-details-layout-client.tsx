"use client";

import {SidebarProvider} from "@/components/ui/sidebar";
import {PitchDetailsSidebar} from "@/components/shared/navigation/pitch-details-sidebar";

interface PitchDetailsLayoutClientProps {
    children: React.ReactNode
    defaultOpen: boolean
}

export function PitchDetailsLayoutClient({ children, defaultOpen }: PitchDetailsLayoutClientProps) {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <PitchDetailsSidebar />
            {children}
        </SidebarProvider>
    )
}