import { Skeleton } from "@/components/ui/skeleton";

export default function PitchLoading() {
    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header skeleton */}
            <div className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur-sm h-16 flex items-center gap-3 px-6">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-px" />
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="container mx-auto py-6 px-4 sm:px-6 space-y-10">
                {/* Transcript */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-[180px] w-full rounded-lg" />
                </div>

                {/* Score overview */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-36" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-[120px] rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Detailed analysis cards */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-44" />
                    <div className="grid gap-6 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-[200px] rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
