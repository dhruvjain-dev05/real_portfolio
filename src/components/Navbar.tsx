"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NameOrigin from "@/components/NameOrigin";
import CommandMenu from "@/components/CommandMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/analytics", label: "Analytics" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[800px] items-center gap-6 px-5 py-4 md:px-6">
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

        <CommandMenu />
      </nav>
    </header>
  );
}
