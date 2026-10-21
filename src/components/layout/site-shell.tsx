"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { brandName, mainNav } from "@/lib/site-data";
import { LiveCustomerServiceWidget } from "@/components/ui/live-customer-service-widget";

type SiteShellProps = {
  children: ReactNode;
};

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {mainNav.map((item) => {
        const active = item.href === "/"
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`text-sm uppercase tracking-[0.18em] transition ${
              active
                ? "text-[var(--color-ivory)]"
                : "text-[rgba(46,16,101,0.62)] hover:text-[var(--color-gold)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="sticky top-0 z-40 border-b border-[rgba(46,16,101,0.08)] bg-[rgba(255,255,255,0.92)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex flex-col gap-1" aria-label={brandName}>
            <span className="font-serif text-2xl tracking-[0.18em] text-[var(--color-ivory)] sm:text-3xl">
              MIAN TAILOR
            </span>
            <span className="text-[11px] tracking-[0.22em] text-[rgba(46,16,101,0.58)]">
              and design
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <NavLinks pathname={pathname} />
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center border border-[rgba(46,16,101,0.16)] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ivory)] lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-[rgba(46,16,101,0.08)] bg-[rgba(248,244,255,0.98)] px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <LiveCustomerServiceWidget />

      <footer className="border-t border-[rgba(46,16,101,0.08)] px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <p className="font-serif text-3xl tracking-[0.14em] text-[var(--color-ivory)]">
              MIAN TAILOR
            </p>
            <p className="text-sm tracking-[0.18em] text-[rgba(46,16,101,0.58)]">
              and design
            </p>
            <p className="max-w-md text-sm leading-7 text-[rgba(46,16,101,0.64)]">
              A premium Kameez Shalwar brand focused on gallery presentation,
              clean design, and direct customer contact.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Navigation
            </p>
            <div className="flex flex-col gap-3">
              <NavLinks pathname={pathname} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Visit
            </p>
            <p className="text-sm leading-7 text-[rgba(46,16,101,0.64)]">
              Via Montenapoleone inspired salon concept
              <br />
              Available by request
              <br />
              Monday to Saturday
            </p>
            <Link href="/contact" className="luxe-link">
              Request Private Assistance
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

