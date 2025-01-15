import {useSidebar} from "@/components/ui/sidebar"
import {ArrowLeftToLine} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export function CollapseTrigger() {
    const {toggleSidebar, state} = useSidebar()

    return (
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={cn(
                "h-6 w-6",
                state == "collapsed" && "rotate-180"
            )}
        >
            <ArrowLeftToLine className="h-4 w-4"/>
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}