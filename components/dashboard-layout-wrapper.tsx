'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useDashboardState } from '@/app/dashboard/hooks/use-dashboard-state';

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    defaultOpen: boolean;
}

export function DashboardLayoutWrapper({ children, defaultOpen }: DashboardLayoutWrapperProps) {
    const searchParamsObj = useSearchParams();
    const {
        searchValue, setSearchValue
    } = useDashboardState(searchParamsObj);

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar 
                searchValue={searchValue}
                onSearchChange={setSearchValue}
            />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </SidebarProvider>
    );
}