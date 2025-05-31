import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
    currentView: string;
    handleTabChange: (value: string) => void;
}

const TAB_ITEMS = [
    { value: "all", label: "All Pitches" },
    { value: "recent", label: "Recent" },
    { value: "favorites", label: "Favorites" },
];

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
    currentView,
    handleTabChange,
}) => (
    <div className="border-b">
        <div className="px-4 md:px-6 lg:px-8 w-full">
            <Tabs
                value={currentView}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="bg-transparent h-12">
                    {TAB_ITEMS.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    </div>
);
