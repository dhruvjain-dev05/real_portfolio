"use client";

import { useEffect, useRef } from "react";
import { HiArrowUp } from "react-icons/hi";
import {
  FOLLOW_THROUGH,
  KICK,
  KICK_BALL,
  LOOK,
  RUN,
  REST_X,
  applyBall,
  applySprite,
  clamp,
  easeInOutCubic,
  easeOutQuad,
  kickLeft,
  roll,
  showFrame,
  size,
} from "./sprite";

// "Back to top", with a footballer. When the footer comes into view he
// dribbles in beside the button; pressing it makes him boot the ball straight
// up — the page scrolls after it, and the ball drops back onto the hero
// banner, bounces, rolls and fades. Once the footer is left behind he resets,
// ready to run in with a fresh ball next time.

const { w: W, h: H, ball: D } = size(62);
const REST_BALL_X = -16 - D / 2; // ball centre, px from the button's left edge
const SPOT = REST_BALL_X - REST_X * W; // his cell's left edge when on the ball
const ENTER_FROM = SPOT - 150;
const GRAVITY = 2600;

type State = "away" | "entering" | "ready" | "kicking" | "spent";

export default function BackToTopKick() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const wrap = wrapRef.current!;
    const player = playerRef.current!;
    const sprite = spriteRef.current!;
    const rest = restRef.current!;
    const fly = flyRef.current!;
    applySprite(sprite, W, H);
    applyBall(rest, D);
    applyBall(fly, D);

    let state: State = "away";
    let raf = 0;
    let flightRaf = 0;
    let look: ReturnType<typeof setTimeout> | undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let stopScroll = () => {};

    const place = (left: number) => (player.style.transform = `translate3d(${left}px,0,0)`);
    const putBall = (x: number, rot = 0) =>
      (rest.style.transform = `translate3d(${x - D / 2}px,0,0) rotate(${rot}deg)`);
    const visible = (on: boolean) => {
      player.style.opacity = rest.style.opacity = on ? "1" : "0";
    };

    // standing about: a glance around every few seconds
    const scheduleLook = () => {
      clearTimeout(look);
      look = setTimeout(() => {
        if (state !== "ready") return;
        LOOK.forEach((f, i) => timers.push(setTimeout(() => state === "ready" && showFrame(sprite, f, W), i * 150)));
        scheduleLook();
      }, 5000 + Math.random() * 4000);
    };

    const enter = () => {
      state = "entering";
      visible(true);
      const t0 = performance.now();
      const ms = 900;
      const step = (now: number) => {
        const p = clamp((now - t0) / ms);
        const left = ENTER_FROM + (SPOT - ENTER_FROM) * easeOutQuad(p);
        place(left);
        putBall(left + REST_X * W, roll(left - ENTER_FROM, D));
        showFrame(sprite, p < 1 ? RUN[Math.floor((now - t0) / 85) % 4] : 0, W);
        if (p < 1) raf = requestAnimationFrame(step);
        else {
          state = "ready";
          scheduleLook();
        }
      };
      raf = requestAnimationFrame(step);
    };

    const reset = () => {
      state = "away";
      rest.style.transition = "";
      visible(false);
      showFrame(sprite, 0, W);
      place(ENTER_FROM);
      putBall(ENTER_FROM + REST_X * W);
    };
    reset();

    // eased scroll we control, so the ball's return can be timed to it; any
    // wheel/touch from the visitor takes over immediately
    const scrollToTop = (onDone: (completed: boolean) => void) => {
      const from = window.scrollY;
      const ms = clamp(700 + from * 0.1, 900, 1700);
      const t0 = performance.now();
      let id = 0;
      const end = (completed: boolean) => {
        cancelAnimationFrame(id);
        window.removeEventListener("wheel", abort);
        window.removeEventListener("touchstart", abort);
        stopScroll = () => {};
        onDone(completed);
      };
      const abort = () => end(false);
      const step = (now: number) => {
        const p = clamp((now - t0) / ms);
        window.scrollTo({ top: from * (1 - easeInOutCubic(p)), behavior: "instant" });
        if (p < 1) id = requestAnimationFrame(step);
        else end(true);
      };
      window.addEventListener("wheel", abort, { passive: true });
      window.addEventListener("touchstart", abort, { passive: true });
      stopScroll = () => end(false);
      id = requestAnimationFrame(step);
    };

    // the kicked ball, in viewport space: up and out, then back down onto the
    // hero banner's bottom edge once the page has arrived
    const flight = (x: number, y: number) => {
      let bx = x;
      let by = y;
      let vx = 90;
      let vy = -2300;
      let rot = 0;
      let phase: "up" | "wait" | "drop" | "gone" = "up";
      let arrived = false;
      let landedAt = 0;
      let fading = false;
      let last = 0;
      const banner = () => document.querySelector("main video")?.parentElement?.getBoundingClientRect();
      const gone = () => {
        phase = "gone";
        fly.style.opacity = "0";
      };

      scrollToTop((completed) => {
        if (completed) arrived = true;
        else gone(); // the visitor took over the scroll
      });

      // keeps rolling while it fades, then the loop stops
      const fade = () => {
        fading = true;
        const a = fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320 });
        a.onfinish = gone;
      };

      fly.style.opacity = "1";
      const step = (now: number) => {
        const dt = last ? Math.min((now - last) / 1000, 0.033) : 0.016;
        last = now;

        if (phase === "up") {
          vy += GRAVITY * dt;
          bx += vx * dt;
          by += vy * dt;
          if (by < -D * 2) {
            phase = "wait";
            fly.style.opacity = "0";
          }
        } else if (phase === "wait" && arrived) {
          const b = banner();
          bx = b ? clamp(bx, b.left + 60, b.right - 60) : window.innerWidth / 2;
          by = -D;
          vx = -70;
          vy = 380;
          phase = "drop";
          fly.style.opacity = "1";
        } else if (phase === "drop") {
          vy += GRAVITY * dt;
          bx += vx * dt;
          by += vy * dt;
          const b = banner();
          const floor = b && bx > b.left && bx < b.right ? b.bottom - D / 2 : Infinity;
          if (by >= floor) {
            by = floor;
            vy = vy > 160 ? -vy * 0.45 : 0;
            vx *= Math.exp(-2.5 * dt);
            landedAt ||= now;
          }
          if (!fading && ((landedAt && now - landedAt > 1300) || by > window.innerHeight + D)) fade();
        }

        rot +=roll(vx * dt, D) + (phase === "up" ? 900 * dt : 0);
        fly.style.transform = `translate3d(${bx - D / 2}px,${by - D / 2}px,0) rotate(${rot}deg)`;
        if (phase !== "gone") flightRaf = requestAnimationFrame(step);
      };
      cancelAnimationFrame(flightRaf);
      flightRaf = requestAnimationFrame(step);
    };

    kickRef.current = () => {
      if (state === "kicking") return;
      if (state !== "ready" && state !== "entering") {
        // no ball at his feet: just the trip up
        scrollToTop(() => {});
        return;
      }
      cancelAnimationFrame(raf);
      clearTimeout(look);
      state = "kicking";
      putBall(REST_BALL_X);

      // strike: the kick frames draw their own ball, so ours hands over
      KICK.forEach((f, k) =>
        timers.push(
          setTimeout(() => {
            showFrame(sprite, f, W);
            place(kickLeft(REST_BALL_X, k, W));
            if (k === 0) {
              rest.style.transition = "none"; // instant hand-over, no double ball
              rest.style.opacity = "0";
            }
          }, k * 75)
        )
      );
      timers.push(
        setTimeout(() => {
          const r = wrap.getBoundingClientRect();
          const left = kickLeft(REST_BALL_X, 3, W);
          flight(r.left + left + KICK_BALL[3].x * W, r.bottom - KICK_BALL[3].y * H);
          showFrame(sprite, FOLLOW_THROUGH, W);
        }, KICK.length * 75),
        setTimeout(() => {
          showFrame(sprite, 0, W);
          place(SPOT);
          state = "spent";
        }, KICK.length * 75 + 260)
      );
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && state === "away") enter();
        else if (!e.isIntersecting && state === "spent") reset();
      },
      { threshold: 0.6 }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(flightRaf);
      clearTimeout(look);
      timers.forEach(clearTimeout);
      stopScroll();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative mt-9 inline-flex">
      <div
        ref={playerRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 opacity-0 transition-opacity duration-200"
      >
        <span className="absolute -bottom-0.5 left-[48%] h-1 w-[40%] -translate-x-1/2 rounded-[50%] bg-text-primary/10 blur-[1.5px]" />
        <div ref={spriteRef} className="relative" />
      </div>
      <div
        ref={restRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 opacity-0 transition-opacity duration-200"
      />
      <div ref={flyRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[1001] opacity-0" />

      <button
        type="button"
        onClick={() => kickRef.current()}
        className="group inline-flex items-center gap-2 rounded-full border border-dashed border-rule-strong px-4 py-1.5 font-mono text-[0.7rem] text-text-muted transition-colors hover:border-solid hover:border-text-ghost hover:text-text-primary"
      >
        Back to top
        <HiArrowUp className="transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
}
