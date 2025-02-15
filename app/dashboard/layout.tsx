import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen">
                <AppSidebar/>
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}