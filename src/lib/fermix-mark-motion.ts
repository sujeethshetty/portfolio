import { FEET, MORPH_CENTER, OUTLINE_POINTS, happyArc } from "./fermix-mark";

/**
 * "Poke" choreography for the hero mascots, built from the Fermix Android
 * welcome-motion spec (fermix-design-docs M51 §3 "the drop" and §5 "happy hop"):
 * the mark shuts its eyes and squishes down into a jelly drop, bounces once,
 * swells back into the silhouette with a small overshoot, opens its visor like
 * an eyelid, pops its eyes in left then right, then smiles and hops.
 * Changed for 22-30px hero mascots: the drop is a chubby blob with a "^ ^" face
 * (the app's 6-unit droplet would be about 2px wide here).
 * Pure functions only: the component samples `frameAt(ms)` on each animation frame.
 */
export const POKE_MS = 2700;

type Easing = "hold" | "inOut" | "emphDecel" | "emphAccel" | "standard" | "fall" | "back";
type Key = readonly [ms: number, value: number, easing?: Easing];

export interface MarkFrame {
  morph: number; // 0 = the drop, 1 = the silhouette
  dropBottom: number;
  rx: number;
  ry: number;
  sx: number; // body scale about the feet
  sy: number;
  hopY: number; // mark units, up is negative
  visorOpen: number; // visor cut-out's vertical scale; 0 = closed
  eyeL: number; // eye scale about its centre
  eyeR: number;
  happy: number; // 0 = rectangle eyes, 1 = happy arcs
  face: number; // opacity of the drop's "^ ^" face
}

export const REST: MarkFrame = {
  morph: 1, dropBottom: FEET[1], rx: 31, ry: 26, sx: 1, sy: 1, hopY: 0, visorOpen: 1, eyeL: 1, eyeR: 1, happy: 0, face: 0,
};

// Keyframes: the easing on a key shapes the segment that starts at it (spec §3.2).
const TRACKS: Record<keyof MarkFrame, readonly Key[]> = {
  morph: [[0, 1, "hold"], [140, 1, "emphAccel"], [400, 0, "hold"], [1000, 0, "emphDecel"], [1430, 1]],
  dropBottom: [[0, FEET[1], "hold"], [520, FEET[1], "standard"], [690, 76, "fall"], [860, FEET[1]]],
  rx: [[0, 31, "hold"], [400, 31, "inOut"], [460, 37, "inOut"], [540, 28, "hold"], [820, 28, "inOut"], [880, 37, "inOut"], [940, 29, "inOut"], [1000, 31]],
  ry: [[0, 26, "hold"], [400, 26, "inOut"], [460, 19, "inOut"], [540, 30, "hold"], [820, 30, "inOut"], [880, 19, "inOut"], [940, 27, "inOut"], [1000, 26]],
  sx: [[0, 1, "inOut"], [130, 1.12, "inOut"], [400, 1, "hold"], [1240, 1, "inOut"], [1390, 1.03, "inOut"], [1500, 0.99, "inOut"], [1580, 1, "hold"], [1780, 1, "inOut"], [1870, 1.07, "standard"], [1980, 0.96, "inOut"], [2180, 1.06, "inOut"], [2300, 1]],
  sy: [[0, 1, "inOut"], [130, 0.86, "inOut"], [400, 1, "hold"], [1240, 1, "inOut"], [1390, 1.05, "inOut"], [1500, 0.98, "inOut"], [1580, 1, "hold"], [1780, 1, "inOut"], [1870, 0.9, "standard"], [1980, 1.06, "inOut"], [2180, 0.92, "inOut"], [2300, 1]],
  hopY: [[0, 0, "hold"], [1780, 0, "inOut"], [1870, 1.2, "standard"], [2030, -10, "fall"], [2180, 0]],
  visorOpen: [[0, 1, "inOut"], [140, 0, "hold"], [1330, 0, "emphDecel"], [1510, 1.08, "inOut"], [1590, 1]],
  eyeL: [[0, 1, "inOut"], [120, 0, "hold"], [1450, 0, "back"], [1650, 1]],
  eyeR: [[0, 1, "inOut"], [120, 0, "hold"], [1510, 0, "back"], [1710, 1]],
  happy: [[0, 0, "hold"], [1780, 0, "inOut"], [1960, 1, "hold"], [2500, 1, "inOut"], [POKE_MS, 0]],
  face: [[0, 0, "hold"], [380, 0, "inOut"], [470, 1, "hold"], [960, 1, "inOut"], [1040, 0]],
};

