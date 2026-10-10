import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion, useInView } from "@/hooks/use-in-view";
import { createLoopRunner, type LoopRunner } from "@/lib/loop-runner";

/**
 * Hero teaser: "AI" now and then glitches into "SI" (superintelligence), glows
 * for a moment, and decodes back. AI holds much longer than SI: a hint, not a
 * claim. The letter scrambles through look-alike glyphs (A 4 # & $ 5 S), all
 * no wider than "A", inside a cell sized to "A", so the line never reflows.
 * The DOM text is always "AI" (screen readers, copy/paste, crawlers). Static
 * under reduced motion, paused off-screen.
 */
interface Frame {
  glyph: string;
  blur: number; // px at TUNED_PX font size; scaled to em so mobile gets the same look
  x: number; // px jitter, scaled the same way
  opacity: number;
  lit?: boolean; // lands on SI: full-contrast ink, plus a halo in dark mode
}

const REST: Frame = { glyph: "A", blur: 0, x: 0, opacity: 1 };

const TO_SI: Frame[] = [
  { glyph: "A", blur: 1.5, x: -1, opacity: 0.85 },
  { glyph: "4", blur: 3, x: 2, opacity: 0.6 },
  { glyph: "#", blur: 4, x: -2, opacity: 0.75 },
  { glyph: "&", blur: 3, x: 1, opacity: 0.55 },
  { glyph: "$", blur: 2, x: -1, opacity: 0.85 },
  { glyph: "5", blur: 1, x: 1, opacity: 0.7 },
  { glyph: "S", blur: 0, x: 0, opacity: 1, lit: true },
];

// Same blur/jitter profile, glyphs in reverse, landing quietly on A.
const TO_AI: Frame[] = TO_SI.map((f, i) => ({ ...f, glyph: TO_SI[TO_SI.length - 1 - i].glyph, lit: false }));

// The transparent shadow on UNLIT lets the halo fade out instead of popping off.
const UNLIT = "[text-shadow:0_0_18px_hsl(var(--foreground)/0)]";
const LIT = `${UNLIT} text-foreground dark:[text-shadow:0_0_18px_hsl(var(--foreground)/0.55)]`;

const TUNED_PX = 60; // the lg hero subline size the blur/jitter values were tuned at
const FRAME_MS = 65;
const LIT_MS = 420; // glow snaps on, holds, then fades out over GLOW_FADE_MS
const GLOW_FADE_MS = 1100;
const START_MS = 3200;
const SI_HOLD_MS = 2200;
const AI_HOLD_MS = 6500;
const MAX_CYCLES = 200;

async function play(run: LoopRunner, frames: Frame[], set: (f: Frame) => void) {
  for (let i = 0; i < frames.length && run.alive; i++) {
    set(frames[i]);
    await run.wait(FRAME_MS);
  }
}

async function loop(run: LoopRunner, set: (f: Frame) => void) {
  await run.wait(START_MS);
  for (let cycle = 0; cycle < MAX_CYCLES && run.alive; cycle++) {
    await play(run, TO_SI, set);
    await run.wait(LIT_MS);
    set({ ...TO_SI[TO_SI.length - 1], lit: false });
    await run.wait(SI_HOLD_MS);
    await play(run, TO_AI, set);
    await run.wait(AI_HOLD_MS);
  }
}

const AiSiGlitch = () => {
  const root = useRef<HTMLSpanElement>(null);
  const inView = useInView(root);
  const [frame, setFrame] = useState<Frame>(REST);

  useEffect(() => {
    if (prefersReducedMotion() || !inView) return;
    setFrame(REST);
    const run = createLoopRunner();
    loop(run, setFrame).catch((err) => console.error("AiSiGlitch stopped:", err));
    return () => run.stop();
  }, [inView]);

  const glowMs = frame.lit ? FRAME_MS : GLOW_FADE_MS;
  const style: CSSProperties = {
    filter: frame.blur ? `blur(${frame.blur / TUNED_PX}em)` : undefined,
    transform: frame.x ? `translateX(${frame.x / TUNED_PX}em)` : undefined,
    opacity: frame.opacity,
    transition: [
      `filter ${FRAME_MS}ms linear, opacity ${FRAME_MS}ms linear, transform ${FRAME_MS}ms linear`,
      `color ${glowMs}ms ease-out, text-shadow ${glowMs}ms ease-out`,
    ].join(", "),
  };

  // The real "A" always stays in the text (it also sizes the cell); while another
  // glyph shows, it goes transparent and the stand-in sits on top, aria-hidden.
  const scrambled = frame.glyph !== "A";
  return (
    <span ref={root} className={`inline-block whitespace-nowrap ${frame.lit ? LIT : UNLIT}`} style={style}>
      <span className="inline-grid justify-items-end">
        <span className={`[grid-area:1/1] ${scrambled ? "text-transparent [text-shadow:none]" : ""}`}>A</span>
        {scrambled && (
          <span aria-hidden="true" className="select-none [grid-area:1/1]">
            {frame.glyph}
          </span>
        )}
      </span>
      I
    </span>
  );
};

export default AiSiGlitch;
