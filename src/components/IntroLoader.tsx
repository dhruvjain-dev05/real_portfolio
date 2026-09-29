"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";

// First visit of a session only: the two names the wordmark comes from —
// Jyoti and Rakesh — fold into "Jyora", which then flies into its place in
// the header. The same story the header popover tells, told once, in motion.
//
// Whether it plays is decided by the inline script in layout.tsx *before*
// first paint (it sets html[data-intro] and a CSS cover), so the page never
// flashes underneath. No JS / reduced motion / already seen → never shown,
// and the CSS cover removes itself after 3s even if hydration fails.

type Phase = "names" | "fold" | "word" | "fly" | "out";

const TIMINGS: [Phase, number][] = [
  ["fold", 450],
  ["word", 820],
  ["fly", 1080],
  ["out", 1520],
];
const END_MS = 1760;

const ease = [0.16, 1, 0.3, 1] as const;

const noopSubscribe = () => () => {};

export default function IntroLoader() {
  // the pre-paint script's decision; false on the server so hydration matches
  const wantsIntro = useSyncExternalStore(
    noopSubscribe,
    () => document.documentElement.hasAttribute("data-intro"),
    () => false
  );
  const [done, setDone] = useState(false);
  const active = wantsIntro && !done;
  const [phase, setPhase] = useState<Phase>("names");
  const [flight, setFlight] = useState({ x: 0, y: 0, scale: 1 });
  const wordRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setDone(true);
    document.documentElement.removeAttribute("data-intro");
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!wantsIntro) return;
    document.body.style.overflow = "hidden";

    timers.current = [
      ...TIMINGS.map(([p, ms]) => setTimeout(() => setPhase(p), ms)),
      setTimeout(finish, END_MS),
    ];

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
    };
  }, [wantsIntro, finish]);

  // measure where the header wordmark sits and fly exactly onto it
  useEffect(() => {
    if (phase !== "fly") return;
    const target = document.querySelector("[data-jyora-wordmark]");
    const word = wordRef.current;
    if (!target || !word) return;
    const t = target.getBoundingClientRect();
    const w = word.getBoundingClientRect();
    setFlight({
      x: t.left + t.width / 2 - (w.left + w.width / 2),
      y: t.top + t.height / 2 - (w.top + w.height / 2),
      scale: t.width / w.width,
    });
  }, [phase]);

  if (!active) return null;

  const folded = phase !== "names";
  const showWord = phase === "word" || phase === "fly" || phase === "out";

  return (
    <motion.div
      aria-hidden
      onClick={finish}
      className="fixed inset-0 z-[1002] grid cursor-pointer place-items-center bg-bg-primary"
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="relative grid place-items-center">
        {/* the two names, folding together */}
        <motion.div
          className="flex items-baseline font-mono text-[clamp(1.4rem,5vw,2.2rem)]"
          animate={{ opacity: showWord ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span layout key="jyo" className="font-semibold text-text-display" transition={{ ease, duration: 0.4 }}>
              Jyo
            </motion.span>
            {!folded && (
              <motion.span
                key="ti"
                className="text-text-dim"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                ti
              </motion.span>
            )}
            {!folded && (
              <motion.span
                key="plus"
                className="px-4 text-text-ghost"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
              >
                +
              </motion.span>
            )}
            <motion.span layout key="ra" className="font-semibold text-text-display" transition={{ ease, duration: 0.4 }}>
              Ra
            </motion.span>
            {!folded && (
              <motion.span
                key="kesh"
                className="text-text-dim"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                kesh
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* …become the wordmark, then fly to the header */}
        <motion.span
          ref={wordRef}
          className="absolute font-display text-[clamp(3.5rem,12vw,5.5rem)] leading-none whitespace-nowrap text-text-display"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{
            opacity: showWord ? 1 : 0,
            filter: showWord ? "blur(0px)" : "blur(8px)",
            x: phase === "fly" || phase === "out" ? flight.x : 0,
            y: phase === "fly" || phase === "out" ? flight.y : 0,
            scale: phase === "fly" || phase === "out" ? flight.scale : 1,
          }}
          transition={{ duration: phase === "word" ? 0.25 : 0.42, ease }}
        >
          {profile.brandName}
        </motion.span>
      </div>

      <p className="absolute bottom-8 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-text-ghost">
        click to skip
      </p>
    </motion.div>
  );
}
