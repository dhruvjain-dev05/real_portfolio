const sharp = require("sharp");

const SRC = process.argv[2];
const OUT = process.argv[3];
const NEW_BG = process.argv[4].split(",").map(Number);
const BG = [252, 252, 252];

function alphaOf(r, g, b) {
  const lum = (r + g + b) / 3;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  const aNeutral = Math.max(0, Math.min(1, 1 - lum / BG[0]));
  const aSat = Math.max(0, Math.min(1, (sat - 35) / 35));
  return Math.max(aNeutral, aSat);
}

async function run() {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const n = w * h;

  // circular crop + mask, same geometry measured earlier for this source photo
  const cx = 627, cy = 615, r = 560;

  const out = Buffer.alloc(n * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const o = i * c, oo = i * 4;
      const inCircle = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
      if (!inCircle) {
        out[oo] = 0; out[oo + 1] = 0; out[oo + 2] = 0; out[oo + 3] = 0;
        continue;
      }
      const r0 = data[o], g0 = data[o + 1], b0 = data[o + 2];
      const inkAlpha = alphaOf(r0, g0, b0);
      // decontaminate ink-stroke edges against the ORIGINAL white paper,
      // then blend that recovered ink color onto the new paper tone —
      // same two-step logic as the photo matte
      const decontamAlpha = Math.max(inkAlpha, 0.25);
      const ink = [0, 1, 2].map((ch) => {
        const orig = [r0, g0, b0][ch];
        let f = BG[ch] + (orig - BG[ch]) / decontamAlpha;
        return Math.max(0, Math.min(255, f));
      });
      for (let ch = 0; ch < 3; ch++) {
        out[oo + ch] = Math.round(inkAlpha * ink[ch] + (1 - inkAlpha) * NEW_BG[ch]);
      }
      out[oo + 3] = 255; // opaque within the circle — paper is recolored, not removed
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: cx - r, top: cy - r, width: r * 2, height: r * 2 })
    .resize(320, 320)
    .png()
    .toFile(OUT);
}
run().then(() => console.log("done")).catch((e) => { console.error(e); process.exit(1); });
