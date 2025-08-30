"use client"

import { AppSidebar } from "@/components/shared/navigation/app-sidebar"
import { DashboardNavbar } from "./_components/dashboard-navbar"
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"
import {cookies} from "next/headers";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                <DashboardNavbar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}