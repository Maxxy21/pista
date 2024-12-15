import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {PitchDetailsSidebar} from "@/components/pitch-details-sidebar";

export default function PitchDetailsLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <PitchDetailsSidebar/>
            {children}
        </SidebarProvider>
    )
}