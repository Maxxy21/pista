
import {SidebarProvider} from "@/components/ui/sidebar";
import {PitchDetailsSidebar} from "@/components/shared/navigation/pitch-details-sidebar";
import {cookies} from "next/headers";

export default async function PitchDetailsLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <PitchDetailsSidebar />
            {children}
        </SidebarProvider>
    )
}