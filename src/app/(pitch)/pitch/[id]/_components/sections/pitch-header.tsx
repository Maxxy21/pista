import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { NavUserNavbar } from "@/components/shared/navigation/nav-user-navbar";
import { UniversalPitchData } from "@/lib/types/pitch";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

interface PitchHeaderProps {
    data: UniversalPitchData;
}

export const PitchHeader: React.FC<PitchHeaderProps> = React.memo(({ data }) => {
    // Theme state
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    
    // Inline editing state
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState(data.title);
    
    // API mutation
    const { mutate: updatePitch, pending: updating } = useApiMutation(api.pitches.update);

    // Event handlers for inline editing
    const handleTitleClick = React.useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleTitleSubmit = React.useCallback(async () => {
        // Don't submit if no changes or empty title
        if (title.trim() === data.title || !title.trim()) {
            setTitle(data.title);
            setIsEditing(false);
            return;
        }

        try {
            await updatePitch({ id: data._id, title: title.trim() });
            toast.success("Title updated");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update title");
            setTitle(data.title);
            setIsEditing(false);
        }
    }, [title, data.title, data._id, updatePitch]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSubmit();
        } else if (e.key === 'Escape') {
            setTitle(data.title);
            setIsEditing(false);
        }
    }, [handleTitleSubmit, data.title]);

    const handleBlur = React.useCallback(() => {
        handleTitleSubmit();
    }, [handleTitleSubmit]);

    // Sync title state with prop changes
    React.useEffect(() => {
        setTitle(data.title);
    }, [data.title]);

    return (
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b w-full">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Button asChild variant="ghost" size="icon" className="rounded-full h-7 w-7">
                    <Link href="/dashboard" aria-label="Back to dashboard">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            disabled={updating}
                            className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                        />
                    ) : (
                        <h1 
                            className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors" 
                            title={`${data.title} (click to edit)`}
                            onClick={handleTitleClick}
                        >
                            {data.title}
                        </h1>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Created {new Date(data._creationTime).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <NavUserNavbar isDark={isDark} />
                </div>
            </div>
        </header>
    );
});
PitchHeader.displayName = "PitchHeader";
