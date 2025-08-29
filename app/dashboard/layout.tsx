import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
} from "@/components/ui/sidebar"
import {cookies} from "next/headers";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </SidebarProvider>
    )
}