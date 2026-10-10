import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { prefersReducedMotion, useInView } from "@/hooks/use-in-view";
import { createLoopRunner, type LoopRunner } from "@/lib/loop-runner";

/**
 * AgentFanoutLoop — looping hub-and-specialist animation for the OBaI
 * project tile. A research question types in, the hub routes it to
 * specialist agents in parallel (links pulse as each one lights up), and
 * a short result lands; the strategy beat also draws a backtest curve.
 * Monochrome via design tokens, follows light/dark, pauses off-screen,
 * and settles on the backtest frame under reduced-motion.
 *
 * Decorative only — the subtree is aria-hidden so the simulated session
 * is never announced to assistive tech as real content.
 */
type AgentId = "market" | "fund" | "options" | "poly" | "strategy" | "news";

/** Positions are % of the graph area. Short labels sit on the far left/right. */
const NODES: { id: AgentId; label: string; x: number; y: number }[] = [
  { id: "market", label: "Market data", x: 28, y: 18 },
  { id: "fund", label: "Fundamentals", x: 72, y: 18 },
  { id: "options", label: "Options", x: 88, y: 50 },
  { id: "poly", label: "Prediction markets", x: 72, y: 82 },
  { id: "strategy", label: "Strategy", x: 28, y: 82 },
  { id: "news", label: "News", x: 12, y: 50 },
];

interface Beat {
  question: string;
  agents: AgentId[];
  result: string;
  curve?: boolean;
}

const BEATS: Beat[] = [
  { question: "Compare NVDA and AMD into earnings", agents: ["fund", "news", "options", "market"], result: "4 specialists answered in parallel" },
  { question: "Backtest RSI mean reversion on SPY", agents: ["market", "strategy"], result: "Walk-forward test passed", curve: true },
  { question: "What are the odds of a rate cut?", agents: ["poly", "news"], result: "Polymarket odds plus the latest Fed news" },
];

interface Frame {
  beat: number;
  question: string;
  active: AgentId[];
  done: boolean;
}

const EMPTY: Frame = { beat: 0, question: "", active: [], done: false };
const SETTLED: Frame = { beat: 1, question: BEATS[1].question, active: BEATS[1].agents, done: true };

/** Cap on full cycles; at the cap the tile rests on its last answered frame. */
const MAX_CYCLES = 150;

type SetFrame = Dispatch<SetStateAction<Frame>>;

async function playBeat(run: LoopRunner, setFrame: SetFrame, beat: number) {
  const { question, agents } = BEATS[beat];
  setFrame({ ...EMPTY, beat });
  await run.wait(500);
  for (let n = 1; n <= question.length && run.alive; n++) {
    setFrame((f) => ({ ...f, question: question.slice(0, n) }));
    await run.wait(30);
  }
  await run.wait(350);
  for (let i = 0; i < agents.length && run.alive; i++) {
    setFrame((f) => ({ ...f, active: agents.slice(0, i + 1) }));
    await run.wait(220);
  }
  await run.wait(1300);
  setFrame((f) => ({ ...f, done: true }));
  await run.wait(2800);
}

async function playLoop(run: LoopRunner, setFrame: SetFrame) {
  for (let cycle = 0; cycle < MAX_CYCLES && run.alive; cycle++) {
    for (let beat = 0; beat < BEATS.length && run.alive; beat++) {
      await playBeat(run, setFrame, beat);
    }
  }
}

