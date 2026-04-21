"use client";

import { SignIn } from "@clerk/nextjs";
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";

export function SignInForm() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <SignIn appearance={getClerkAppearance()} forceRedirectUrl="/dashboard" />
        </div>
    );
}
