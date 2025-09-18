import LogoIcon from "@/components/ui/logo-icon";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-background">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Logo with animation */}
                <div className="relative">
                    <div className="animate-pulse duration-1000 flex items-center gap-3">
                        <LogoIcon size="lg"/>
                        <h1 className="text-2xl font-bold text-foreground">Pista</h1>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 animate-pulse-subtle opacity-20 blur-sm">
                        <div className="flex items-center gap-3">
                            <LogoIcon size="lg"/>
                            <h1 className="text-2xl font-bold text-primary">Pista</h1>
                        </div>
                    </div>
                </div>
                
                {/* Loading indicator */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        </div>
    );
};
