"use client";

import { useId, useState } from "react";
import { HiOutlineCheck, HiOutlineExternalLink, HiOutlinePaperAirplane } from "react-icons/hi";
import { profile } from "@/data/profile";

// A simple contact card. "Send" opens the visitor's mail app pre-filled; for
// people with no mail app set up (most webmail users) there is an "Open in
// Gmail" link carrying the same text. No backend needed.

const address = profile.email.replace("mailto:", "");
const topics = ["Job opportunity", "Project", "Collaboration", "Just saying hi"];

export default function PostcardContact() {
  const uid = useId();
  const [topic, setTopic] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const content = () => {
    const who = name.trim() || "A visitor";
    return {
      subject: topic ? `${topic} — ${who}` : `Hello from ${who}`,
      body: `${msg.trim()}\n\n— ${who}${from.trim() ? `\n${from.trim()}` : ""}`,
    };
  };
  const q = (s: string) => encodeURIComponent(s);

  // backup for people who use a desktop mail app instead of Gmail
  const mailApp = () => {
    if (!msg.trim()) return;
    const { subject, body } = content();
    window.location.href = `${profile.email}?subject=${q(subject)}&body=${q(body)}`;
    setSent(true);
  };

  // main action: opens a Gmail compose tab, pre-filled
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    gmail();
  };

  const gmail = () => {
    if (!msg.trim()) return;
    const { subject, body } = content();
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${q(address)}&su=${q(subject)}&body=${q(body)}`,
      "_blank",
      "noopener"
    );
    setSent(true);
  };

  // labels stay legible (≥10.5px, muted not dim); fields are 16px on phones so
  // iOS doesn't zoom the page when one is focused
  const label = "font-mono text-[0.66rem] uppercase tracking-[0.16em] text-text-muted";
  const field =
    "mt-1.5 w-full rounded-md border border-rule-strong bg-bg-surface px-3 py-2.5 text-base text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-text-dim sm:py-2 sm:text-[0.85rem]";

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <form onSubmit={send} className="rounded-xl border border-rule-strong bg-bg-surface-subtle p-5 md:p-6">
        <p className={label} id={`${uid}-t`}>
          What&apos;s it about?
        </p>
        <div role="group" aria-labelledby={`${uid}-t`} className="mt-2.5 flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
              className={`surface-3d btn-pop inline-flex items-center gap-1 rounded-md border px-3 py-2 text-[0.76rem] font-medium sm:py-1.5 ${
                topic === t
                  ? "!border-text-display !bg-text-display !text-bg-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {topic === t && <HiOutlineCheck aria-hidden className="-ml-0.5 shrink-0" size={13} />}
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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-h-5 items-center gap-1.5 font-mono text-[0.68rem] text-text-muted" aria-live="polite">
            {sent ? (
              <>
                <HiOutlineCheck className="shrink-0 text-status-active" /> Almost there — press send in your mail.
              </>
            ) : (
              "Opens Gmail with your message ready."
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={mailApp}
              disabled={!msg.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[0.76rem] font-medium text-text-secondary transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-40"
            >
              Use mail app <HiOutlineExternalLink size={13} />
            </button>
            <button
              type="submit"
              className="surface-3d btn-pop inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-[0.8rem] font-medium text-text-primary sm:py-2"
            >
              {sent ? "Send again" : "Send message"}
              <HiOutlinePaperAirplane className="rotate-90" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
