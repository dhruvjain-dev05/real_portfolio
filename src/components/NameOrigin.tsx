"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from "@/components/ui/popover";
import { profile } from "@/data/profile";

export default function NameOrigin() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label={`Where the name "${profile.brandName}" comes from`}
        >
          {profile.avatarSketch && (
            <Image
              src={profile.avatarSketch}
              alt=""
              aria-hidden
              width={64}
              height={64}
              unoptimized
              className="h-7 w-7 shrink-0 rounded-full ring-1 ring-rule"
            />
          )}
          <span className="font-display text-2xl text-text-display">{profile.brandName}</span>
        </button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && (
          <PopoverContent
            forceMount
            align="start"
            sideOffset={12}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-[276px] px-4 py-4"
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-dim">
                The name
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[0.78rem]">
                <span className="text-text-secondary">
                  <span className="font-semibold text-text-display">Jyo</span>ti
                </span>
                <span className="text-text-ghost">+</span>
                <span className="text-text-secondary">
                  <span className="font-semibold text-text-display">Ra</span>kesh
                </span>
              </div>

              <div className="my-2.5 flex items-center gap-2">
                <span className="h-px flex-1 bg-rule" />
                <span className="text-text-ghost">↓</span>
                <span className="h-px flex-1 bg-rule" />
              </div>

              <p className="text-center font-display text-xl text-text-display">
                {profile.brandName}
              </p>

              <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-text-muted">
                My parents&apos; names, folded into one — the closest thing I have to a
                signature. No matter what else ever happens in my life, this already did
                — I got them as my parents. Nothing I ever become will matter more than
                that.
              </p>
              <PopoverArrow className="fill-bg-surface-elevated" />
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
