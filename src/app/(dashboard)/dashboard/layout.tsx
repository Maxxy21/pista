import { cookies } from "next/headers"
import { DashboardLayoutClient } from "./dashboard-layout-client"

export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <DashboardLayoutClient defaultOpen={defaultOpen}>
            {children}
        </DashboardLayoutClient>
    )
}
