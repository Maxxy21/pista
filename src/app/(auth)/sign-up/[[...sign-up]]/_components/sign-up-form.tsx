"use client";

import {SignUp} from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";

export function SignUpForm() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Get started with your journey to the perfect pitch
                    </p>
                </div>
                <SignUp appearance={getClerkAppearance(isDark)} forceRedirectUrl="/dashboard" />
            </div>
        </div>
    );
}
