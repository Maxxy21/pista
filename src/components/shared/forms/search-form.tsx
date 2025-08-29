import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Search, X } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarInput, useSidebar } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Hint } from "../common/hint";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    variant?: "sidebar" | "standalone";
    autoFocus?: boolean;
}

export function SearchForm({
    value,
    onChange,
    className,
    placeholder = "Search pitches...",
    variant = "sidebar",
    autoFocus = false
}: SearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedValue] = useDebounceValue(value, 500);
    const [isFocused, setIsFocused] = React.useState(false);

    // Only update URL for standalone variant (dashboard header)
    // Sidebar variant is handled by parent component  
    useEffect(() => {
        if (variant === "standalone" && typeof window !== 'undefined') {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            if (debouncedValue) {
                current.set("search", debouncedValue);
            } else {
                current.delete("search");
            }

            const search = current.toString();
            const query = search ? `?${search}` : "";

            router.push(`${pathname}${query}`);
        }
    }, [debouncedValue, pathname, router, searchParams, variant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Input changed to:', `"${e.target.value}"`);
        onChange(e.target.value);
    };

    const clearSearch = React.useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Clear search clicked, calling onChange with empty string');
        // Clear search through parent component
        onChange("");
        
        // Focus the input after clearing
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, [onChange]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Standalone search input (for dashboard header)
    if (variant === "standalone") {
        return (
            <form
                onSubmit={(e) => e.preventDefault()}
                className={className}
            >
                <div className={cn(
                    "relative rounded-lg transition-all duration-200",
                    isFocused && "ring-1 ring-primary/50 bg-muted/40"
                )}>
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        ref={inputRef}
                        id="search-standalone"
                        placeholder={placeholder}
                        className="pl-10 pr-9 w-full border-input bg-background h-10"
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <AnimatePresence>
                        {value && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full flex items-center justify-center bg-muted/70 hover:bg-muted-foreground/20 transition-colors cursor-pointer z-10"
                                onClick={clearSearch}
                                onMouseDown={(e) => e.preventDefault()}
                                aria-label="Clear search"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        );
    }

    // Sidebar search input
    // Note: Don't return null for collapsed state as it might be used in other sidebars

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className={className}
        >
            <div className={cn(
                "relative rounded-lg transition-all duration-200",
                isFocused && "ring-1 ring-primary/50 bg-muted/40"
            )}>
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <SidebarInput
                    ref={inputRef}
                    id="search"
                    placeholder={placeholder}
                    className="pl-10 pr-9 w-full border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {value && (
                    <button
                        type="button"
                        className="absolute right-2.5 top-1.5 h-5 w-5 rounded-full flex items-center justify-center bg-muted/70 hover:bg-muted-foreground/20 transition-colors cursor-pointer z-20"
                        onClick={clearSearch}
                        onMouseDown={(e) => e.preventDefault()}
                        aria-label="Clear search"
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </div>
        </form>
    );
}