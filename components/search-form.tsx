"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";

import { Label } from "@/components/ui/label";
import {
    SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel,
    SidebarInput,
    useSidebar,
} from "@/components/ui/sidebar";
import {Hint} from "@/components/hint";

interface SearchFormProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SearchForm({
                               value,
                               onChange,
                               className
                           }: SearchFormProps) {
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);

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