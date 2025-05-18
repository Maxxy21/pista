import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export const EmptyOrg = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <EmptyState
            title="Welcome to Pista"
            description="Create an organization to get started"
            imageSrc="/elements.svg"
            imageAlt="Create an organization"
            imageSize={200}
            className="mt-20 grid grid-cols-1 md:grid-cols-7 gap-4"
            action={
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            size="lg"
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                            Create organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                        <CreateOrganization 
                            appearance={{baseTheme: isDark ? dark : undefined}}
                            routing={"hash"}
                        />
                    </DialogContent>
                </Dialog>
            }
        />
    );
}; 