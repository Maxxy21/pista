import { useState, useEffect, FormEvent } from 'react';
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import qs from "query-string";

export const useDashboardState = (searchParams: ReadonlyURLSearchParams) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [scoreFilter, setScoreFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "score" | "updated">("newest");

    // Get search query from URL
    const searchQuery = searchParams.get("search") || "";

    // Update search value when URL changes
    useEffect(() => {
        if (searchQuery) {
            setSearchValue(searchQuery);
        }
    }, [searchQuery]);

    // Handle search form submission
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                search: searchValue || undefined,
            },
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    };

    // Handle tab changes
    const handleTabChange = (value: string) => {
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                view: value === "all" ? undefined : value,
            },
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    };

    // Get score range based on filter
    const getScoreRange = (filter: string) => {
        switch (filter) {
            case "high":
                return { min: 8, max: 10 };
            case "medium":
                return { min: 5, max: 7.9 };
            case "low":
                return { min: 0, max: 4.9 };
            default:
                return { min: 0, max: 10 };
        }
    };

    return {
        searchValue,
        setSearchValue,
        viewMode,
        setViewMode,
        scoreFilter,
        setScoreFilter,
        sortBy,
        setSortBy,
        handleSearch,
        handleTabChange,
        getScoreRange
    };
}; 