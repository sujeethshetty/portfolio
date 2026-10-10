import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Github } from "lucide-react";
import Reveal from "./Reveal";
import AgentChatLoop from "./AgentChatLoop";
import AgentFanoutLoop from "./AgentFanoutLoop";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  demoLabel: string;
  githubLink: string;
  /** Optional extra link shown between the primary button and "View Code". */
  secondary?: { label: string; href: string };
  logo: string;
  iconBg: string;
  featured?: boolean;
  /** Large preview image. Falls back to a monochrome panel if unset. */
  image?: string;
  /** Looping muted video (webm/mp4) for an exa-style animation. Takes priority over `image`; `image` is reused as the poster. */
  video?: string;
  /** Code-driven looping animation rendered inside the media frame. Takes priority over video/image. */
  animation?: "chat" | "agents";
}

/**
 * Large media panel. Priority: coded animation → video → screenshot → branded placeholder.
 * NOTE: source imagery is already monochrome, so we only bump `contrast` —
 * we do NOT stack `grayscale` on top (that flattens the midtones and washes them out).
 */
const ProjectMedia = ({ project }: { project: Project }) => (
  <a
    href={project.demoLink}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${project.title}: ${project.demoLabel}`}
    className="group relative block aspect-[16/11] lg:aspect-video overflow-hidden rounded-2xl ring-1 ring-border/60 transition-all duration-450 ease-out-expo hover:ring-foreground/30 hover:-translate-y-1"
  >
    {project.animation === "chat" ? (
      <AgentChatLoop />
    ) : project.animation === "agents" ? (
      <AgentFanoutLoop />
    ) : project.video ? (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={project.image}
        className="absolute inset-0 h-full w-full object-cover contrast-[1.05] animate-ken-burns"
      >
        <source src={project.video} />
      </video>
    ) : project.image ? (
      <img
        src={project.image}
        alt={`${project.title} preview`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover contrast-[1.05] animate-ken-burns"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.09] to-foreground/[0.02]">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.12) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <span className="absolute -bottom-3 left-5 right-5 truncate text-5xl md:text-7xl font-bold tracking-tight text-foreground/[0.05]">
          {project.title}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`flex h-20 w-20 md:h-24 md:w-24 items-center justify-center overflow-hidden rounded-2xl border border-border/60 transition-transform duration-500 group-hover:scale-105 ${project.iconBg}`}
          >
            <img
              src={project.logo}
              alt={`${project.title} logo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    )}

    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
      <ExternalLink className="h-3.5 w-3.5" />
      {project.demoLabel}
    </span>
  </a>
);

const PROJECTS: Project[] = [
  {
    title: "Fermix",
    description:
      "Fermix is an open-source personal AI agent that lives on your own computer. It remembers what matters, works with the tools you connect, and gets things done without waiting for you to ask. It runs in the background, handles scheduled tasks, and reaches you through messaging apps or its desktop companion. You can use models from OpenAI, Anthropic, or run them locally with Ollama. Its memory, configuration, and logs stay on your machine, with permissions controlling what the agent can access.",
    technologies: ["Elixir", "OTP", "Phoenix LiveView", "SQLite", "MCP", "TLA+"],
    demoLink: "https://fermix.ai",
    demoLabel: "fermix.ai",
    secondary: { label: "Docs", href: "https://fermix.ai/docs/overview/" },
    githubLink: "https://github.com/tezra-io/fermix",
    logo: "/fermix-logo.png",
    iconBg: "bg-card",
    featured: true,
    animation: "chat",
  },
  {
    title: "OBaI",
    description:
      "OBaI is a self-hosted, multi-agent research desk for stocks, crypto, and prediction markets. A central hub sends each question to the right specialists in parallel, each working through its own custom MCP server, and merges their findings into one answer. A strategy agent backtests ideas with walk-forward validation and can paper trade them on Alpaca. Every run is traced end to end, and an eval suite scores answers for faithfulness and completeness.",
    technologies: ["Python", "OpenAI Agents SDK", "FastMCP", "Polars", "DuckDB", "Opik"],
    demoLink: "https://youtu.be/62E0JBasyCQ",
    demoLabel: "Watch demo",
    secondary: { label: "Docs", href: "https://openbell.ai/obai/docs" },
    githubLink: "https://github.com/sixteen-dev/obai",
    logo: "/openbell-logo.png",
    iconBg: "bg-white",
    featured: true,
    animation: "agents",
  },
];

const ghostLink = "text-muted-foreground hover:text-foreground";

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
    <Button size="sm" asChild className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" />
        {project.demoLabel}
      </a>
    </Button>
    {project.secondary && (
      <Button variant="ghost" size="sm" asChild className={ghostLink}>
        <a href={project.secondary.href} target="_blank" rel="noopener noreferrer">
          <BookOpen className="mr-2 h-4 w-4" />
          {project.secondary.label}
        </a>
      </Button>
    )}
    <Button variant="ghost" size="sm" asChild className={ghostLink}>
      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
        <Github className="mr-2 h-4 w-4" />
        View code
      </a>
    </Button>
  </div>
);

const Projects = () => {
  return (
    <section id="projects" className="pb-16 pt-12 md:pb-20 md:pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Things I&rsquo;ve built</h2>
        </Reveal>

        {/* Two-up on desktop so both projects read side by side; stacks on smaller screens.
            Buttons pin to the bottom so the columns line up regardless of copy length. */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.title} delay={index * 100} className="h-full">
              <article className="flex h-full flex-col">
                <ProjectMedia project={project} />
                <h3 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">{project.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{project.description}</p>
                {/* Tech stack as plain text — no pills, no boxes */}
                <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground/80">
                  {project.technologies.join("  ·  ")}
                </p>
                <ProjectLinks project={project} />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center text-sm text-muted-foreground md:mt-14">
          Also built:{" "}
          <a
            href="https://openbell.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            openbell.ai
          </a>
          , a financial news feed that uses LLMs to rank breaking stories by likely market impact.
        </Reveal>

      </div>
    </section>
  );
};

export default Projects;
