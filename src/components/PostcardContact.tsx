"use client";

import { useId, useState } from "react";
import { HiOutlineCheck, HiOutlinePaperAirplane } from "react-icons/hi";
import { profile } from "@/data/profile";

// A simple contact card. Sending opens the visitor's mail app with everything
// pre-filled (no backend needed).

const address = profile.email.replace("mailto:", "");
const topics = ["Job opportunity", "Project", "Collaboration", "Just saying hi"];

export default function PostcardContact() {
  const uid = useId();
  const [topic, setTopic] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const who = name.trim() || "A visitor";
    const subject = topic ? `${topic} — ${who}` : `Hello from ${who}`;
    const body = `${msg.trim()}\n\n— ${who}${from.trim() ? `\n${from.trim()}` : ""}`;
    window.location.href = `${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const label = "font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-dim";
  const field =
    "mt-1.5 w-full rounded-md border border-rule-strong bg-bg-surface px-3 py-2 text-[0.82rem] text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-text-dim";

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <form onSubmit={send} className="rounded-xl border border-rule-strong bg-bg-surface-subtle p-5 md:p-6">
        <p className={label} id={`${uid}-t`}>
          What&apos;s it about?
        </p>
        <div role="group" aria-labelledby={`${uid}-t`} className="mt-2 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
              className={`surface-3d btn-pop rounded-md border px-3 py-1 text-[0.72rem] font-medium ${
                topic === t ? "!bg-text-display !text-bg-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-n`} className={label}>
              Name
            </label>
            <input
              id={`${uid}-n`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={field}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-e`} className={label}>
              Email
            </label>
            <input
              id={`${uid}-e`}
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              className={field}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor={`${uid}-m`} className={label}>
            Message
          </label>
          <textarea
            id={`${uid}-m`}
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
              setSent(false);
            }}
            required
            rows={5}
            placeholder={`Hi ${profile.name.split(" ")[0]}, …`}
            className={`${field} resize-none leading-[1.6]`}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-mono text-[0.64rem] text-text-dim" aria-live="polite">
            {sent ? (
              <>
                <HiOutlineCheck className="text-status-active" /> Mail app opened — press send there.
              </>
            ) : (
              "Opens in your mail app, pre-filled."
            )}
          </p>
          <button
            type="submit"
            className="surface-3d btn-pop inline-flex items-center gap-2 rounded-md border px-4 py-1.5 text-[0.78rem] font-medium text-text-primary"
          >
            {sent ? "Send again" : "Send message"}
            <HiOutlinePaperAirplane className="rotate-90" />
          </button>
        </div>
      </form>

      <p className="mt-4 text-center font-mono text-[0.68rem] text-text-dim">
        Prefer email?{" "}
        <a href={profile.email} className="text-text-secondary underline decoration-dashed underline-offset-4 hover:text-text-primary">
          {address}
        </a>
        {" · "}
        <button type="button" onClick={copy} className="underline decoration-dashed underline-offset-4 hover:text-text-primary">
          {copied ? "copied ✓" : "copy"}
        </button>
      </p>
    </div>
  );
}
