'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? "rgba(14, 13, 12, 0.85)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                borderBottom: scrolled ? "1px solid var(--landing-border)" : "1px solid transparent",
            }}
        >
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group transition-opacity duration-200 group-hover:opacity-80 hover:opacity-80">
                    <span style={{ color: "var(--landing-cream)" }}><LogoIcon size="md" /></span>
                    <span
                        className="text-lg font-semibold tracking-tight"
                        style={{ color: "var(--landing-cream)" }}
                    >
                        Pista
                    </span>
                </Link>

                {/* Nav actions */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/sign-in"
                        className="px-4 py-2 text-sm rounded-full transition-colors duration-150"
                        style={{ color: "var(--landing-text-muted)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--landing-text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--landing-text-muted)")}
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/sign-up"
                        className="px-5 py-2 text-sm font-medium rounded-full transition-opacity duration-150 hover:opacity-85"
                        style={{
                            background: "var(--landing-cream)",
                            color: "#0e0d0c",
                        }}
                    >
                        Get started
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
