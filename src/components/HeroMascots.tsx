import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { EYES, FEET, OUTLINE, VISOR, VISOR_CENTER, happyArc } from "@/lib/fermix-mark";
import { POKE_MS, REST, dropFaceArcs, frameAt, morphPath, type MarkFrame } from "@/lib/fermix-mark-motion";
import { prefersReducedMotion } from "@/hooks/use-in-view";

/**
 * A few tiny greyscale Fermix mascots drifting on the hero's empty right side
 * (desktop only). Idle: float and blink. Click: the official "poke" from the
 * Fermix app (squish into a jelly drop with a "^ ^" face, bounce, swell back, smile, hop); see
 * lib/fermix-mark-motion. Decorative, so the layer is aria-hidden and the
 * buttons are skipped by keyboard focus.
 */
interface Spot {
  top: string;
  right: string;
  size: number;
  floatSeconds: number;
  delaySeconds: number;
}

const SPOTS: Spot[] = [
  { top: "24%", right: "18%", size: 30, floatSeconds: 7, delaySeconds: 0 },
  { top: "50%", right: "7%", size: 22, floatSeconds: 9, delaySeconds: -3 },
  { top: "70%", right: "25%", size: 26, floatSeconds: 8, delaySeconds: -5 },
];

const MAX_FRAMES = 1000; // the clock stops at POKE_MS; this only caps a runaway loop
const REDUCED_SMILE_MS = 2300; // a frame where everything is at rest except the smile
const REDUCED_HOLD_MS = 1000;

const about = ([x, y]: readonly [number, number], sx: number, sy: number) =>
  `translate(${x} ${y}) scale(${sx} ${sy}) translate(${-x} ${-y})`;

const Eye = ({ eye, scale, happy }: { eye: (typeof EYES)[number]; scale: number; happy: number }) => {
  const w = eye.width * scale;
  const h = eye.height * scale * (1 - happy);
  return (
    <>
      {w > 0.05 && h > 0.05 && (
        <rect x={eye.cx - w / 2} y={eye.cy - h / 2} width={w} height={h} rx={Math.min(eye.r, w / 2, h / 2)} />
      )}
      {happy > 0 && (
        <path d={happyArc(eye.cx, eye.cy)} opacity={happy} fill="none" stroke="currentColor" strokeWidth={2.9} strokeLinecap="round" />
      )}
    </>
  );
};

const Mark = ({ frame, blink }: { frame: MarkFrame; blink: boolean }) => {
  const reactId = useId();
  const maskId = `mascot-visor-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const body = frame.morph >= 1 ? OUTLINE : morphPath(frame);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" fill="currentColor">
      <mask id={maskId} maskUnits="userSpaceOnUse" x={-50} y={-50} width={200} height={200}>
        <rect x={-50} y={-50} width={200} height={200} fill="white" />
        {frame.visorOpen > 0.01 && <path d={VISOR} fill="black" transform={about(VISOR_CENTER, 1, frame.visorOpen)} />}
        {frame.face > 0 && (
          <g opacity={frame.face} fill="none" stroke="black" strokeWidth={3.2} strokeLinecap="round">
            {dropFaceArcs(frame).map((d, i) => <path key={i} d={d} />)}
          </g>
        )}
      </mask>
      <g transform={`translate(0 ${frame.hopY}) ${about(FEET, frame.sx, frame.sy)}`}>
        <path d={body} mask={`url(#${maskId})`} />
        <g className={blink ? "mascot-eyes" : undefined}>
          {EYES.map((eye, i) => (
            <Eye key={eye.cx} eye={eye} scale={i === 0 ? frame.eyeL : frame.eyeR} happy={frame.happy} />
          ))}
        </g>
      </g>
    </svg>
  );
};

/** One requestAnimationFrame clock per mascot: `elapsed` is null at rest, else ms into the poke. */
function usePokeClock() {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const busy = useRef(false);
  const raf = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    window.clearTimeout(timer.current);
  }, []);

  const finish = () => {
    busy.current = false;
    setElapsed(null);
  };

  const poke = () => {
    if (busy.current) return;
    busy.current = true;
    if (prefersReducedMotion()) {
      setElapsed(REDUCED_SMILE_MS);
      timer.current = window.setTimeout(finish, REDUCED_HOLD_MS);
      return;
    }
    const start = performance.now();
    let frames = 0;
    const tick = (now: number) => {
      frames += 1;
      const ms = now - start;
      if (ms >= POKE_MS || frames > MAX_FRAMES) return finish();
      setElapsed(ms);
      raf.current = requestAnimationFrame(tick);
    };
    setElapsed(0);
    raf.current = requestAnimationFrame(tick);
  };

  return { elapsed, poke };
}

const Mascot = ({ spot }: { spot: Spot }) => {
  const { elapsed, poke } = usePokeClock();

  const floatStyle: CSSProperties = {
    top: spot.top,
    right: spot.right,
    width: spot.size,
    height: spot.size,
    animationDuration: `${spot.floatSeconds}s`,
    animationDelay: `${spot.delaySeconds}s`,
  };

  return (
    <span className="mascot-float pointer-events-auto absolute" style={floatStyle}>
      <button
        type="button"
        tabIndex={-1}
        onClick={poke}
        className="block h-full w-full cursor-pointer text-muted-foreground/80 transition-[color,transform] duration-200 hover:scale-110 hover:text-foreground"
      >
        <Mark frame={elapsed === null ? REST : frameAt(elapsed)} blink={elapsed === null} />
      </button>
    </span>
  );
};

const HeroMascots = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
    <style>{MASCOT_CSS}</style>
    {SPOTS.map((spot) => (
      <Mascot key={`${spot.top}-${spot.right}`} spot={spot} />
    ))}
  </div>
);

const MASCOT_CSS = `
.mascot-float { animation: mascot-float 8s ease-in-out infinite; }
@keyframes mascot-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(5px, -10px) rotate(5deg); }
  66% { transform: translate(-4px, -4px) rotate(-4deg); }
}
.mascot-eyes { transform-box: fill-box; transform-origin: center; animation: mascot-blink 5.5s infinite; }
.mascot-float:nth-child(3) .mascot-eyes { animation-delay: -2s; }
.mascot-float:nth-child(4) .mascot-eyes { animation-delay: -4s; }
@keyframes mascot-blink { 0%, 93%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
@media (prefers-reduced-motion: reduce) {
  .mascot-float, .mascot-eyes { animation: none; }
}
`;

export default HeroMascots;
