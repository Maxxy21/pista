export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen" style={{ background: "#0e0d0c" }}>
            {children}
        </div>
    );
}
