/* Petals drifting across the daylight banner, in three depths: small faint
   ones far away, crisp ones in the middle, and a few large, softly blurred
   ones passing close to the lens. Each falls on the breeze and tumbles (a
   cosine squash on its width reads as the leaf turning over, and it catches
   the light as it faces us). Every so often a gust sweeps them all along.
   Drawn on a canvas sized to the banner; nothing runs while it's stopped. */

interface Petal {
  x: number;
  y: number;
  len: number;
  fall: number;
  drift: number;
  sway: number;
  freq: number;
  phase: number;
  angle: number;
  spin: number;
  tumble: number;
  alpha: number;
  sprite: HTMLCanvasElement;
}

const SW = 12;
const SH = 40;

// one petal, drawn once and stamped for every leaf; `blur` for near ones
function sprite(blur = 0) {
  const pad = blur * 3;
  const c = document.createElement("canvas");
  c.width = SW + pad * 2;
  c.height = SH + pad * 2;
  const g = c.getContext("2d")!;
  if (blur) g.filter = `blur(${blur}px)`;
  g.translate(pad, pad);
  g.beginPath();
  g.moveTo(SW / 2, 1);
  g.quadraticCurveTo(SW - 0.5, SH / 2, SW / 2, SH - 1);
  g.quadraticCurveTo(0.5, SH / 2, SW / 2, 1);
  const grd = g.createLinearGradient(0, 0, SW, 0);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(1, "#e4e7ee");
  g.fillStyle = grd;
  g.fill();
  // a faint edge so a pale leaf still reads against snow and cloud
  g.strokeStyle = "rgba(60, 72, 96, 0.3)";
  g.lineWidth = 1;
  g.stroke();
  return c;
}

const LAYERS = [
  // per 1000px of banner width
  { count: 34, len: [6, 8], fall: [6, 10], drift: [10, 18], alpha: [0.6, 0.8], blur: 0 },
  { count: 46, len: [9, 13], fall: [11, 19], drift: [18, 30], alpha: [0.92, 1], blur: 0 },
  { count: 9, len: [16, 22], fall: [22, 32], drift: [34, 48], alpha: [0.85, 0.95], blur: 1.2 },
] as const;

export interface Petals {
  start(): void;
  stop(): void;
  destroy(): void;
}

export function createPetals(el: HTMLCanvasElement): Petals {
  const ctx = el.getContext("2d")!;
  const crisp = sprite();
  const soft = sprite(1.2);
  let w = 0;
  let h = 0;
  let petals: Petal[] = [];

  const rand = ([a, b]: readonly [number, number]) => a + Math.random() * (b - a);
  const petal = (layer: (typeof LAYERS)[number], fresh = false): Petal => ({
    x: fresh ? -24 - Math.random() * w * 0.35 : Math.random() * w,
    y: fresh ? Math.random() * h * 0.75 - 12 : Math.random() * h,
    len: rand(layer.len),
    fall: rand(layer.fall),
    drift: rand(layer.drift),
    sway: 3 + Math.random() * 7,
    freq: 0.4 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.8,
    tumble: 0.8 + Math.random() * 1.6,
    alpha: rand(layer.alpha),
    sprite: layer.blur ? soft : crisp,
  });
  const layerOf = new Map<Petal, (typeof LAYERS)[number]>();

  const fit = () => {
    const box = el.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = box.width;
    h = box.height;
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    petals = [];
    layerOf.clear();
    for (const layer of LAYERS) {
      const n = Math.max(2, Math.round((layer.count * w) / 1000));
      for (let i = 0; i < n; i++) {
        const p = petal(layer);
        layerOf.set(p, layer);
        petals.push(p);
      }
    }
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(el);

  let raf = 0;
  let prev = 0;
  let t = 0;
  const loop = (now: number) => {
    const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0.016;
    prev = now;
    t += dt;
    // a gust every ~18s: the breeze swells to ~2.4× and settles again
    const gust = 1 + 1.4 * Math.pow(Math.max(0, Math.sin((t * Math.PI * 2) / 18)), 4);
    const dpr = el.width / (w || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.x += p.drift * gust * dt;
      p.y += p.fall * dt;
      p.angle += p.spin * gust * dt;
      if (p.y - p.len > h || p.x - p.len > w) Object.assign(p, petal(layerOf.get(p)!, true));
      const x = p.x + Math.sin(t * p.freq + p.phase) * p.sway;
      // turning over: the width collapses and opens, brightest face-on
      const face = Math.abs(Math.cos(t * p.tumble + p.phase));
      const flip = Math.max(0.15, face);
      const pw = (p.len * SW) / SH;
      const s = p.sprite;
      const pad = (s.width - SW) / 2;
      const k = p.len / SH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(flip, 1);
      ctx.globalAlpha = p.alpha * (0.82 + 0.18 * face);
      ctx.drawImage(s, -pw / 2 - pad * k, -p.len / 2 - pad * k, s.width * k, s.height * k);
    }
    raf = requestAnimationFrame(loop);
  };

  return {
    start() {
      if (raf) return;
      prev = 0;
      raf = requestAnimationFrame(loop);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      this.stop();
      ro.disconnect();
    },
  };
}
