"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NameOrigin from "@/components/NameOrigin";
import CommandMenu from "@/components/CommandMenu";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    handleHash();
    const timer = setTimeout(handleHash, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[800px] items-center gap-4 sm:gap-6 border-b border-dashed border-rule-strong px-5 py-4 md:px-6">
        <NameOrigin />

        {/* scrolls itself on very narrow phones rather than widening the page */}
        <ul className="no-scrollbar flex min-w-0 items-center gap-3.5 overflow-x-auto sm:gap-5">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="relative shrink-0">
                <Link
                  href={link.href}
                  className={`text-[0.82rem] transition-colors duration-200 ${
                    active
                      ? "font-medium text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-text-primary" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right header cluster: status badge + search */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Status pill: Open to work / Get in touch with blinking live dot */}
          <Link
            href="/#contact"
            title="Open to work — Get in touch"
            aria-label="Open to work — Get in touch"
            className="group hidden h-9 items-center gap-2 rounded-full bg-bg-surface-subtle px-3 text-[0.76rem] font-medium text-text-secondary ring-1 ring-rule transition-colors hover:bg-bg-surface hover:text-text-primary hover:ring-border-hover min-[580px]:inline-flex"
          >
            <span
              aria-hidden
              className="status-dot-glow live-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-status-active text-status-active"
            />
            <span className="relative flex items-center">
              <span className="invisible select-none opacity-0" aria-hidden>
                Get in touch ↗
              </span>
              <span className="absolute inset-0 flex items-center transition-all duration-200 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                Open to work
              </span>
              <span className="absolute inset-0 flex items-center gap-0.5 translate-y-full opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 text-text-primary">
                Get in touch <span>↗</span>
              </span>
            </span>
          </Link>

          {/* Command Menu (Search with shortcut) */}
          <CommandMenu />
        </div>
      </nav>
    </header>
  );
}
