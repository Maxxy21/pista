import { Skeleton } from "@/components/ui/skeleton";
import { StatsSkeleton, PitchesGridSkeleton } from "./_components/dashboard-skeletons";

export default function DashboardLoading() {
    return (
        <div className="min-h-0 flex-1 bg-background flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 md:px-6">
                <div className="flex items-center gap-5">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="p-4 md:p-6 pb-0">
                    <StatsSkeleton />
                </div>
                <div className="p-4 md:p-6 pt-0">
                    <PitchesGridSkeleton />
                </div>
            </div>
        </div>
    );
}
