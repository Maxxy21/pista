import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
                <AppSidebar/>
                <div className="flex-1 overflow-auto w-full">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}