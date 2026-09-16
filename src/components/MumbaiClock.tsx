"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from "@/components/ui/popover";

function formatIST(date: Date, withSeconds: boolean) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatLocal(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// India doesn't observe DST, so IST is a fixed UTC+5:30 (330 min) year-round —
// the visitor's own offset (from their own clock) is all that varies.
function diffLabel(date: Date) {
  const minutes = 330 + date.getTimezoneOffset();
  if (minutes === 0) return "Same time as you, right now.";
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const amount = [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ");
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you, right now.`;
}

export default function MumbaiClock() {
  // starts empty on purpose — filled only on mount, so the server-rendered
  // HTML never embeds a timestamp that would mismatch the client's own
  // "now" a moment later (the same reason the rest of this hero's clock
  // never rendered a value until after hydration)
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onClick={() => setOpen((o) => !o)}
          className="transition-colors hover:text-text-primary"
        >
          {now ? formatIST(now, true) : ""}
        </button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && now && (
          <PopoverContent
            forceMount
            align="start"
            sideOffset={10}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-[220px] px-4 py-4"
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-ghost">
                Right now
              </p>

              <div className="mt-3 space-y-1.5 font-mono text-[0.78rem]">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Mumbai</span>
                  <span className="text-text-display">{formatIST(now, false)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">You</span>
                  <span className="text-text-display">{formatLocal(now)}</span>
                </div>
              </div>

              <div className="my-2.5 h-px bg-rule" />

              <p className="text-center text-[0.75rem] text-text-secondary">{diffLabel(now)}</p>
              <PopoverArrow className="fill-bg-surface-elevated" />
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
