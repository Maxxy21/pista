"use client";

import { SignUp } from "@clerk/nextjs";
import { getClerkAppearance } from "@/lib/utils/clerk-appearance";

export function SignUpForm() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <SignUp appearance={getClerkAppearance()} forceRedirectUrl="/dashboard" />
        </div>
    );
}
