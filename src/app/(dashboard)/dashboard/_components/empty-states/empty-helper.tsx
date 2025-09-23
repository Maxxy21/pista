"use client";

import React from "react";
import {EmptySearch} from "./empty-search";
import {EmptyFavorites} from "./empty-favorites";
import {EmptyPitches} from "./empty-pitches";

interface EmptyProps {
    data: any[] | undefined;
    searchParam: string;
    viewParam: string;
    organizationId?: string | null;
}

export function getEmptyState({data, searchParam, viewParam, organizationId}: EmptyProps) {
    if (searchParam && (!data || data.length === 0)) return <EmptySearch/>;
    if (viewParam === "favorites" && (!data || data.length === 0)) return <EmptyFavorites/>;
    if (!data || data.length === 0) return <EmptyPitches orgId={organizationId as string}/>;
    return null;
}
