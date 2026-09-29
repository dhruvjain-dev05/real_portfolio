"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const WORDS = ["Build", "Ship", "Repeat"];
const COPIES = 4; // the strip is 4 identical sets; it loops by sliding one set (25%)

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Outlined type that drifts on its own, then speeds up, reverses and leans
// with how fast the page is being scrolled — it reacts to the visitor's hand.
export default function VelocityMarquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5]);
  const skewX = useTransform(velocity, [-2000, 0, 2000], [7, 0, -7], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    baseX.set(baseX.get() + direction.current * (1 + Math.abs(b)) * 0.35 * (delta / 1000) * 4);
  });

  return (
    <div
      aria-hidden
      className="-mx-5 overflow-hidden border-t border-dashed border-rule-strong py-6 select-none md:-mx-6"
    >
      <motion.div style={{ x, skewX }} className="flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: COPIES }).map((_, c) => (
          <div key={c} className="flex shrink-0 items-center">
            {WORDS.map((w) => (
              <span key={w} className="flex items-center">
                <span
                  className="px-5 font-display text-[clamp(3rem,10vw,5.5rem)] leading-none text-transparent transition-colors duration-300 hover:text-text-display"
                  style={{ WebkitTextStroke: "1px var(--text-ghost)" }}
                >
                  {w}
                </span>
                <span className="text-[1.4rem] text-text-ghost">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