/** CSS-style cubic-bezier(x1, y1, x2, y2): solve x(t) = p for t (bounded Newton, then bisection), return y(t). */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bez = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const dBez = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t * t;
  return (p: number) => {
    let t = p;
    for (let i = 0; i < 8; i++) {
      const err = bez(x1, x2, t) - p;
      const slope = dBez(x1, x2, t);
      if (Math.abs(err) < 1e-5 || Math.abs(slope) < 1e-6) break;
      t -= err / slope;
    }
    if (t < 0 || t > 1 || Math.abs(bez(x1, x2, t) - p) > 1e-3) {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 24; i++) {
        t = (lo + hi) / 2;
        if (bez(x1, x2, t) < p) lo = t;
        else hi = t;
      }
    }
    return bez(y1, y2, t);
  };
}

const EASE: Record<Exclude<Easing, "hold">, (t: number) => number> = {
  inOut: cubicBezier(0.42, 0, 0.58, 1),
  emphDecel: cubicBezier(0.05, 0.7, 0.1, 1),
  emphAccel: cubicBezier(0.3, 0, 0.8, 0.15),
  standard: cubicBezier(0.2, 0, 0, 1),
  fall: (t) => t * t,
  back: (t) => 1 + 2.9 * (t - 1) ** 3 + 1.9 * (t - 1) ** 2,
};

function sample(keys: readonly Key[], ms: number): number {
  if (ms <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [aMs, aVal, easing = "inOut"] = keys[i];
    const [bMs, bVal] = keys[i + 1];
    if (ms >= bMs) continue;
    if (easing === "hold") return aVal;
    return aVal + (bVal - aVal) * EASE[easing]((ms - aMs) / (bMs - aMs));
  }
  return keys[keys.length - 1][1];
}

export function frameAt(ms: number): MarkFrame {
  const entries = Object.entries(TRACKS).map(([name, keys]) => [name, sample(keys, ms)]);
  return Object.fromEntries(entries) as MarkFrame;
}

// Each outline point pairs with the drop point at the same angle around MORPH_CENTER (spec §3.4).
const ANGLES = OUTLINE_POINTS.map(([x, y]) => Math.atan2(y - MORPH_CENTER[1], x - MORPH_CENTER[0]));

/** The body between drop (morph 0) and silhouette (morph 1), as a closed Catmull-Rom path. */
export function morphPath(f: MarkFrame): string {
  const cy = f.dropBottom - f.ry;
  const pts = OUTLINE_POINTS.map(([x, y], i) => {
    const dx = MORPH_CENTER[0] + f.rx * Math.cos(ANGLES[i]);
    const dy = cy + f.ry * Math.sin(ANGLES[i]);
    return [dx + (x - dx) * f.morph, dy + (y - dy) * f.morph] as const;
  });
  const n = pts.length;
  const at = (i: number) => pts[(i + n) % n];
  const r = (v: number) => v.toFixed(2);
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${r(b[0] + (c[0] - a[0]) / 6)} ${r(b[1] + (c[1] - a[1]) / 6)} ${r(c[0] - (e[0] - b[0]) / 6)} ${r(c[1] - (e[1] - b[1]) / 6)} ${r(c[0])} ${r(c[1])}`;
  }
  return `${d}Z`;
}

/** The drop's "^ ^" face: rides the drop and spreads as it squashes. Drawn as a cut-out. */
export function dropFaceArcs(f: MarkFrame): [string, string] {
  const cy = f.dropBottom - f.ry - 2 * (f.ry / REST.ry);
  const dx = 10 * (f.rx / REST.rx);
  return [happyArc(MORPH_CENTER[0] - dx, cy), happyArc(MORPH_CENTER[0] + dx, cy)];
}
