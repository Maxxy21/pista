"use client"

import { AppSidebar } from "@/components/shared/navigation/app-sidebar"
import { Navbar } from "@/components/shared/navigation/navbar"
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"
import {cookies} from "next/headers";
import { useSearchParams } from "next/navigation";
import { useDashboardState } from "./_hooks/use-dashboard-state";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const { searchValue, setSearchValue } = useDashboardState(searchParams as any);

    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <Navbar title="Dashboard" searchValue={searchValue} setSearchValue={setSearchValue} />
                <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
