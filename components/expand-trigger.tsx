import { useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExpandTrigger() {
    const { toggleSidebar, isMobile, openMobile } = useSidebar()

    return (
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={isMobile ? "Open sidebar" : "Toggle sidebar"}
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
                {isMobile ? "Open sidebar" : "Toggle sidebar"}
            </span>
        </Button>
    );
}