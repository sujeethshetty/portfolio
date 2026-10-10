import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { prefersReducedMotion, useInView } from "@/hooks/use-in-view";
import { createLoopRunner, type LoopRunner } from "@/lib/loop-runner";

/**
 * AgentChatLoop — looping product story for the Fermix project tile,
 * modeled on the fermix.ai hero: install in a terminal, then the agent
 * answers in a chat app with a morning brief and schedules it as a
 * recurring job. Copy mirrors the fermix.ai hero and feature claims. Monochrome via design tokens,
 * follows light/dark, pauses off-screen, and settles on a static frame
 * under reduced-motion.
 *
 * Decorative only — the subtree is aria-hidden so the simulated
 * conversation is never announced to assistive tech as real content.
 */
type Msg = { kind: "user" | "agent"; text: string } | { kind: "brief" };

interface Step {
  chan: string;
  msg: Msg;
  typing?: boolean;
  hold: number;
}

interface TermState {
  shown: number;
  partial: string | null;
}

const TERM_LINES = [
  { cmd: true, text: "brew install tezra-io/tap/fermix" },
  { cmd: false, text: "Fermix installed" },
  { cmd: true, text: "fermix setup" },
  { cmd: false, text: "Fermix is running." },
];

const BRIEF_ITEMS = [
  "Launch metrics review at 10:00",
  "PR #482 is failing on Linux",
  "4 emails need a reply",
];

const CHAT: Step[] = [
  { chan: "Telegram", msg: { kind: "user", text: "What needs my attention this morning?" }, hold: 600 },
  { chan: "Telegram", msg: { kind: "agent", text: "Three things. I handled the rest." }, typing: true, hold: 350 },
  { chan: "Telegram", msg: { kind: "brief" }, hold: 1800 },
  { chan: "Slack", msg: { kind: "user", text: "Send me this every weekday at 8." }, hold: 600 },
  { chan: "Slack", msg: { kind: "agent", text: "Scheduled. It survives restarts." }, typing: true, hold: 2600 },
];

/** Static frame for reduced-motion: the first exchange, brief included. */
const SETTLED_MSGS = CHAT.slice(0, 3).map((s) => s.msg);

/** Cap on full cycles; at the cap the tile rests on its last chat frame. */
const MAX_CYCLES = 200;

interface Ui {
  setMode: (mode: "term" | "chat") => void;
  setTerm: (term: TermState) => void;
  setMsgs: Dispatch<SetStateAction<Msg[]>>;
  setTyping: (typing: boolean) => void;
  setChan: (chan: string) => void;
}

async function typeCommand(run: LoopRunner, ui: Ui, shown: number, text: string) {
  for (let n = 1; n <= text.length && run.alive; n++) {
    ui.setTerm({ shown, partial: text.slice(0, n) });
    await run.wait(32);
  }
}

async function playTerminal(run: LoopRunner, ui: Ui) {
  ui.setTerm({ shown: 0, partial: null });
  ui.setMode("term");
  await run.wait(500);
  for (let i = 0; i < TERM_LINES.length && run.alive; i++) {
    const line = TERM_LINES[i];
    if (line.cmd) await typeCommand(run, ui, i, line.text);
    ui.setTerm({ shown: i + 1, partial: null });
    await run.wait(line.cmd ? 250 : 500);
  }
  await run.wait(900);
}

async function playChat(run: LoopRunner, ui: Ui) {
  ui.setMsgs([]);
  ui.setTyping(false);
  ui.setChan(CHAT[0].chan);
  ui.setMode("chat");
  await run.wait(500);
  for (const step of CHAT) {
    if (!run.alive) return;
    ui.setChan(step.chan);
    if (step.typing) {
      ui.setTyping(true);
      await run.wait(1000);
      ui.setTyping(false);
    }
    ui.setMsgs((prev) => [...prev, step.msg]);
    await run.wait(step.hold);
  }
}

async function playLoop(run: LoopRunner, ui: Ui) {
  for (let cycle = 0; cycle < MAX_CYCLES && run.alive; cycle++) {
    await playTerminal(run, ui);
    await playChat(run, ui);
  }
}

const TermLine = ({ cmd, text, caret = false }: { cmd: boolean; text: string; caret?: boolean }) => (
  <div className={`overflow-hidden whitespace-nowrap ${cmd ? "text-foreground" : "text-muted-foreground"}`}>
    <span className="select-none text-muted-foreground">{cmd ? "$ " : "✓ "}</span>
    {text}
    {caret && <span className="acl-caret" />}
  </div>
);

