import { DashboardLayoutWrapper } from "@/components/dashboard-layout-wrapper";
import {cookies} from "next/headers";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <DashboardLayoutWrapper defaultOpen={defaultOpen}>
            {children}
        </DashboardLayoutWrapper>
    )
}