"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineEye } from "react-icons/hi";

const KEY = "jyora:visitor-no";

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

const noopSubscribe = () => () => {};

// one request per page load even under React strict mode's double effect
// mine = this browser's visitor number (remembered), first = counted just now
let pending: Promise<{ count: number; mine: number | null; first: boolean }> | null = null;

function load() {
  pending ??= (async () => {
    let mine: number | null = null;
    try {
      mine = Number(localStorage.getItem(KEY)) || null;
    } catch {}

    // a browser is only counted once; returning visitors just read the total
    const res = await fetch("/api/visitors", { method: mine ? "GET" : "POST" });
    const { count } = await res.json();
    if (!mine && res.ok) {
      try {
        localStorage.setItem(KEY, String(count));
      } catch {}
      return { count, mine: count as number, first: true };
    }
    return { count, mine, first: false };
  })();
  return pending;
}

// Readout of the total visitor count — inline (footer) or as a small stacked
// stat (hero) — plus a one-time "you're the Nth visitor" toast the first time
// a browser visits. Only one instance should own the toast.
export default function VisitorCounter({
  variant = "inline",
  toast = true,
  className = "",
}: {
  variant?: "inline" | "stat" | "sentence";
  toast?: boolean;
  className?: string;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [mine, setMine] = useState<number | null>(null);
  const [welcome, setWelcome] = useState<number | null>(null);
  // false during SSR/hydration so the portal only renders on the client
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    load()
      .then(({ count, mine, first }) => {
        setCount(count);
        setMine(mine);
        if (mine && first && toast) {
          setWelcome(mine);
          timer = setTimeout(() => setWelcome(null), 5000);
        }
      })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {count !== null && variant === "stat" && (
        // this browser's own number when we know it, the total otherwise
        <p className={`flex-col items-end leading-none ${className}`}>
          <span className="flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-text-dim">
            <HiOutlineEye size={10} />
            {mine ? "you're the" : "visitors"}
          </span>
          <span className="mt-1.5 font-mono text-[0.9rem] tabular-nums text-text-secondary">
            {mine ? `${ordinal(mine)} visitor` : count.toLocaleString("en-US")}
          </span>
        </p>
      )}
      {count !== null && variant === "sentence" && (
        <p className={`flex items-center gap-1.5 ${className}`}>
          <HiOutlineEye size={12} className="shrink-0" />
          {mine ? (
            <span>
              You are the <strong className="font-medium text-text-primary">{ordinal(mine)}</strong> visitor
            </span>
          ) : (
            <span>
              <strong className="font-medium text-text-primary">{count.toLocaleString("en-US")}</strong>{" "}
              {count === 1 ? "visitor" : "visitors"} so far
            </span>
          )}
        </p>
      )}
      {count !== null && variant === "inline" && (
        <p className={`flex items-center gap-1.5 ${className}`}>
          <HiOutlineEye size={12} />
          {count.toLocaleString("en-US")} {count === 1 ? "visitor" : "visitors"}
        </p>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {welcome && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-5 left-5 z-[1001] flex items-center gap-2.5 rounded-xl border border-dashed border-rule-strong bg-bg-surface-elevated px-4 py-2.5 text-[0.82rem] text-text-primary shadow-lg"
              >
                <span className="status-dot-glow h-1.5 w-1.5 rounded-full bg-status-active text-status-active" />
                You&apos;re the <strong className="font-semibold">{ordinal(welcome)}</strong> visitor
                <button
                  type="button"
                  onClick={() => setWelcome(null)}
                  aria-label="Dismiss"
                  className="ml-1 text-text-dim transition-colors hover:text-text-primary"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
