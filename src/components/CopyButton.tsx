"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";

// Icon morphs clipboard → check for 1.6s after a successful copy.
export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked (insecure origin / permissions) — nothing to undo
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text-muted ring-1 ring-rule transition-colors hover:bg-bg-surface hover:text-text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.16 }}
          className={copied ? "text-status-active" : ""}
        >
          {copied ? <HiCheck size={16} /> : <HiOutlineClipboardCopy size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
