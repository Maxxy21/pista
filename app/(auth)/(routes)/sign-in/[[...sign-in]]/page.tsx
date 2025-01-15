
import LogoIcon from "@/components/ui/logo-icon"

// app/(auth)/sign-in/page.tsx
import { SignInForm } from "./_components/sign-in-form"


const SignInPage = () => {
    return (
        <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary/50" />
                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <LogoIcon />
                    <span>Pitch Perfect</span>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &quot;Join thousands of startups who have improved their pitch decks with our AI-powered
                            platform.&quot;
                        </p>
                        <footer className="text-sm">Join our community today</footer>
                    </blockquote>
                </div>
            </div>
            <SignInForm/>
        </div>
    )
}


export default SignInPage