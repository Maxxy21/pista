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

export function SearchForm({ className, ...props }: React.ComponentProps<"form">) {
    const router = useRouter();
    const pathname = usePathname();
    const [value, setValue] = useState("");
    const [debouncedValue] = useDebounceValue(value, 500);
    const { state, toggleSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (state === "expanded") {
            inputRef.current?.focus();
        }
    }, [state]);

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname || "/dashboard",
            query: {
                search: debouncedValue,
            },
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, router, pathname]);

    return (
        <form {...props} onSubmit={(e) => e.preventDefault()}>
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
                                onChange={handleChange}
                                value={value}
                            />
                        </div>
                    )}
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    );
}