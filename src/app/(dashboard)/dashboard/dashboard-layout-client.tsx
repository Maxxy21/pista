"use client"

import { AppSidebar } from "@/components/shared/navigation/app-sidebar"
import { Navbar } from "@/components/shared/navigation/navbar"
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation";
import { useDashboardState } from "./_hooks/use-dashboard-state";

interface DashboardLayoutClientProps {
    children: React.ReactNode
    defaultOpen: boolean
}

export function DashboardLayoutClient({ children, defaultOpen }: DashboardLayoutClientProps) {
    const searchParams = useSearchParams();
    const { searchValue, setSearchValue } = useDashboardState(searchParams as any);

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-hidden flex flex-col">
                <Navbar title="Dashboard" searchValue={searchValue} setSearchValue={setSearchValue} />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}