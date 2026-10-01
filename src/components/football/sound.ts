// Synthesised football sounds (Web Audio, no asset files): a boot on the ball,
// footsteps on grass while running, and ball bounces.
//
// Browsers keep audio suspended until the visitor interacts with the page, so
// on a cold first visit the kick-off may be silent until a click/key/tap —
// after that everything (including the footer) is audible.

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

const get = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    const unlock = () => ctx?.resume().catch(() => {});
    for (const e of ["pointerdown", "keydown", "touchstart"]) window.addEventListener(e, unlock, { passive: true });
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx.state === "running" ? ctx : null;
};

const noiseBuf = (c: AudioContext) => {
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
};

const burst = (c: AudioContext, freq: number, q: number, peak: number, dur: number, type: BiquadFilterType) => {
  const src = c.createBufferSource();
  src.buffer = noiseBuf(c);
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t, Math.random() * 0.5, dur + 0.02);
};

const thump = (c: AudioContext, from: number, to: number, peak: number, dur: number) => {
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime;
  o.type = "sine";
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
};

/** Boot meeting ball: a low thud plus a leathery slap. */
export const playKick = () => {
  const c = get();
  if (!c) return;
  thump(c, 190, 55, 0.9, 0.22);
  burst(c, 1800, 0.8, 0.5, 0.09, "bandpass");
};

/** One footfall on grass. */
export const playStep = () => {
  const c = get();
  if (!c) return;
  burst(c, 420 + Math.random() * 120, 0.9, 0.16, 0.07, "lowpass");
};

/** Ball hitting the ground; `strength` 0–1. */
export const playBounce = (strength = 1) => {
  const c = get();
  if (!c) return;
  thump(c, 150, 70, 0.45 * strength, 0.14);
};
