import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";
import { Button } from "@/components/ui/button";
import { SystemScreen } from "@/components/shared/system/system-screen";

export default function NotFound() {
    return (
        <SystemScreen
            className="min-h-screen bg-background"
            icon={<LogoIcon size="lg" />}
            title="Page not found"
            description="The page you're looking for doesn't exist or may have moved."
            actions={
                <>
                    <Button asChild variant="gold">
                        <Link href="/dashboard">Back to dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/">Go home</Link>
                    </Button>
                </>
            }
        />
    );
}
