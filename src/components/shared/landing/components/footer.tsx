import Link from "next/link";

const Footer = () => {
    return (
        <footer
            className="py-10"
            style={{ borderTop: "1px solid var(--landing-border)" }}
        >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div
                            className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 opacity-80"
                            style={{ background: "var(--landing-cream)" }}
                        />
                        <span
                            className="text-base font-semibold tracking-tight"
                            style={{ color: "var(--landing-cream)", opacity: 0.8 }}
                        >
                            Pista
                        </span>
                    </Link>

                    <div className="flex items-center gap-5 text-sm" style={{ color: "var(--landing-text-muted)" }}>
                        <span>© {new Date().getFullYear()} Pista</span>
                        <span style={{ opacity: 0.3 }}>·</span>
                        <span>
                            Built by{" "}
                            <Link
                                href="https://maxwell.is-a.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors duration-150 hover:underline underline-offset-4"
                                style={{ color: "var(--landing-cream)", opacity: 0.75 }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
                            >
                                Maxwell Aboagye
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
