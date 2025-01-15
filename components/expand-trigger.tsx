import { useSidebar } from "@/components/ui/sidebar"
import { ArrowRightFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExpandTrigger() {
    const { toggleSidebar, state } = useSidebar()

    return (
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={cn(
                "h-6 w-6 mt-2",
                state == "expanded" && "rotate-180"
            )}
        >
            <ArrowRightFromLine className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}