/* Shared by the kick-off intro and the footer's back-to-top kick.

   /sprites/footballer.webp is a 13-frame strip cut from the supplied 4×3 sheet:
   idle 0–3, run 4–7, kick 8–11, and 12 — the last kick frame with its drawn
   ball erased, for the follow-through once the real ball is away. Every
   299×257 cell is aligned on the head with the boots on the bottom edge, so
   swapping frames never shifts the body.
   /sprites/football.png is the ball, cut from the same sheet. */

export const SHEET = "/sprites/footballer.webp";
const BALL_SRC = "/sprites/football.png";
const CELL_W = 299;
const CELL_H = 257;
const FRAMES = 13;

export const LOOK = [0, 1, 2, 3, 2, 1, 0];
export const RUN = [4, 5, 6, 7];
export const KICK = [8, 9, 10, 11];
export const FOLLOW_THROUGH = 12;

// Where the sheet draws its own ball on each kick frame, as fractions of a
// cell: x from the left edge, y = ball centre height above the boots.
export const KICK_BALL = [
  { x: 0.696, y: 0.125 },
  { x: 0.809, y: 0.125 },
  { x: 0.866, y: 0.195 },
  { x: 0.92, y: 0.3 },
];

// a resting ball sits exactly where the first kick frame draws it
export const REST_X = KICK_BALL[0].x;

/** Cell-left offset that puts kick frame `k`'s drawn ball on `ballX`. Frames
 *  0–1 are before contact (ball still), 2–3 keep his planted position. */
export const kickLeft = (ballX: number, k: number, w: number) =>
  ballX - KICK_BALL[Math.min(k, 1)].x * w;

/** Sprite and ball size for a character `h` px tall. */
export function size(h: number) {
  const w = Math.round((h * CELL_W) / CELL_H);
  return { w, h, ball: Math.round(w * 0.147) };
}

export function applySprite(el: HTMLElement, w: number, h: number) {
  Object.assign(el.style, {
    width: `${w}px`,
    height: `${h}px`,
    backgroundImage: `url(${SHEET})`,
    backgroundSize: `${w * FRAMES}px ${h}px`,
    backgroundRepeat: "no-repeat",
  });
}

export function applyBall(el: HTMLElement, d: number) {
  Object.assign(el.style, {
    width: `${d}px`,
    height: `${d}px`,
    backgroundImage: `url(${BALL_SRC})`,
    backgroundSize: "100% 100%",
  });
}

export const showFrame = (el: HTMLElement, i: number, w: number) => {
  el.style.backgroundPosition = `${-i * w}px 0`;
};

/** Degrees a ball of diameter `d` turns while rolling `dx` px. */
export const roll = (dx: number, d: number) => (dx * 360) / (Math.PI * d);

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const easeOutQuad = (p: number) => 1 - (1 - p) * (1 - p);
export const easeInQuad = (p: number) => p * p;
export const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
