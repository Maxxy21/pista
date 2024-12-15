"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
    title: string;
    icon: LucideIcon;
    value: string;
}

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
    const router = useRouter();
    const pathname = usePathname();

    const onClick = (value: string) => {
        const url = qs.stringifyUrl({
            url: pathname || "/dashboard",
            query: {
                view: value,
            },
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };

    // Get current view from URL
    const currentUrl = qs.parse(window.location.search);
    const currentView = currentUrl.view as string;

    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mx-2">
                    <SidebarMenuButton
                        asChild
                        isActive={currentView === item.value}
                        onClick={() => onClick(item.value)}
                    >
                        <button>
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.title}</span>
                        </button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
