import { useState, useEffect, FormEvent } from 'react';
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import qs from "query-string";

export const useDashboardState = (searchParams: ReadonlyURLSearchParams) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [viewMode, setViewModeState] = useState<"grid" | "list">("grid");
    const [scoreFilter, setScoreFilterState] = useState<string>("all");
    const [sortBy, setSortByState] = useState<"newest" | "score" | "updated">("newest");

    const searchQuery = searchParams.get("search") || "";
    const modeQuery = (searchParams.get("mode") || "grid") as "grid" | "list";
    const scoreQuery = (searchParams.get("score") || "all") as string;
    const sortQuery = (searchParams.get("sort") || "newest") as "newest" | "score" | "updated";

    useEffect(() => {
        if (searchQuery) setSearchValue(searchQuery);
        setViewModeState(modeQuery);
        setScoreFilterState(scoreQuery);
        setSortByState(sortQuery);
    }, [searchQuery, modeQuery, scoreQuery, sortQuery]);

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

    const setScoreFilter = (value: string) => {
        setScoreFilterState(value);
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                score: value === "all" ? undefined : value,
            },
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    };

    const setSortBy = (value: "newest" | "score" | "updated") => {
        setSortByState(value);
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                sort: value === "newest" ? undefined : value,
            },
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    };

    const setViewMode = (value: "grid" | "list") => {
        setViewModeState(value);
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                mode: value === "grid" ? undefined : value,
            },
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    };

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
