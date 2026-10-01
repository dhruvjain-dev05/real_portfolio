"use client";

import { useLayoutEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { createPetals, type Petals } from "./petals";

// Dark theme: the looping dusk video. Light theme: the same valley on a
// snowy morning — a second render of the same shot, same framing, same
// 10s train crossing (light.mp4 is the first 211 frames of that render,
// re-timed to 10.005s so its train keeps pace with the dusk film's) — with petals drifting over it and its left, right
// and bottom edges fading into the page, so it sits in the white theme
// rather than on top of it.
//
// The two are run as one film. While the banner is on screen both play,
// and the hidden one is kept frame-locked to the visible one (a seek while
// it can't be seen, then tiny speed nudges), so a theme switch is just a
// crossfade with a soft glow breathing out of the sun — the scene re-lights
// and nothing jumps. A 0..1 daylight level drives it, so flipping the
// switch mid-way turns the fade around from wherever it is.

const LIGHT_SRC = "/banner/light.mp4?v=2";
const FADE_MS = 1200;
const SUN = "32% 40%"; // the sun's place in the visible crop (object-position 50% 30%)

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export default function ThemeBanner() {
  const darkRef = useRef<HTMLVideoElement>(null);
  const lightRef = useRef<HTMLVideoElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLCanvasElement>(null);

  // layout effect: when this mounts on a page reached while the site is
  // already in light mode, the day layer must be up before the first paint,
  // or the dusk video would flash for a moment first
  useLayoutEffect(() => {
    const html = document.documentElement;
    const dark = darkRef.current!;
    const light = lightRef.current!;
    const day = dayRef.current!;
    const glow = glowRef.current!;
    const petals: Petals = createPetals(petalsRef.current!);
    let level = 0; // 0 = dusk, 1 = day
    let target = 0;
    let raf = 0;
    let inView = true;
    let lightLoaded = false;

    // wrapped difference, so 9.9s vs 0.1s reads as 0.2s, not 9.8s
    const gapOf = (a: HTMLVideoElement, b: HTMLVideoElement) => {
      const d = a.duration || 10;
      let g = a.currentTime - b.currentTime;
      if (g > d / 2) g -= d;
      if (g < -d / 2) g += d;
      return g;
    };

    // keep the follower on the leader's frame
    const lockstep = () => {
      if (!inView || !lightLoaded) return;
      const [lead, follow] = level >= 0.5 ? [light, dark] : [dark, light];
      const hidden = follow === light ? level === 0 : level === 1;
      if (lead.paused) lead.play().catch(() => {});
      if (follow.paused) follow.play().catch(() => {});
      const g = gapOf(lead, follow);
      if (Math.abs(g) > 0.2 && hidden) {
        follow.currentTime = (lead.currentTime + 0.12) % (lead.duration || 10);
        follow.playbackRate = 1;
      } else {
        follow.playbackRate = 1 + Math.max(-0.15, Math.min(0.15, g * 1.5));
        lead.playbackRate = 1;
      }
    };
    const sync = setInterval(lockstep, 200);

    const render = () => {
      const e = ease(level);
      day.style.opacity = String(e);
      day.style.visibility = level > 0 ? "visible" : "hidden";
      glow.style.opacity = String(4 * e * (1 - e) * 0.55);
      if (level > 0 && inView) petals.start();
      else petals.stop();
    };

    const fade = () => {
      cancelAnimationFrame(raf);
      let prev = 0;
      const step = (now: number) => {
        const dt = prev ? Math.min(now - prev, 50) : 16;
        prev = now;
        level = target > level ? Math.min(target, level + dt / FADE_MS) : Math.max(target, level - dt / FADE_MS);
        render();
        if (level !== target) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // load the day film and bring it into lockstep while it's still hidden
    let loading: Promise<void> | null = null;
    const loadLight = () =>
      (loading ??= new Promise<void>((resolve) => {
        const done = () => {
          lightLoaded = true;
          lockstep();
          // give the hidden correction a moment to land before first use
          setTimeout(resolve, 250);
        };
        setTimeout(resolve, 1800); // never hold a switch hostage to a slow network
        if (light.readyState >= 3) return done();
        light.addEventListener("canplay", done, { once: true });
        light.preload = "auto";
        light.load();
      }));

    let token = 0;
    const apply = async (instant = false) => {
      const my = ++token;
      target = html.classList.contains("dark") ? 0 : 1;
      if (target) {
        // on arrival the day layer goes up at once (its poster covers until
        // the film is ready); on a live switch, wait for the film so the
        // crossfade is smooth
        if (instant) loadLight();
        else {
          await loadLight();
          if (my !== token) return;
        }
      }
      if (instant) {
        level = target;
        render();
      } else fade();
    };

    apply(true);
    const mo = new MutationObserver(() => {
      if ((html.classList.contains("dark") ? 0 : 1) !== target) apply();
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    // nothing decodes while the banner is scrolled away
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) lockstep();
      else {
        dark.pause();
        light.pause();
      }
      render();
    });
    io.observe(day);

    // fetch the day film once the browser is idle (skipped on data-saver),
    // so the first switch is instant without competing with the page load
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const warm = conn?.saveData ? 0 : idle(() => loadLight(), { timeout: 5000 });

    return () => {
      token++;
      if (warm) (window.cancelIdleCallback ?? clearTimeout)(warm);
      clearInterval(sync);
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      petals.destroy();
    };
  }, []);

  const video = "absolute inset-0 h-full w-full object-cover object-[50%_30%]";

  return (
    <>
      {/* object-position biased to 30% from the top — a plain center-crop
          cuts off the sun and mountain peaks; 30% keeps those plus the
          bridge and train in frame at this box's wide, short aspect ratio.
          Both films share the framing, so they line up exactly. */}
      <video ref={darkRef} poster="/banner/dusk-poster.webp" autoPlay loop muted playsInline preload="auto" className={video}>
        <source src={profile.bannerVideo} type="video/mp4" />
      </video>
      <div ref={dayRef} aria-hidden className="absolute inset-0" style={{ opacity: 0, visibility: "hidden" }}>
        {/* airier than the raw film: a touch brighter and softer, so it sits on white */}
        <video
          ref={lightRef}
          poster="/banner/light-poster.webp"
          loop
          muted
          playsInline
          preload="none"
          className={video}
          style={{ filter: "brightness(1.05) saturate(0.9) contrast(0.98)" }}
        >
          <source src={LIGHT_SRC} type="video/mp4" />
        </video>
        {/* the morning sun, breathing softly */}
        <div
          className="sun-breathe pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 31% 40%, rgba(255,244,222,0.6), rgba(255,244,222,0.14) 9%, transparent 24%)",
          }}
        />
        <canvas ref={petalsRef} className="absolute inset-0 block h-full w-full" />
        {/* edges melt into the page colour */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              // kept thin at the bottom: the train runs along that edge
              "linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 75%, transparent), transparent 0.9rem)",
              "linear-gradient(to right, color-mix(in srgb, var(--bg-primary) 80%, transparent), transparent 2.6rem)",
              "linear-gradient(to bottom, color-mix(in srgb, var(--bg-primary) 30%, transparent), transparent 1.6rem)",
              "linear-gradient(to left, color-mix(in srgb, var(--bg-primary) 80%, transparent), transparent 2.6rem)",
            ].join(","),
          }}
        />
      </div>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
        style={{ background: `radial-gradient(circle at ${SUN}, rgba(255,222,170,0.9), transparent 70%)` }}
      />
    </>
  );
}
