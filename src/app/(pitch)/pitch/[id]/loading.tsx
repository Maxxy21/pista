import { SidebarInset } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PitchLoading() {
    return (
        <SidebarInset className="h-screen bg-background">
            <div className="flex h-full items-center justify-center">
                <LoadingSpinner variant="logo" size="lg" text="Loading pitch details..." />
            </div>
        </SidebarInset>
    );
}
