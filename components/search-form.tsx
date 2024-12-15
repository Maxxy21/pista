"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Search } from "lucide-react";
import { SidebarInput, useSidebar } from "@/components/ui/sidebar";

interface SearchFormProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchForm({ value, onChange }: SearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state } = useSidebar();
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

    return (
        <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput
                placeholder="Search pitches..."
                className="pl-9 w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}