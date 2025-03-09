import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
    currentView: string;
    handleTabChange: (value: string) => void;
}

export const DashboardTabs = ({ currentView, handleTabChange }: DashboardTabsProps) => {
    return (
        <div className="border-b">
            <div className="px-4 md:px-6 lg:px-8 w-full">
                <Tabs
                    defaultValue={currentView}
                    value={currentView}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="bg-transparent h-12">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                        >
                            All Pitches
                        </TabsTrigger>
                        <TabsTrigger
                            value="recent"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                        >
                            Recent
                        </TabsTrigger>
                        <TabsTrigger
                            value="favorites"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                        >
                            Favorites
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}; 