import { useEffect, useRef, useState } from "react";

/**
 * MarketSignalLoop — code-driven, looping "real-time market signal"
 * animation for the openbell.ai / OBaI project tile. A flowing line/area
 * chart streams left on a faint grid while LLM-"scored" headlines fade in
 * with an impact reading. Canvas chart + DOM overlay; monochrome and
 * theme-aware (reads --foreground live, follows light/dark); freezes
 * under reduced-motion (settles on a painted frame), repaints on theme
 * toggle + resize, and pauses while scrolled off-screen.
 *
 * Decorative only — the whole subtree is aria-hidden so the simulated
 * feed is never announced to assistive tech as real content.
 *
 * Drop-in: render inside the ProjectMedia frame (absolute-fills it).
 */
const HEADLINES = [
  { t: "Fed signals a pause on rate hikes", s: 0.82, up: true },
  { t: "Chipmaker beats on AI demand", s: 0.74, up: true },
  { t: "Oil slips on supply glut fears", s: 0.61, up: false },
  { t: "Retail sales miss expectations", s: 0.58, up: false },
  { t: "Cloud revenue accelerates QoQ", s: 0.79, up: true },
];

const N = 64;
const valueAt = (i: number, time: number) => {
  const x = i / N;
  return (
    Math.sin(x * 6.2 + time) * 0.5 +
    Math.sin(x * 13.0 + time * 1.7) * 0.22 +
    Math.sin(x * 2.3 + time * 0.6) * 0.3
  );
};

const MarketSignalLoop = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hi, setHi] = useState(0);
  const [shown, setShown] = useState(0);
  const [inView, setInView] = useState(true);

  // chart
  useEffect(() => {
    const cv = canvas.current;
    const el = wrap.current;
    if (!cv || !el) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    let fg = "0,0,0";
    let visible = true;
    let W = 0;
    let H = 0;

    const readColor = () => {
      const c = getComputedStyle(el).color;
      const m = c.match(/\d+/g);
      if (m) fg = m.slice(0, 3).join(",");
    };

    // Paint one frame from the current `fg`/`t` — no scheduling, so it is
    // safe to call standalone (resize, theme toggle, reduced-motion settle).
    const paint = () => {
      const padTop = 46;
      const padBottom = 58;
      const padX = 16;
      const cw = W - padX * 2;
      const ch = H - padTop - padBottom;
      const midY = padTop + ch / 2;
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = `rgba(${fg},0.08)`;
      ctx.lineWidth = 1;
      for (let g = 0; g <= 3; g++) {
        const y = padTop + (ch / 3) * g;
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(W - padX, y);
        ctx.stroke();
      }

      const pts: [number, number][] = [];
      for (let i = 0; i <= N; i++) {
        pts.push([padX + (cw / N) * i, midY - valueAt(i, t) * (ch / 2) * 0.85]);
      }
      const grad = ctx.createLinearGradient(0, padTop, 0, padTop + ch);
      grad.addColorStop(0, `rgba(${fg},0.18)`);
      grad.addColorStop(1, `rgba(${fg},0)`);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts) ctx.lineTo(p[0], p[1]);
      ctx.lineTo(pts[pts.length - 1][0], padTop + ch);
      ctx.lineTo(pts[0][0], padTop + ch);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts) ctx.lineTo(p[0], p[1]);
      ctx.strokeStyle = `rgba(${fg},0.85)`;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.stroke();

      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last[0], last[1], 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${fg},0.15)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(last[0], last[1], 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${fg},1)`;
      ctx.fill();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.max(1, W * dpr);
      cv.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(); // bitmap was reset by the width/height assignment — repaint it
    };

    // Animation loop. Reschedules only while visible and motion is allowed,
    // so it never spawns a second loop and pauses off-screen.
    let frame = 0;
    const tick = () => {
      paint();
      if (frame++ % 30 === 0) readColor();
      t += 0.018;
      raf = !reduce && visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!reduce && visible && !raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    readColor();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        setInView(e.isIntersecting);
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(el);

    // Follow the `dark` class toggle even when the loop is paused/settled.
    const onTheme = () => {
      readColor();
      paint();
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // headline cycle — paused off-screen alongside the canvas
  useEffect(() => {
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(1);
      return;
    }
    if (!inView) return;
    let i = 0;
    let to = 0;
    const tick = () => {
      setShown(0);
      to = window.setTimeout(() => {
        i = (i + 1) % HEADLINES.length;
        setHi(i);
        setShown(1);
      }, 450);
    };
    setShown(1);
    const iv = window.setInterval(tick, 3200);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [inView]);

  const h = HEADLINES[hi];

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-card font-sans text-foreground"
    >
      <style>{MSL_CSS}</style>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      {/* header */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-4 py-3">
        <span className="msl-dot" />
        <span className="text-sm font-bold tracking-tight">openbell</span>
        <span className="text-[11px] text-muted-foreground">live impact feed</span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
          S&amp;P · realtime
        </span>
      </div>

      {/* scored headline */}
      <div className="absolute inset-x-4 bottom-3.5">
        <div
          className="msl-card"
          style={{
            opacity: shown,
            transform: shown ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <span className="msl-score">
            <span className="text-[13px]">{h.up ? "▲" : "▼"}</span>
            {h.s.toFixed(2)}
          </span>
          <span className="text-sm leading-snug text-foreground">{h.t}</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            scored
          </span>
        </div>
      </div>
    </div>
  );
};

const MSL_CSS = `
.msl-dot { width: 8px; height: 8px; border-radius: 9999px; background: hsl(var(--foreground)); position: relative; }
.msl-dot::after { content:""; position:absolute; inset:0; border-radius:9999px; background:hsl(var(--foreground)); animation: msl-ping 1.6s cubic-bezier(0.4,0,0.2,1) infinite; }
@keyframes msl-ping { 0%{transform:scale(1);opacity:.5} 70%,100%{transform:scale(2.6);opacity:0} }
.msl-card {
  display:flex; align-items:center; gap:10px;
  background: hsl(var(--background)/0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid hsl(var(--border)); border-radius: 12px; padding: 9px 12px;
  transition: opacity .45s cubic-bezier(0.16,1,0.3,1), transform .45s cubic-bezier(0.16,1,0.3,1);
}
.msl-score {
  display:inline-flex; align-items:center; gap:5px; flex:0 0 auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 13px; font-weight: 700;
  color: hsl(var(--background)); background: hsl(var(--foreground));
  padding: 3px 8px; border-radius: 7px;
}
@media (prefers-reduced-motion: reduce){ .msl-dot::after{ animation:none } }
`;

export default MarketSignalLoop;
