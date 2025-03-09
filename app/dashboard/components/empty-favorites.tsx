import { EmptyState } from "@/components/ui/empty-state";

export const EmptyFavorites = () => {
    return (
        <EmptyState
            title="No favorite pitches!"
            description="Try favoriting a pitch to see it here"
            imageSrc="/empty-favorites.svg"
            imageAlt="No favorites"
            className="h-[calc(100vh-16rem)]"
        />
    );
}; 