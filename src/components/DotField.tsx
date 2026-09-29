"use client";

import { useEffect, useRef } from "react";

const GAP = 16;
const RADIUS = 110; // cursor influence
const SPRING = 0.09;
const DAMP = 0.82;

interface Dot {
  hx: number; // home position
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// A field of dots on springs. The cursor pushes them away, a click sends a
// shockwave through the field, and the whole thing breathes slowly when
// nobody is touching it. Canvas, one rAF loop, paused while off-screen.
export default function DotField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let color = "128,128,128";
    let frame = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    const waves: { x: number; y: number; r: number }[] = [];

    const readColor = () => {
      const c = getComputedStyle(canvas).color.match(/\d+(\.\d+)?/g);
      if (c) color = `${c[0]},${c[1]},${c[2]}`;
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.floor(w / GAP);
      const rows = Math.floor(h / GAP);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * GAP;
          const y = oy + r * GAP;
          dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
      readColor();
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduce) {
          // slow ambient breathing so it is alive without a cursor
          const amb = Math.sin(d.hx * 0.02 + d.hy * 0.015 + t * 0.0008) * 1.4;
          let fx = (d.hx + amb - d.x) * SPRING;
          let fy = (d.hy + amb - d.y) * SPRING;

          if (pointer.active) {
            const dx = d.x - pointer.x;
            const dy = d.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < RADIUS && dist > 0.01) {
              const push = (1 - dist / RADIUS) ** 2 * 5;
              fx += (dx / dist) * push;
              fy += (dy / dist) * push;
            }
          }
          for (const wv of waves) {
            const dx = d.x - wv.x;
            const dy = d.y - wv.y;
            const dist = Math.hypot(dx, dy);
            const band = Math.abs(dist - wv.r);
            if (band < 26 && dist > 0.01) {
              const push = (1 - band / 26) * 3.2;
              fx += (dx / dist) * push;
              fy += (dy / dist) * push;
            }
          }
          d.vx = (d.vx + fx) * DAMP;
          d.vy = (d.vy + fy) * DAMP;
          d.x += d.vx;
          d.y += d.vy;
        }

        // dots grow and brighten the further they are thrown from home
        const off = Math.hypot(d.x - d.hx, d.y - d.hy);
        const k = Math.min(off / 14, 1);
        ctx.fillStyle = `rgba(${color},${0.28 + k * 0.6})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.1 + k * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].r += 5;
        if (waves[i].r > Math.max(w, h) * 1.1) waves.splice(i, 1);
      }
    };

    const loop = (t: number) => {
      if (!visible) return;
      if (++frame % 45 === 0) readColor(); // follows theme changes
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
      if (hintRef.current) hintRef.current.style.opacity = "0";
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      waves.push({ x: p.x, y: p.y, r: 0 });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(build);

    io.observe(wrap);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    build();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mt-2 h-44 w-full overflow-hidden rounded-xl border border-dashed border-rule-strong bg-bg-surface sm:h-52"
      style={{ touchAction: "pan-y" }}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full text-text-muted" />
      <p
        ref={hintRef}
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.65rem] text-text-dim transition-opacity duration-500"
      >
        move through it · click to ripple
      </p>
    </div>
  );
}
