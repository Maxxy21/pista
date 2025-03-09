import { EmptyState } from "@/components/ui/empty-state";
import { NewPitchButton } from "@/app/dashboard/components/new-pitch-button";

interface EmptyPitchesProps {
    orgId: string;
}

export const EmptyPitches = ({ orgId }: EmptyPitchesProps) => {
    return (
        <EmptyState
            title="Create your first pitch!"
            description="Start by uploading or writing your pitch"
            imageSrc="/empty-favorites.svg"
            imageAlt="No pitches"
            imageSize={110}
            action={
                <NewPitchButton 
                    orgId={orgId}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                />
            }
        />
    );
}; 