"use client";

import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { profile } from "@/data/profile";

const field =
  "w-full rounded-lg bg-bg-surface-subtle px-3.5 py-2.5 text-[0.88rem] text-text-primary ring-1 ring-rule outline-none transition-shadow placeholder:text-text-ghost focus:ring-border-hover";

// No backend: submitting opens the visitor's mail app with the message filled in.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={submit} className="mt-10 grid max-w-[520px] gap-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className={field}
      />
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's on your mind?"
        aria-label="Message"
        className={`${field} resize-none`}
      />
      <button
        type="submit"
        className="group inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[0.82rem] text-text-primary ring-1 ring-rule-strong transition-all hover:-translate-y-0.5 hover:ring-border-hover"
      >
        Send message
        <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
