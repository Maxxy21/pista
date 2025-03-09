import { EmptyState } from "@/components/ui/empty-state";

export const EmptySearch = () => {
    return (
        <EmptyState
            title="No results found"
            description="We couldn't find any pitches matching your search"
            imageSrc="/empty-search.svg"
            imageAlt="No search results"
            className="h-full"
        />
    );
}; 