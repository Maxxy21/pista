import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const EmptySearch = () => {
    return (
        <EmptyState
            title="No results found"
            description="We couldn't find any pitches matching your search. Try adjusting your search terms or filters."
            icon={<SearchX className="h-7 w-7" />}
            className="min-h-[60vh]"
        />
    );
};
