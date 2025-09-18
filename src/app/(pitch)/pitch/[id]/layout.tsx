
import { cookies } from "next/headers"
import { PitchDetailsLayoutClient } from "./pitch-details-layout-client"

export default async function PitchDetailsLayout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <PitchDetailsLayoutClient defaultOpen={defaultOpen}>
            {children}
        </PitchDetailsLayoutClient>
    )
}