const sharp = require("sharp");

const SRC = process.argv[2];
const OUT = process.argv[3];
const BG = [252, 252, 252]; // this sketch's paper white, measured earlier

function alphaOf(r, g, b) {
  const lum = (r + g + b) / 3;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  // ink strokes are near-black/neutral (like hair strands were) — same
  // physically-grounded linear formula as the photo matte, not an arbitrary
  // ramp, so partially-antialiased pencil lines get correctly partial alpha
  // instead of being forced fully opaque or fully erased
  const aNeutral = Math.max(0, Math.min(1, 1 - lum / BG[0]));
  const aSat = Math.max(0, Math.min(1, (sat - 35) / 35));
  return Math.max(aNeutral, aSat);
}

async function run() {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const n = w * h;

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const o = i * c, oo = i * 4;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const a = alphaOf(r, g, b);

    if (a <= 0.003) {
      out[oo] = 0; out[oo + 1] = 0; out[oo + 2] = 0; out[oo + 3] = 0;
      continue;
    }
    // decontaminate spill for partially-transparent edge pixels so faint
    // pencil strokes don't carry a whitish paper tint into the final image
    const decontamAlpha = Math.max(a, 0.25);
    const rgb = [0, 1, 2].map((ch) => {
      const orig = [r, g, b][ch];
      let f = BG[ch] + (orig - BG[ch]) / decontamAlpha;
      return Math.max(0, Math.min(255, Math.round(f)));
    });
    out[oo] = rgb[0]; out[oo + 1] = rgb[1]; out[oo + 2] = rgb[2];
    out[oo + 3] = Math.round(a * 255);
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(OUT);
}
run().then(() => console.log("done")).catch((e) => { console.error(e); process.exit(1); });
