"use client";

import {Loading} from "@/components/auth/loading";
import {ClerkProvider, useAuth} from "@clerk/nextjs";
import {AuthLoading, Authenticated, ConvexReactClient, Unauthenticated} from "convex/react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {useMemo} from "react";
import {usePathname} from "next/navigation";

interface ConvexClientProviderProps {
    children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

export const ConvexClientProvider = ({
                                         children
                                     }: ConvexClientProviderProps) => {
    const convex = useMemo(() => new ConvexReactClient(convexUrl), []);
    const pathname = usePathname();

    // Check if we're on an auth page
    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <AuthLoading>
                    <Loading/>
                </AuthLoading>
                <Authenticated>
                    {children}
                </Authenticated>
                <Unauthenticated>
                    {isAuthPage ? children : children}
                </Unauthenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};