import { useEffect, useRef, useState } from "react";

/**
 * AgentChatLoop — code-driven, looping "always-on agent" chat animation
 * for the fermix project tile (emulates the fermix.ai hero). Messages
 * stream in with a typing indicator; the channel chip cycles
 * Telegram → Slack → Discord → CLI. Pure CSS/DOM, monochrome, theme-aware
 * (uses your design tokens), and freezes under reduced-motion.
 *
 * Decorative only — the whole subtree is aria-hidden so the simulated
 * conversation is never announced to assistive tech as real content.
 *
 * Drop-in: render inside the ProjectMedia frame (absolute-fills it).
 */
const CHANNELS = ["Telegram", "Slack", "Discord", "CLI"];
const SCRIPT: { who: "user" | "agent"; text: string }[] = [
  { who: "user", text: "every morning, brief me on my inbox" },
  { who: "agent", text: "On it. Triaged 38 emails — 4 need you." },
  { who: "user", text: "book the Kyoto flight if it dips under cap" },
  { who: "agent", text: "Watching it. I'll grab it and send receipts." },
  { who: "user", text: "ship the standup to Notion" },
  { who: "agent", text: "Done — drafted and posted. Logged every step." },
];

const AgentChatLoop = () => {
  const [msgs, setMsgs] = useState<typeof SCRIPT>([]);
  const [typing, setTyping] = useState(false);
  const [chan, setChan] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Settle on the last exchange so nothing is clipped on short frames.
      setMsgs(SCRIPT.slice(-2));
      return;
    }
    // Only one wait is ever pending (sequential awaits), so a single ref
    // suffices — no unbounded array of timer ids.
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timer.current = window.setTimeout(res, ms);
      });
    let alive = true;

    const playStep = async (m: (typeof SCRIPT)[number], i: number) => {
      if (m.who === "agent") {
        setTyping(true);
        await wait(1100);
        setTyping(false);
      } else if (i > 0) {
        setChan((c) => (c + 1) % CHANNELS.length);
      }
      setMsgs((prev) => [...prev, m]);
      await wait(m.who === "user" ? 900 : 1500);
    };

    (async function run() {
      while (alive) {
        setMsgs([]);
        setChan(0);
        await wait(700);
        for (let i = 0; i < SCRIPT.length; i++) {
          if (!alive) return;
          await playStep(SCRIPT[i], i);
        }
        await wait(2200);
      }
    })();

    return () => {
      alive = false;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
  }, []);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [msgs, typing]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col font-sans"
      style={{
        background:
          "radial-gradient(circle at 1px 1px, hsl(var(--foreground)/0.10) 1px, transparent 0) 0 0 / 16px 16px, hsl(var(--card))",
      }}
    >
      <style>{ACL_CSS}</style>

      {/* header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <span className="acl-dot" />
        <span className="text-sm font-semibold text-foreground">Fermix</span>
        <span className="text-[11px] text-muted-foreground">online</span>
        <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
          {CHANNELS[chan]}
        </span>
      </div>

      {/* stream */}
      <div
        ref={scroller}
        className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-4 py-3.5"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`acl-row flex ${m.who === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                m.who === "user"
                  ? "max-w-[78%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-sm leading-snug text-background"
                  : "max-w-[78%] rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2 text-sm leading-snug text-foreground"
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="acl-row flex justify-start">
            <div className="inline-flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2.5">
              <i className="acl-tdot" />
              <i className="acl-tdot" />
              <i className="acl-tdot" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ACL_CSS = `
.acl-dot { width: 8px; height: 8px; border-radius: 9999px; background: hsl(var(--foreground)); position: relative; }
.acl-dot::after { content:""; position:absolute; inset:0; border-radius:9999px; background:hsl(var(--foreground)); animation: acl-ping 1.6s cubic-bezier(0.4,0,0.2,1) infinite; }
@keyframes acl-ping { 0%{transform:scale(1);opacity:.5} 70%,100%{transform:scale(2.6);opacity:0} }
.acl-row { animation: acl-in .45s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes acl-in { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
.acl-tdot { width:5px; height:5px; border-radius:9999px; background:hsl(var(--muted-foreground)); animation: acl-blink 1.2s infinite; }
.acl-tdot:nth-child(2){ animation-delay:.18s } .acl-tdot:nth-child(3){ animation-delay:.36s }
@keyframes acl-blink { 0%,60%,100%{opacity:.25; transform:translateY(0)} 30%{opacity:1; transform:translateY(-2px)} }
@media (prefers-reduced-motion: reduce){ .acl-dot::after,.acl-row,.acl-tdot{ animation:none } }
`;

export default AgentChatLoop;
