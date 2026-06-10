import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

const SignUpPage = () => {
    return (
        <div
            className="flex min-h-screen"
            style={{ background: "#0e0d0c" }}
        >
            {/* Left panel */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
                {/* Ambient glow */}
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    aria-hidden
                >
                    <div
                        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
                        style={{
                            background: "radial-gradient(ellipse at center, #F2EAD3 0%, transparent 70%)",
                            filter: "blur(80px)",
                        }}
                    />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group w-fit">
                    <div
                        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                        style={{ background: "#F2EAD3" }}
                    />
                    <span
                        className="text-lg font-semibold tracking-tight"
                        style={{ color: "#F2EAD3" }}
                    >
                        Pista
                    </span>
                </Link>

                {/* Bottom content */}
                <div>
                    <div className="gradient-shell inline-block mb-8">
                        <div
                            className="gradient-shell-inner px-4 py-2 text-xs font-medium tracking-widest uppercase"
                            style={{ color: "rgba(242,234,211,0.5)" }}
                        >
                            Get started free
                        </div>
                    </div>
                    <h2
                        className="font-display text-5xl leading-[1.1] tracking-tight mb-6"
                        style={{ color: "#F2EAD3" }}
                    >
                        Start pitching
                        <br />
                        <span style={{ color: "rgba(242,234,211,0.45)" }}>
                            with confidence.
                        </span>
                    </h2>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(242,234,211,0.45)" }}>
                        Get expert-level AI feedback on your startup pitch in under 60 seconds. No gatekeeping, no scheduling.
                    </p>
                </div>
            </div>

            {/* Right panel — Clerk form */}
            <div
                className="flex flex-1 flex-col items-center justify-center p-8"
                style={{ borderLeft: "1px solid rgba(242,234,211,0.08)" }}
            >
                {/* Mobile logo */}
                <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
                    <div
                        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm"
                        style={{ background: "#F2EAD3" }}
                    />
                    <span className="text-lg font-semibold" style={{ color: "#F2EAD3" }}>Pista</span>
                </Link>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpPage;
