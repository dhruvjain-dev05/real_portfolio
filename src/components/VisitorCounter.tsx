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
let pending: Promise<{ count: number; mine: number | null }> | null = null;

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
      return { count, mine: count as number };
    }
    return { count, mine: null };
  })();
  return pending;
}

// Footer readout of the total visitor count, plus a one-time
// "you're the Nth visitor" toast the first time a browser visits.
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [welcome, setWelcome] = useState<number | null>(null);
  // false during SSR/hydration so the portal only renders on the client
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    load()
      .then(({ count, mine }) => {
        setCount(count);
        if (mine) {
          setWelcome(mine);
          timer = setTimeout(() => setWelcome(null), 5000);
        }
      })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {count !== null && (
        <p className="flex items-center gap-1.5">
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
