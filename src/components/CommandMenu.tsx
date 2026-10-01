"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineHeart,
  HiOutlineHashtag,
  HiOutlineClipboardCopy,
  HiOutlineDocumentDownload,
  HiOutlineMoon,
  HiCheck,
  HiX,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";

type Group = "Navigation" | "On this page" | "Actions" | "Elsewhere";

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: IconType;
  keywords?: string;
  run: () => void;
}

const GROUP_ORDER: Group[] = ["Navigation", "On this page", "Actions", "Elsewhere"];

// every character of the query appears in order — "exp" finds "Experience",
// "gh" finds "GitHub" — cheap fuzzy matching without a dependency
function matches(query: string, text: string) {
  const q = query.toLowerCase().replace(/\s+/g, "");
  if (!q) return true;
  const t = text.toLowerCase();
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

const noopSubscribe = () => () => {};

export default function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnFocus = useRef<HTMLElement | null>(null);

  // false on the server and during hydration, the real value right after
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [shortcutKey, setShortcutKey] = useState("⌘K");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !/Mac|iPod|iPhone|iPad/i.test(navigator.userAgent)
    ) {
      setShortcutKey("Ctrl K");
    }
  }, []);
  
  const openMenu = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  // Ctrl/⌘ + K from anywhere on the site, plus single-key shortcuts
  // (T theme · G GitHub · H home · / search) while nothing is being typed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closeMenu();
        else openMenu();
        return;
      }
      if (open || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const k = e.key.toLowerCase();
      if (k === "t") window.dispatchEvent(new Event("jyora:toggle-theme"));
      else if (k === "g") window.open(profile.statusUrl, "_blank", "noopener");
      else if (k === "h") router.push("/");
      else if (k === "/") {
        e.preventDefault();
        openMenu();
      } else return;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openMenu, closeMenu, router]);

  // Esc closes from anywhere — the input's own key handler only fires while it
  // has focus, which it loses as soon as a row or the backdrop is clicked
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, closeMenu]);

  // Lock body scroll behind the open palette, and unconditionally release on close/unmount
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Ensure menu closes and scroll is unblocked on any route change
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [pathname]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      if (pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(href);
      }
    };
    const scrollTo = (id: string) => () => {
      if (pathname !== "/") {
        router.push(`/#${id}`);
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    const email = profile.email.replace("mailto:", "");

    return [
      { id: "home", group: "Navigation", label: "Home", hint: "Overview, highlights, and recent work", icon: HiOutlineHome, run: go("/") },
      { id: "projects-page", group: "Navigation", label: "Projects", hint: "Browse all projects & live demos", icon: HiOutlineCollection, run: go("/projects") },
      { id: "resume", group: "Navigation", label: "Resume", hint: "Experience, education, and skills", icon: HiOutlineDocumentText, keywords: "cv", run: go("/resume") },
      { id: "analytics", group: "Navigation", label: "Analytics", hint: "Live stats and activity", icon: HiOutlineChartBar, run: go("/analytics") },
      { id: "support", group: "Navigation", label: "Support", hint: "Sponsor or say thanks", icon: HiOutlineHeart, keywords: "sponsor donate", run: go("/support") },

      ...(
        [
          ["experience", "Experience"],
          ["projects", "Featured projects"],
          ["stack", "Stack"],
          ["activity", "GitHub activity"],
          ["contact", "Contact"],
        ] as const
      ).map(
        ([id, label]): Command => ({
          id: `section-${id}`,
          group: "On this page",
          label,
          icon: HiOutlineHashtag,
          run: scrollTo(id),
        })
      ),

      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: email,
        icon: HiOutlineClipboardCopy,
        keywords: "mail contact",
        run: () => {
          navigator.clipboard
            .writeText(email)
            .then(() => showToast("Email copied"))
            .catch(() => {});
        },
      },
      {
        id: "download-resume",
        group: "Actions",
        label: "Download resume",
        icon: HiOutlineDocumentDownload,
        keywords: "cv pdf",
        run: () => window.open(profile.resumeUrl, "_blank", "noopener"),
      },
      {
        id: "toggle-theme",
        group: "Actions",
        label: "Toggle theme",
        hint: "T · or pull the cord",
        icon: HiOutlineMoon,
        keywords: "dark light mode",
        // ThemeToggle owns the theme state — ask it rather than flipping the class here
        run: () => window.dispatchEvent(new Event("jyora:toggle-theme")),
      },

      ...socialLinks
        .filter((l) => l.name !== "Email" && l.name !== "Resume")
        .map(
          (l): Command => ({
            id: `social-${l.name}`,
            group: "Elsewhere",
            label: l.name,
            icon: l.icon,
            run: () => window.open(l.url, "_blank", "noopener"),
          })
        ),
    ];
  }, [router, pathname]);

  const filtered = useMemo(
    () => commands.filter((c) => matches(query, `${c.label} ${c.keywords ?? ""} ${c.group}`)),
    [commands, query]
  );

  // flat order the arrow keys walk through — grouped exactly as rendered
  const ordered = useMemo(
    () => GROUP_ORDER.flatMap((g) => filtered.filter((c) => c.group === g)),
    [filtered]
  );

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runCommand = (cmd: Command) => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    setOpen(false);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    cmd.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (ordered.length ? (a + 1) % ordered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (ordered.length ? (a - 1 + ordered.length) % ordered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = ordered[active];
      if (cmd) runCommand(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    }
  };

  let flatIndex = -1;

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-label="Open command menu"
        aria-haspopup="dialog"
        title={`Search (${shortcutKey})`}
        className="group flex h-9 w-9 sm:w-auto shrink-0 items-center justify-center sm:justify-start sm:gap-2 rounded-full px-0 sm:px-2.5 text-text-muted ring-1 ring-rule transition-colors hover:text-text-primary hover:ring-border-hover"
      >
        <HiOutlineSearch size={14} className="shrink-0" />
        <kbd className="hidden sm:inline-flex items-center rounded border border-rule bg-bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-text-dim transition-colors group-hover:text-text-secondary">
          {shortcutKey}
        </kbd>
      </button>

      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="command-palette-backdrop"
                  style={{ pointerEvents: open ? "auto" : "none" }}
                  className="fixed inset-0 z-[1001] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  transition={{ duration: 0.15 }}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) closeMenu();
                  }}
                >
                  <motion.div
                    key="command-palette-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Command menu"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[520px] overflow-hidden rounded-xl border border-rule bg-bg-surface-elevated shadow-[0_24px_60px_-16px_rgba(0,0,0,0.55)]"
                  >
                    <div className="flex items-center gap-3 border-b border-rule px-4">
                      <HiOutlineSearch size={15} className="shrink-0 text-text-dim" />
                      <input
                        autoFocus
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setActive(0);
                        }}
                        onKeyDown={onInputKey}
                        placeholder="Search pages, projects, or actions…"
                        aria-label="Search commands"
                        aria-controls="command-list"
                        aria-activedescendant={ordered[active] ? `cmd-${ordered[active].id}` : undefined}
                        className="h-12 w-full bg-transparent text-[0.9rem] text-text-primary outline-none placeholder:text-text-dim"
                      />
                      <kbd className="hidden shrink-0 rounded-md border border-rule bg-bg-surface px-2 py-1 font-mono text-[0.6rem] uppercase text-text-muted sm:block">
                        Esc
                      </kbd>
                      <button
                        type="button"
                        onClick={closeMenu}
                        aria-label="Close command menu"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-text-muted ring-1 ring-rule transition-colors hover:text-text-primary hover:ring-border-hover"
                      >
                        <HiX size={14} />
                      </button>
                    </div>

                    <div id="command-list" role="listbox" className="max-h-[min(360px,55vh)] overflow-y-auto p-2">
                      {ordered.length === 0 && (
                        <p className="px-3 py-8 text-center text-[0.82rem] text-text-dim">
                          Nothing matches &ldquo;{query}&rdquo;.
                        </p>
                      )}

                      {GROUP_ORDER.map((group) => {
                        const items = ordered.filter((c) => c.group === group);
                        if (items.length === 0) return null;
                        return (
                          <div key={group} className="mb-1 last:mb-0">
                            <p className="px-3 pt-2 pb-1.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-text-dim">
                              {group}
                            </p>
                            {items.map((cmd) => {
                              flatIndex++;
                              const idx = flatIndex;
                              const isActive = idx === active;
                              return (
                                <button
                                  key={cmd.id}
                                  id={`cmd-${cmd.id}`}
                                  ref={(el) => {
                                    itemRefs.current[idx] = el;
                                  }}
                                  type="button"
                                  role="option"
                                  aria-selected={isActive}
                                  tabIndex={-1}
                                  onMouseMove={() => setActive(idx)}
                                  onClick={() => runCommand(cmd)}
                                  className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[0.85rem] transition-colors ${
                                    isActive ? "text-text-primary" : "text-text-secondary"
                                  }`}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="command-active"
                                      className="absolute inset-0 -z-0 rounded-lg bg-bg-surface"
                                      transition={{ duration: 0.15, ease: "easeOut" }}
                                    />
                                  )}
                                  <cmd.icon size={15} className="relative shrink-0 text-text-muted" />
                                  <span className="relative min-w-0 flex-1">
                                    <span className="block truncate font-medium">{cmd.label}</span>
                                    {cmd.hint && (
                                      <span className="block truncate text-[0.72rem] font-normal text-text-dim">
                                        {cmd.hint}
                                      </span>
                                    )}
                                  </span>
                                  {isActive && (
                                    <HiOutlineExternalLink size={13} className="relative shrink-0 text-text-dim" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2 font-mono text-[0.58rem] text-text-dim">
                      <span>↑↓ navigate · Enter select</span>
                      <span className="hidden sm:inline">
                        <kbd>T</kbd> theme · <kbd>G</kbd> github · <kbd>H</kbd> home · <kbd>/</kbd> search
                      </span>
                      <span className="ml-auto">ESC close</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {toast && (
                <motion.div
                  key="command-palette-toast"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="fixed bottom-6 left-1/2 z-[1001] flex -translate-x-1/2 items-center gap-2 rounded-full border border-rule bg-bg-surface-elevated px-4 py-2 text-[0.8rem] text-text-primary shadow-lg"
                >
                  <HiCheck className="text-status-active" />
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}
    </>
  );
}