const TerminalPane = ({ shown, partial }: TermState) => (
  <div className="flex h-full items-center justify-center p-5">
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <i className="h-2 w-2 rounded-full bg-foreground/20" />
        <i className="h-2 w-2 rounded-full bg-foreground/20" />
        <i className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">fermix · zsh</span>
      </div>
      <div className="min-h-[6.5rem] space-y-1.5 px-4 py-3 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        {TERM_LINES.slice(0, shown).map((line) => (
          <TermLine key={line.text} cmd={line.cmd} text={line.text} />
        ))}
        {partial !== null && <TermLine cmd text={partial} caret />}
      </div>
    </div>
  </div>
);

const BriefCard = () => (
  <div className="w-[82%] rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2.5">
    <ul className="space-y-1.5 text-[12px] leading-snug text-foreground sm:text-[13px]">
      {BRIEF_ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-[3px] border border-foreground/40" />
          <span className="truncate">{item}</span>
        </li>
      ))}
    </ul>
    <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      gmail · github · calendar
    </p>
  </div>
);

const BUBBLE = "max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-snug sm:text-sm";

const ChatRow = ({ msg }: { msg: Msg }) => {
  if (msg.kind === "brief") return <div className="acl-row flex"><BriefCard /></div>;
  const mine = msg.kind === "user";
  return (
    <div className={`acl-row flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={mine
        ? `${BUBBLE} rounded-br-sm bg-foreground text-background`
        : `${BUBBLE} rounded-bl-sm border border-border bg-background text-foreground`}
      >
        {msg.text}
      </div>
    </div>
  );
};

const TypingRow = () => (
  <div className="acl-row flex justify-start">
    <div className="inline-flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2.5">
      <i className="acl-tdot" />
      <i className="acl-tdot" />
      <i className="acl-tdot" />
    </div>
  </div>
);

const ChatPane = ({ msgs, typing, chan }: { msgs: Msg[]; typing: boolean; chan: string }) => (
  <div className="flex h-full flex-col">
    <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
      <span className="acl-dot" />
      <span className="text-sm font-semibold text-foreground">Fermix</span>
      <span className="text-[11px] text-muted-foreground">online</span>
      <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
        {chan}
      </span>
    </div>
    {/* justify-end + overflow-hidden: newest at the bottom, oldest clip off the top */}
    <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-4 py-3.5">
      {msgs.map((msg, i) => (
        <ChatRow key={i} msg={msg} />
      ))}
      {typing && <TypingRow />}
    </div>
  </div>
);

const AgentChatLoop = () => {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [mode, setMode] = useState<"term" | "chat">("term");
  const [term, setTerm] = useState<TermState>({ shown: 0, partial: null });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chan, setChan] = useState(CHAT[0].chan);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setMode("chat");
      setMsgs(SETTLED_MSGS);
      return;
    }
    if (!inView) return;
    const run = createLoopRunner();
    playLoop(run, { setMode, setTerm, setMsgs, setTyping, setChan }).catch((err) =>
      console.error("AgentChatLoop stopped:", err),
    );
    return () => run.stop();
  }, [inView]);

  const fade = "absolute inset-0 transition-opacity duration-500";
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="absolute inset-0 font-sans"
      style={{
        background:
          "radial-gradient(circle at 1px 1px, hsl(var(--foreground)/0.10) 1px, transparent 0) 0 0 / 16px 16px, hsl(var(--card))",
      }}
    >
      <style>{ACL_CSS}</style>
      <div className={`${fade} ${mode === "term" ? "opacity-100" : "opacity-0"}`}>
        <TerminalPane shown={term.shown} partial={term.partial} />
      </div>
      <div className={`${fade} ${mode === "chat" ? "opacity-100" : "opacity-0"}`}>
        <ChatPane msgs={msgs} typing={typing} chan={chan} />
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
.acl-caret { display:inline-block; width:7px; height:1.05em; margin-left:2px; vertical-align:-2px; background:hsl(var(--foreground)); animation: acl-caret 1s steps(1) infinite; }
@keyframes acl-caret { 50% { opacity: 0 } }
@media (prefers-reduced-motion: reduce){ .acl-dot::after,.acl-row,.acl-tdot,.acl-caret{ animation:none } }
`;

export default AgentChatLoop;
