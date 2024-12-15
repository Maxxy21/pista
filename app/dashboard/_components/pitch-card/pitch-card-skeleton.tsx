"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PitchCardSkeleton = () => {
    return (
        <Card className="h-[200px] w-full bg-neutral-900/50">
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-[180px]" />
                        <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="pt-1">
                    <Skeleton className="h-8 w-[60px] rounded-md" />
                </div>
            </div>
        </Card>
    );
};