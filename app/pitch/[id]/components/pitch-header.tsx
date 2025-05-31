import { Button } from "@/components/ui/button";
import { ChevronLeft, PencilLine, Share2 } from "lucide-react";
import Link from "next/link";
import { useRenameModal } from "@/store/use-rename-modal";
import { copyToClipboard } from "./utils";
import { ExportPDFButton } from "./pdf-export";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface Evaluation {
    overallScore: number;
    overallFeedback: string;
    evaluations: Array<{
        criteria: string;
        score: number;
        comment: string;
        strengths: string[];
        improvements: string[];
    }>;
}

interface PitchHeaderProps {
    data: {
        _id: Id<"pitches">;
        title: string;
        _creationTime: number;
        text: string;
        evaluation: Evaluation;
    };
}

export const PitchHeader: React.FC<PitchHeaderProps> = React.memo(({ data }) => {
    const { onOpen } = useRenameModal();

    const handleEdit = React.useCallback(() => {
        onOpen(data._id, data.title);
    }, [onOpen, data._id, data.title]);

    const handleShare = React.useCallback(() => {
        copyToClipboard(data.evaluation.overallFeedback);
    }, [data.evaluation.overallFeedback]);

    return (
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b w-full">
            <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" passHref legacyBehavior>
                            <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Back to dashboard">
                                <a>
                                    <ChevronLeft className="h-5 w-5" />
                                </a>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold truncate" title={data.title}>
                                {data.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Created {new Date(data._creationTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleEdit}
                            aria-label="Edit pitch title"
                        >
                            <PencilLine className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleShare}
                            aria-label="Share overall feedback"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                        <ExportPDFButton data={data} />
                    </div>
                </div>
            </div>
        </header>
    );
});
PitchHeader.displayName = "PitchHeader";