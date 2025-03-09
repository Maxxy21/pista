import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
} from "@/components/ui/sidebar"
import {cookies} from "next/headers";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <div className="relative flex min-h-screen w-full">
                <AppSidebar/>
                <div className="flex-1 overflow-auto w-full">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}