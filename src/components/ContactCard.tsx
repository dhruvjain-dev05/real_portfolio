"use client";

import { useState } from "react";
import PostcardContact from "./PostcardContact";
import TerminalCard from "./TerminalCard";

// One card, two ways to reach out: write a message, or poke around a tiny terminal.
const tabs = [
  { id: "message", label: "Message" },
  { id: "terminal", label: "Terminal" },
] as const;

export default function ContactCard() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("message");

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div
        role="tablist"
        aria-label="Contact mode"
        className="mx-auto mb-4 flex w-fit items-center gap-1 rounded-xl border border-dashed border-rule-strong p-1"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-1.5 font-mono text-[0.72rem] transition-colors ${
              tab === t.id ? "bg-text-display text-bg-primary" : "text-text-muted hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "message" ? <PostcardContact /> : <TerminalCard />}
    </div>
  );
}
