"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// hairline at the very top of the viewport that fills with page scroll
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-text-primary/70"
      style={{ scaleX }}
    />
  );
}
