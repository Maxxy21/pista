import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const EmptyFavorites = () => {
    return (
        <EmptyState
            title="No favorite pitches!"
            description="Try favoriting a pitch to see it here"
            icon={<Star className="h-7 w-7" />}
            className="min-h-[60vh]"
        />
    );
};
