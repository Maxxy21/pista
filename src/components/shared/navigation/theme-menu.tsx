"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ThemeMenuProps {
  theme: "light" | "dark" | "system" | string | undefined;
  setTheme: (val: string) => void;
}

export function ThemeMenu({ theme, setTheme }: ThemeMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="gap-2">
        {theme === "light" && <Sun className="mr-2 h-4 w-4 text-muted-foreground" />}
        {theme === "dark" && <Moon className="mr-2 h-4 w-4 text-muted-foreground" />}
        {theme === "system" && <Laptop className="mr-2 h-4 w-4 text-muted-foreground" />}
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

