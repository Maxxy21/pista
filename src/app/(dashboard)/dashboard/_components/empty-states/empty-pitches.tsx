import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { NewPitchButton } from "../new-pitch-button";

interface EmptyPitchesProps {
    orgId?: string;
}

export const EmptyPitches = ({ orgId }: EmptyPitchesProps) => {
    return (
        <EmptyState
            title="Create your first pitch!"
            description="Start by uploading or writing your pitch"
            icon={<FileText className="h-7 w-7" />}
            className="min-h-[60vh]"
            action={<NewPitchButton orgId={orgId} variant="gold" showIcon />}
        />
    );
};
