"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  FOLLOW_THROUGH,
  KICK,
  KICK_BALL,
  RUN,
  SHEET,
  applyBall,
  applySprite,
  clamp,
  easeInOutCubic,
  easeInQuad,
  easeOutCubic,
  easeOutQuad,
  kickLeft,
  showFrame,
  size,
} from "./sprite";

// First visit of a session, home page only: an empty pitch line, the ball
// drops onto the centre spot, a pixel Messi runs in and strikes it straight at
// the screen — the impact ignites and burns a hole that opens the portfolio.
//
// Whether it plays is decided by the pre-paint script in layout.tsx (it sets
// window.__jyoraKickoff and paints a cover via html[data-kickoff]), so the
// page never flashes underneath. /?kickoff forces a replay. Click or any key
// skips.

const SEEN_KEY = "jyora:kickoff";

// timeline, ms from start
const T_DROP = 150;
const T_RUN = 450;
const RUN_MS = 1000;
const T_KICK = 1570;
const FRAME_MS = 80;
const T_LAUNCH = T_KICK + KICK.length * FRAME_MS;
const FLIGHT_MS = 680;
const T_IMPACT = T_LAUNCH + FLIGHT_MS;
const T_EXIT = T_LAUNCH + 120;
const EXIT_MS = 650;
const T_REVEAL = T_IMPACT + 60;
const REVEAL_MS = 900;

const GRAVITY = 2600;
const NEAR = 0.18; // ball depth at impact (1 = on the pitch) → ~5.5× bigger
const SPARKS = 18;
const SPARK_COLORS = ["#f4c430", "#a50044", "#1d4fa8", "var(--accent-amber)", "var(--text-display)"];

type KickoffWindow = Window & { __jyoraKickoff?: boolean };
const noopSubscribe = () => () => {};

