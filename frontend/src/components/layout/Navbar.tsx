"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  LayoutDashboard,
  Search,
  Bot,
  FileText,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Track Case", href: "/track-case", icon: Search },
  { label: "AI Advisor", href: "/ai-advisor", icon: Bot },
  { label: "Documents", href: "/documents", icon: FileText },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-none"
      }`}
      style={{ backgroundColor: "#1A2744" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B39] rounded-md"
          aria-label="NyayMitra — home"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#E07B39" }}
          >
            <Scale className="h-5 w-5 text-white" strokeWidth={2.2} />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            Nyay<span style={{ color: "#E07B39" }}>Mitra</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B39] ${
                    active
                      ? "text-[#E07B39]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:block">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2744]"
            style={{ backgroundColor: "#E07B39" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#c96a2a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#E07B39")
            }
          >
            Get Started
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B39]"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <X className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={2} />
          )}
        </button>
      </nav>

      {/* ── Mobile menu panel ── */}
      <div
        id="mobile-menu"
        role="region"
        aria-label="Mobile navigation"
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#152035" }}
      >
        <ul className="flex flex-col gap-1 px-4 pb-4 pt-2" role="list">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-[#E07B39]/15 text-[#E07B39]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  {label}
                </Link>
              </li>
            );
          })}

          {/* Mobile CTA */}
          <li className="mt-2">
            <Link
              href="/get-started"
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 active:scale-95"
              style={{ backgroundColor: "#E07B39" }}
            >
              Get Started
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
