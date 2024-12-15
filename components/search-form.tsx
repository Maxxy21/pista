"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Search } from "lucide-react";
import {SidebarGroup, SidebarGroupContent, SidebarInput, useSidebar } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Hint } from "./hint";

interface SearchFormProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchForm({ value, onChange }: SearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedValue] = useDebounceValue(value, 500);

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

    useEffect(() => {
        if (state === "expanded") {
            inputRef.current?.focus();
        }
    }, [state]);
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <SidebarGroup className="py-0">
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    {state === "collapsed" ? (
                        <Hint label="Search" side="right" sideOffset={12}>
                            <button
                                className="py-2"
                                onClick={toggleSidebar}
                            >
                                <Search className="size-4"/>
                            </button>
                        </Hint>
                    ) : (
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <SidebarInput
                                ref={inputRef}
                                id="search"
                                placeholder="Search pitches..."
                                className="pl-8 w-full"
                                value={value}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    );
}