const AgentNode = ({ label, x, y, on }: { label: string; x: number; y: number; on: boolean }) => (
  <span
    style={{ left: `${x}%`, top: `${y}%` }}
    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-300 sm:text-xs ${
      on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"
    }`}
  >
    {label}
  </span>
);

const Graph = ({ active, working }: { active: AgentId[]; working: boolean }) => (
  <div className="relative min-h-0 flex-1">
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {NODES.map((n) => (
        <line
          key={n.id}
          x1={50}
          y1={50}
          x2={n.x}
          y2={n.y}
          vectorEffect="non-scaling-stroke"
          className={active.includes(n.id) ? "obai-link obai-link-on" : "obai-link"}
        />
      ))}
    </svg>
    {NODES.map((n) => (
      <AgentNode key={n.id} label={n.label} x={n.x} y={n.y} on={active.includes(n.id)} />
    ))}
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">
      {working && <span className="obai-ring" />}
      Hub
    </span>
  </div>
);

const Sparkline = () => (
  <svg viewBox="0 0 80 20" className="h-5 w-20 shrink-0" fill="none">
    <path
      d="M1 17 L9 15 L17 16 L25 12 L33 13 L41 9 L49 10 L57 6 L65 7 L73 3 L79 4"
      pathLength={1}
      className="obai-draw"
      stroke="hsl(var(--foreground))"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const ResultRow = ({ beat }: { beat: Beat }) => (
  <div className="obai-in flex min-w-0 items-center gap-3">
    <span className="truncate text-foreground">✓ {beat.result}</span>
    {beat.curve && <Sparkline />}
  </div>
);

const AgentFanoutLoop = () => {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [frame, setFrame] = useState<Frame>(EMPTY);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFrame(SETTLED);
      return;
    }
    if (!inView) return;
    const run = createLoopRunner();
    playLoop(run, setFrame).catch((err) => console.error("AgentFanoutLoop stopped:", err));
    return () => run.stop();
  }, [inView]);

  const beat = BEATS[frame.beat];
  const working = frame.question === beat.question && !frame.done;
  const count = frame.active.length;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="absolute inset-0 flex flex-col font-sans"
      style={{
        background:
          "radial-gradient(circle at 1px 1px, hsl(var(--foreground)/0.10) 1px, transparent 0) 0 0 / 16px 16px, hsl(var(--card))",
      }}
    >
      <style>{OBAI_CSS}</style>
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <span className="obai-dot" />
        <span className="text-sm font-semibold text-foreground">OBaI</span>
        <span className="text-[11px] text-muted-foreground">research desk</span>
        <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
          {count ? `${count} specialist${count === 1 ? "" : "s"}` : "Hub"}
        </span>
      </div>
      <div className="shrink-0 px-4 pt-3">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-3 font-mono text-[12px] text-foreground">
          <span className="text-muted-foreground">›</span>
          <span className="truncate">{frame.question}</span>
          {!frame.done && <span className="obai-caret" />}
        </div>
      </div>
      <Graph active={frame.active} working={working} />
      <div className="flex h-10 shrink-0 items-center px-4 pb-2 font-mono text-[11px]">
        {frame.done && <ResultRow beat={beat} />}
      </div>
    </div>
  );
};

const OBAI_CSS = `
.obai-dot { width: 8px; height: 8px; border-radius: 9999px; background: hsl(var(--foreground)); }
.obai-link { stroke: hsl(var(--foreground) / 0.14); stroke-width: 1; transition: stroke .3s; }
.obai-link-on { stroke: hsl(var(--foreground) / 0.6); stroke-dasharray: 4 5; animation: obai-flow .9s linear infinite; }
@keyframes obai-flow { to { stroke-dashoffset: -18; } }
.obai-ring { position:absolute; inset:0; border-radius:9999px; border:1px solid hsl(var(--foreground)); animation: obai-ping 1.6s cubic-bezier(0.4,0,0.2,1) infinite; }
@keyframes obai-ping { 0%{transform:scale(1);opacity:.6} 80%,100%{transform:scale(1.8);opacity:0} }
.obai-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: obai-draw 1.2s cubic-bezier(0.22,1,0.36,1) forwards; }
@keyframes obai-draw { to { stroke-dashoffset: 0; } }
.obai-in { animation: obai-in .45s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes obai-in { from{opacity:0; transform:translateY(4px)} to{opacity:1; transform:translateY(0)} }
.obai-caret { display:inline-block; width:7px; height:1.05em; background:hsl(var(--foreground)); animation: obai-caret 1s steps(1) infinite; }
@keyframes obai-caret { 50% { opacity: 0 } }
@media (prefers-reduced-motion: reduce){
  .obai-link-on,.obai-ring,.obai-in,.obai-caret{ animation:none }
  .obai-draw{ animation:none; stroke-dashoffset:0 }
}
`;

export default AgentFanoutLoop;
