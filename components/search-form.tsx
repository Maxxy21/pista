import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import { Search, X } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarInput,
    useSidebar,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Hint } from "./hint";
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
    autoFocus = false,
}: SearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedValue] = useDebounceValue(value, 500);
    const [isFocused, setIsFocused] = useState(false);

    // Memoize handlers to avoid unnecessary re-renders
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange]
    );

    const clearSearch = useCallback(() => {
        onChange("");
        inputRef.current?.focus();
    }, [onChange]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (debouncedValue) {
            current.set("search", debouncedValue);
        } else {
            current.delete("search");
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
        // Only depend on debouncedValue, pathname, and router
        // searchParams is stable in Next.js, but if not, consider removing it
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pathname, router]);

    const renderInput = (
        inputProps: React.InputHTMLAttributes<HTMLInputElement> & {
            ref: React.Ref<HTMLInputElement>;
        }
    ) => (
        <div
            className={cn(
                "relative rounded-lg transition-all duration-200",
                isFocused && "ring-1 ring-primary/50 bg-muted/40"
            )}
        >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {variant === "standalone" ? (
                <Input
                    {...inputProps}
                    id="search-standalone"
                    placeholder={placeholder}
                    className="pl-10 pr-8 w-full border-input bg-background"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            ) : (
                <SidebarInput
                    {...inputProps}
                    id="search"
                    placeholder={placeholder}
                    className="pl-10 pr-8 w-full border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            )}
            <AnimatePresence>
                {value && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-5 w-5 flex items-center justify-center bg-muted hover:bg-muted-foreground/20 transition-colors"
                        onClick={clearSearch}
                        aria-label="Clear search"
                        tabIndex={0}
                    >
                        <X className="h-3 w-3 text-muted-foreground" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );

    if (variant === "standalone") {
        return (
            <form onSubmit={(e) => e.preventDefault()} className={className}>
                {renderInput({ ref: inputRef })}
            </form>
        );
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className={className}>
            <SidebarGroup className="py-0">
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    {state === "collapsed" ? (
                        <Hint label="Search" side="right" sideOffset={12}>
                            <button
                                type="button"
                                className="p-2 rounded-lg transition-colors hover:bg-primary/10"
                                onClick={toggleSidebar}
                                aria-label="Expand sidebar search"
                            >
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </Hint>
                    ) : (
                        renderInput({ ref: inputRef })
                    )}
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    );
}
