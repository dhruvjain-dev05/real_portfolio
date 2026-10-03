"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { socialLinks } from "@/data/socialLinks";

// A tiny, safe "terminal" for visitors: it only prints facts from the site's own
// data files and opens links — nothing is executed.

type Line = { text: string; href?: string };
type Entry = { cmd: string; lines: Line[] };

const email = profile.email.replace("mailto:", "");
const link = (name: string) => socialLinks.find((l) => l.name === name)!;

const COMMANDS = ["help", "about", "skills", "projects", "experience", "contact", "github", "resume", "clear"] as const;
const CHIPS = ["about", "skills", "projects", "contact"];

function run(raw: string): Line[] | "clear" {
  const [cmd, ...rest] = raw.trim().toLowerCase().split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return [
        { text: "Available commands:" },
        ...COMMANDS.map((c) => ({ text: `  ${c}` })),
        { text: "  open <project>   e.g. open knowrex" },
      ];
    case "about":
      return [
        { text: `${profile.name} — ${profile.roles.join(" · ")}` },
        { text: `${profile.location} · ${profile.status}` },
      ];
    case "skills":
      return skillGroups.map((g) => ({ text: `${g.label.padEnd(10)} ${g.items.map((i) => i.name).join(", ")}` }));
    case "projects":
      return [
        ...featuredProjects.map((p) => ({ text: `${p.name} — ${p.kind ?? ""}`.trim(), href: p.live })),
        { text: 'Tip: "open <project>" opens it live.' },
      ];
    case "experience":
      return experience.map((e) => ({ text: `${e.company} — ${e.role} (${e.dates})` }));
    case "contact":
      return [
        { text: email, href: profile.email },
        { text: "LinkedIn", href: link("LinkedIn").url },
        { text: "X", href: link("X").url },
      ];
    case "github":
      return [{ text: link("GitHub").url, href: link("GitHub").url }];
    case "resume":
      return [{ text: "Download resume (PDF)", href: link("Resume").url }];
    case "open": {
      const p = featuredProjects.find((x) => x.name.toLowerCase() === arg);
      if (!p) return [{ text: `No project named "${arg}". Try: projects` }];
      if (!p.live) return [{ text: `${p.name} has no live link.` }];
      return [{ text: `Opening ${p.name}…`, href: p.live }];
    }
    case "clear":
      return "clear";
    case "":
      return [];
    default:
      return [{ text: `command not found: ${cmd}. Type "help".` }];
  }
}

export default function TerminalCard() {
  const [history, setHistory] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const exec = (raw: string) => {
    const result = run(raw);
    if (result === "clear") setHistory([]);
    else setHistory((h) => [...h, { cmd: raw.trim(), lines: result }]);
    setValue("");
    // keep the newest output in view — scroll the box, never the page
    requestAnimationFrame(() => {
      const el = outRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  return (
    <div className="rounded-xl border border-rule-strong bg-bg-surface-subtle p-5 md:p-6">
      <div
        ref={outRef}
        className="h-[15.5rem] overflow-y-auto font-mono text-[0.74rem] leading-[1.7] text-text-secondary"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        <p className="text-text-muted">
          Hi — I&apos;m a tiny terminal. Type <span className="text-text-primary">help</span>, or tap a command below.
        </p>
        {history.map((h, i) => (
          <div key={i} className="mt-2">
            <p className="text-text-primary">
              <span className="text-status-active">$</span> {h.cmd}
            </p>
            {h.lines.map((l, j) =>
              l.href ? (
                <a
                  key={j}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="block whitespace-pre-wrap break-words underline decoration-dashed underline-offset-4 hover:text-text-primary"
                >
                  {l.text}
                </a>
              ) : (
                <p key={j} className="whitespace-pre-wrap break-words">
                  {l.text}
                </p>
              )
            )}
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex items-center gap-2 border-t border-dashed border-rule-strong pt-3 font-mono"
        onSubmit={(e) => {
          e.preventDefault();
          exec(value);
        }}
      >
        <span aria-hidden className="text-status-active">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Terminal command"
          placeholder="type a command"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-dim sm:text-[0.8rem]"
        />
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => exec(c)}
            className="surface-3d btn-pop rounded-md border px-2.5 py-2.5 font-mono text-[0.68rem] sm:py-1.5 text-text-secondary hover:text-text-primary"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
