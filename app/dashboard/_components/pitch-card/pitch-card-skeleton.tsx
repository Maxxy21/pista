"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PitchCardSkeleton = () => {
    return (
        <div className="group h-[250px]">
            <Card className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-all duration-200 bg-background border-border">
                <CardHeader className="flex-none space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-[180px]" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-8" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </CardContent>
                <CardFooter className="flex-none justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8" />
                </CardFooter>
            </Card>
        </div>
    );
};