export default function KickoffIntro() {
  const wants = useSyncExternalStore(
    noopSubscribe,
    () => !!(window as KickoffWindow).__jyoraKickoff,
    () => false
  );
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const emberRef = useRef<SVGCircleElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wants) return;
    const html = document.documentElement;
    // the cover hands over to this overlay (re-applied: dev remounts clear it)
    html.setAttribute("data-kickoff", "live");

    const root = rootRef.current!;
    const stage = stageRef.current!;
    const line = lineRef.current!;
    const caption = captionRef.current!;
    const player = playerRef.current!;
    const sprite = spriteRef.current!;
    const ball = ballRef.current!;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w, h, ball: D } = size(clamp(vh * 0.16, 84, 124));
    const groundY = Math.round(vh * 0.62);
    const spot = Math.round(vw / 2);
    const hit = { x: vw / 2, y: Math.round(vh * 0.34) };
    const radius = Math.hypot(Math.max(hit.x, vw - hit.x), Math.max(hit.y, vh - hit.y)) + 80;
    const startLeft = -w - 24;
    const plantLeft = kickLeft(spot, 3, w);
    const launch = { x: plantLeft + KICK_BALL[3].x * w, y: groundY - KICK_BALL[3].y * h };

    applySprite(sprite, w, h);
    applyBall(ball, D);
    line.style.top = `${groundY}px`;
    caption.style.top = `${groundY + 16}px`;
    showFrame(sprite, RUN[0], w);

    const put = (el: HTMLElement, x: number, y: number, extra = "") =>
      (el.style.transform = `translate3d(${x}px,${y}px,0)${extra}`);
    put(player, startLeft, groundY - h);

    // ball state for the drop onto the centre spot
    let by = -D;
    let vy = 0;
    let settled = false;

    let raf = 0;
    let t0 = 0;
    let last = 0;
    let impacted = false;
    let revealing = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      (window as KickoffWindow).__jyoraKickoff = false;
      html.removeAttribute("data-kickoff");
      setDone(true);
    };

    const startReveal = () => {
      revealing = true;
      html.setAttribute("data-kickoff", "reveal"); // page scrollable again
      root.style.pointerEvents = "none";
    };

    const ignite = () => {
      ball.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, fill: "forwards" });
      flashRef.current!.style.background = `radial-gradient(circle at ${hit.x}px ${hit.y}px, color-mix(in srgb, var(--accent-amber) 42%, transparent), transparent ${Math.round(vh * 0.45)}px)`;
      flashRef.current!.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], {
        duration: 560,
        easing: "ease-out",
      });
      for (const c of [ringRef.current!, emberRef.current!]) {
        c.setAttribute("cx", String(hit.x));
        c.setAttribute("cy", String(hit.y));
      }
      // embers thrown out of the impact, falling as they fade
      Array.from(sparksRef.current!.children).forEach((el, i) => {
        const a = (i / SPARKS) * Math.PI * 2 + Math.random() * 0.35;
        const d = 80 + Math.random() * 150;
        const x = hit.x + Math.cos(a) * d;
        const y = hit.y + Math.sin(a) * d;
        (el as HTMLElement).animate(
          [
            { transform: `translate(${hit.x}px,${hit.y}px) scale(1)`, opacity: 1 },
            { transform: `translate(${x}px,${y}px) scale(0.9)`, opacity: 1, offset: 0.55 },
            { transform: `translate(${x + Math.cos(a) * 16}px,${y + 46}px) scale(0.3)`, opacity: 0 },
          ],
          { duration: 700 + Math.random() * 300, easing: "cubic-bezier(0.15, 0.7, 0.35, 1)", fill: "forwards" }
        );
      });
    };

    const tick = (now: number) => {
      if (!t0) {
        t0 = now;
        line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration: 620,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        });
        caption.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 350, fill: "forwards" });
      }
      const t = now - t0;
      const dt = last ? Math.min((now - last) / 1000, 0.033) : 0;
      last = now;

      // ── ball: drops onto the centre spot and settles
      if (t >= T_DROP && t < T_KICK) {
        if (!settled) {
          vy += GRAVITY * dt;
          by += vy * dt;
          const floor = groundY - D / 2;
          if (by >= floor) {
            by = floor;
            if (vy > 140) vy = -vy * 0.42;
            else settled = true;
          }
        }
        ball.style.opacity = "1";
        put(ball, spot - D / 2, by - D / 2);
      }

      // ── Messi
      if (t >= T_RUN && t < T_KICK) {
        const p = clamp((t - T_RUN) / RUN_MS);
        put(player, startLeft + (kickLeft(spot, 0, w) - startLeft) * easeOutQuad(p), groundY - h);
        showFrame(sprite, p < 1 ? RUN[Math.floor((t - T_RUN) / 80) % 4] : 0, w);
      } else if (t >= T_KICK && t < T_EXIT) {
        // the kick frames draw their own ball — ours hands over to it
        const k = Math.min(KICK.length - 1, Math.floor((t - T_KICK) / FRAME_MS));
        ball.style.opacity = t < T_LAUNCH ? "0" : "1";
        put(player, kickLeft(spot, k, w), groundY - h);
        showFrame(sprite, t < T_LAUNCH ? KICK[k] : FOLLOW_THROUGH, w);
      } else if (t >= T_EXIT) {
        const p = clamp((t - T_EXIT) / EXIT_MS);
        put(player, plantLeft + (vw + 24 - plantLeft) * easeInQuad(p), groundY - h);
        showFrame(sprite, RUN[Math.floor((t - T_EXIT) / 75) % 4], w);
      }

      // ── the strike: straight at the camera, perspective-correct
      if (t >= T_LAUNCH && t < T_IMPACT) {
        const p = (t - T_LAUNCH) / FLIGHT_MS;
        const s = 1 / (1 - (1 - NEAR) * p);
        const f = (s - 1) / (1 / NEAR - 1);
        const x = launch.x + (hit.x - launch.x) * f;
        const y = launch.y + (hit.y - launch.y) * f - Math.sin(Math.PI * f) * vh * 0.06;
        put(ball, x - D / 2, y - D / 2, ` scale(${s}) rotate(${p * 620}deg)`);
        if (p > 0.02) caption.style.opacity = String(clamp(1 - p * 3));
      }

      if (t >= T_IMPACT && !impacted) {
        impacted = true;
        ignite();
      }
      // shockwave + a thinner ring of fire just behind it; radius grows, the
      // stroke stays hairline (scaling a bordered box would fatten it)
      if (impacted) {
        const q = clamp((t - T_IMPACT) / 950);
        const e = clamp((t - T_IMPACT - 70) / 720);
        ringRef.current!.setAttribute("r", String(8 + easeOutCubic(q) * radius));
        ringRef.current!.style.opacity = String(0.7 * (1 - q));
        emberRef.current!.setAttribute("r", String(6 + easeOutCubic(e) * radius * 0.55));
        emberRef.current!.setAttribute("stroke-width", String(0.75 + 2.5 * (1 - e)));
        emberRef.current!.style.opacity = String(e > 0 ? 0.95 * (1 - e) : 0);
      }

      // ── the burn-through: a soft-edged hole grows from the impact point
      if (t >= T_REVEAL) {
        if (!revealing) startReveal();
        const p = clamp((t - T_REVEAL) / REVEAL_MS);
        const r = easeInOutCubic(p) * radius;
        const mask = `radial-gradient(circle at ${hit.x}px ${hit.y}px, transparent ${r}px, #000 ${r + 24 + r * 0.1}px)`;
        stage.style.maskImage = mask;
        stage.style.webkitMaskImage = mask;
        if (p >= 1) return finish();
      }

      raf = requestAnimationFrame(tick);
    };

    const skip = () => {
      if (revealing || finished) return;
      cancelAnimationFrame(raf);
      startReveal();
      stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "ease-out", fill: "forwards" })
        .onfinish = finish;
    };
    root.addEventListener("click", skip);
    window.addEventListener("keydown", skip);

    // don't start until the sprite is decoded (bounded, so a slow network
    // can't hold the page hostage)
    const img = new Image();
    img.src = SHEET;
    const wait = setTimeout(() => (raf = requestAnimationFrame(tick)), 1200);
    img
      .decode()
      .catch(() => {})
      .then(() => {
        clearTimeout(wait);
        if (!t0 && !finished) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
        }
      });

    return () => {
      clearTimeout(wait);
      cancelAnimationFrame(raf);
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      if (!finished) html.removeAttribute("data-kickoff");
    };
  }, [wants]);

  if (!wants || done) return null;

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[1003] cursor-pointer select-none">
      <div ref={stageRef} className="absolute inset-0 overflow-hidden bg-bg-primary">
        <div
          ref={lineRef}
          className="absolute inset-x-0 border-t border-dashed border-rule-strong"
          style={{ transform: "scaleX(0)" }}
        />
        <p
          ref={captionRef}
          className="absolute inset-x-0 text-center font-mono text-[0.6rem] uppercase tracking-[0.32em] text-text-dim opacity-0"
        >
          Kick-off
        </p>
        <div ref={playerRef} className="absolute left-0 top-0 will-change-transform">
          <span className="absolute -bottom-1 left-[48%] h-1.5 w-[42%] -translate-x-1/2 rounded-[50%] bg-text-primary/10 blur-[2px]" />
          <div ref={spriteRef} className="relative" />
        </div>
        <div ref={ballRef} className="absolute left-0 top-0 opacity-0 will-change-transform" />
        <p className="absolute inset-x-0 bottom-8 text-center font-mono text-[0.58rem] uppercase tracking-[0.2em] text-text-ghost">
          click to skip
        </p>
      </div>

      {/* impact effects sit above the stage so they also flare over the page */}
      <div className="pointer-events-none absolute inset-0">
        <div ref={flashRef} className="absolute inset-0 opacity-0" />
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <circle ref={ringRef} r="0" fill="none" stroke="var(--text-display)" strokeWidth="1" opacity="0" />
          <circle ref={emberRef} r="0" fill="none" stroke="var(--accent-amber)" opacity="0" />
        </svg>
        <div ref={sparksRef}>
          {Array.from({ length: SPARKS }, (_, i) => (
            <span
              key={i}
              className="absolute -left-[2.5px] -top-[2.5px] h-[5px] w-[5px] opacity-0"
              style={{ background: SPARK_COLORS[i % SPARK_COLORS.length] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
