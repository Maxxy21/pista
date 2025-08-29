import { Button } from "@/components/ui/button";
import { ChevronLeft, PencilLine, Share2 } from "lucide-react";
import Link from "next/link";
import { useRenameModal } from "@/store/use-rename-modal";
import { copyToClipboard } from "../utils";
import { ExportPDFButton } from "../export/pdf-export";
import { UniversalPitchData } from "@/lib/types/pitch";
import { getOverallFeedback } from "@/lib/utils/evaluation-utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface PitchHeaderProps {
    data: UniversalPitchData;
}

export const PitchHeader: React.FC<PitchHeaderProps> = React.memo(({ data }) => {
    const { onOpen } = useRenameModal();

    const handleEdit = React.useCallback(() => {
        onOpen(data._id, data.title);
    }, [onOpen, data._id, data.title]);

    const handleShare = React.useCallback(() => {
        const feedback = getOverallFeedback(data.evaluation);
        const feedbackText = typeof feedback === 'string' ? feedback : feedback.overallAssessment.summary;
        copyToClipboard(feedbackText);
    }, [data.evaluation]);

    return (
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b w-full">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Link href="/dashboard" passHref legacyBehavior>
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-7 w-7" aria-label="Back to dashboard">
                        <a>
                            <ChevronLeft className="h-4 w-4" />
                        </a>
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold truncate" title={data.title}>
                        {data.title}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Created {new Date(data._creationTime).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-8"
                        onClick={handleEdit}
                        aria-label="Edit pitch title"
                    >
                        <PencilLine className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-8"
                        onClick={handleShare}
                        aria-label="Share overall feedback"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <ExportPDFButton data={data} />
                </div>
            </div>
        </header>
    );
});
PitchHeader.displayName = "PitchHeader";