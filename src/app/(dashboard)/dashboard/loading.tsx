import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col h-full">
            {/* Navbar skeleton */}
            <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur h-16 flex items-center gap-3 px-6">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-px" />
                <Skeleton className="h-5 w-28" />
                <div className="flex-1" />
                <Skeleton className="h-8 w-64 rounded-full" />
                <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            <div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">
                {/* Stats row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-7 w-16" />
                        </div>
                    ))}
                </div>

                {/* Filters + tabs */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-32 rounded-full" />
                    <Skeleton className="h-9 w-32 rounded-full" />
                    <Skeleton className="h-9 w-32 rounded-full" />
                </div>

                {/* Pitch cards grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card p-4 space-y-3 h-[180px]">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <div className="flex-1" />
                            <div className="flex items-center justify-between pt-4">
                                <Skeleton className="h-5 w-12 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
