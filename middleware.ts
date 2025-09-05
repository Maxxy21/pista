import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth()

    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn()
    }

    // Dev/Codespaces: align Origin with x-forwarded-host to satisfy
    // Next Server Actions host check when using GitHub Codespaces proxy.
    // Applies only outside production to avoid masking real CSRF checks.
    if (process.env.NODE_ENV !== 'production') {
        const xfh = req.headers.get('x-forwarded-host')
        const origin = req.headers.get('origin')

        if (xfh && xfh.endsWith('.app.github.dev')) {
            // If Origin is missing or mismatched (e.g., localhost), rewrite to Codespaces host.
            const originHost = origin?.replace(/^https?:\/\//, '')
            if (!originHost || originHost !== xfh) {
                const headers = new Headers(req.headers)
                headers.set('origin', `https://${xfh}`)
                return NextResponse.next({ request: { headers } })
            }
        }
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
