"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Search, X } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarInput, useSidebar } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModernSearchFormProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function SearchForm({
                                     value,
                                     onChange,
                                     className,
                                     placeholder = "Search pitches..."
                                 }: ModernSearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedValue] = useDebounceValue(value, 500);
    const [isFocused, setIsFocused] = React.useState(false);

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
    }, [debouncedValue, pathname, router, searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const clearSearch = () => {
        onChange("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (state === "expanded") {
            inputRef.current?.focus();
        }
    }, [state]);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className={className}
        >
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
                            >
                                <Search className="h-4 w-4 text-muted-foreground"/>
                            </button>
                        </Hint>
                    ) : (
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
                                className="pl-10 pr-8 w-full border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-5 w-5 flex items-center justify-center bg-muted hover:bg-muted-foreground/20 transition-colors"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    );
}