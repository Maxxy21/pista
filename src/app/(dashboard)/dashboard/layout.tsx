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
            <SidebarInset>
                <Navbar title="Dashboard" searchValue={searchValue} setSearchValue={setSearchValue} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
