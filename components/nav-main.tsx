"use client"

import { LucideIcon } from "lucide-react"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "query-string";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavMainProps {
    items: {
        title: string
        icon: LucideIcon
        value: string
    }[]
}

export function NavMain({ items }: NavMainProps) {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");

    const getUrl = (value: string) => {
        return qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                view: value === "home" ? undefined : value
            }
        }, { skipEmptyString: true, skipNull: true });
    };

    return (
        <SidebarMenu>
            {items.map((item) => {
                const isActive =
                    (item.value === "home" && !currentView) ||
                    currentView === item.value;

                const url = getUrl(item.value);

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                        >
                            <Link href={url}>
                                <item.icon className="h-4 w-4 mr-2" />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    )
}