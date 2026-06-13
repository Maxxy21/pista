import React from "react";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";

interface AuthScreenProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
}

function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group w-fit ${className ?? ""}`}>
      <LogoIcon size="md" />
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">Pista</span>
    </Link>
  );
}

export function AuthScreen({ eyebrow, title, subtitle, description, children }: AuthScreenProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--foreground)) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <Brand />

        <div>
          <div className="gradient-shell inline-block mb-8">
            <div className="gradient-shell-inner px-4 py-2 text-xs font-medium tracking-widest uppercase text-[hsl(var(--foreground)/0.5)]">
              {eyebrow}
            </div>
          </div>
          <h2 className="font-display text-5xl leading-[1.1] tracking-tight mb-6 text-foreground">
            {title}
            <br />
            <span className="text-[hsl(var(--foreground)/0.45)]">{subtitle}</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-[hsl(var(--foreground)/0.45)]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8 border-l border-border">
        <Brand className="mb-10 lg:hidden" />
        {children}
      </div>
    </div>
  );
}
