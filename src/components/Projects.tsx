import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { PERSONAL_INFO } from "@/config/constants";
import Reveal from "./Reveal";
import AgentChatLoop from "./AgentChatLoop";
import MarketSignalLoop from "./MarketSignalLoop";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  demoLabel: string;
  githubLink: string;
  logo: string;
  iconBg: string;
  featured?: boolean;
  /** Large preview image. Falls back to a monochrome panel if unset. */
  image?: string;
  /** Looping muted video (webm/mp4) for an exa-style animation. Takes priority over `image`; `image` is reused as the poster. */
  video?: string;
  /** Code-driven looping animation rendered inside the media frame. Takes priority over video/image. */
  animation?: "chat" | "market";
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
    className="group relative block aspect-[16/11] overflow-hidden rounded-2xl ring-1 ring-border/60 transition-all duration-450 ease-out-expo hover:ring-foreground/30 hover:-translate-y-1"
  >
    {project.animation === "chat" ? (
      <AgentChatLoop />
    ) : project.animation === "market" ? (
      <MarketSignalLoop />
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

const Projects = () => {
  const projects: Project[] = [
    {
      title: "openbell.ai / OBaI",
      description:
        "Real-time financial news platform that uses LLMs to score market impact of breaking news, serving curated insights to investors. Includes OBaI, a multi-agent AI system for stock market research powered by GPT and real-time custom MCP servers, with autonomous strategy backtesting and automated trading.",
      technologies: ["OpenAI Agent SDK", "FastMCP", "Docker", "Python", "Polars", "DuckDB", "AI Agents"],
      demoLink: "https://openbell.ai",
      demoLabel: "Live Demo",
      githubLink: "https://github.com/sixteen-dev/obai",
      logo: "/openbell-logo.png",
      iconBg: "bg-white",
      featured: true,
      animation: "market",
    },
    {
      title: "fermix.ai",
      description:
        "Your personal AI, everywhere you are. Fermix is an always-on, fully-local Elixir daemon that lives on your own machine and meets you in the apps you already use: Telegram, WhatsApp, Slack, Discord, Signal, voice, or the terminal. One resilient BEAM runtime schedules work while you sleep, dispatches subagents for the heavy lifting, and remembers what matters. It stays provider-agnostic across OpenAI, Claude, Grok, Mistral, and local Ollama. Your assistant, your hardware, no SaaS in the middle.",
      technologies: ["Elixir", "OTP", "Phoenix", "BEAM", "AI Agents", "MCP", "Multi-Provider LLM"],
      demoLink: "https://fermix.ai",
      demoLabel: "Project Page",
      githubLink: "https://github.com/tezra-io/fermix",
      logo: "/fermix-logo.png",
      iconBg: "bg-card",
      featured: true,
      animation: "chat",
    },
  ];

  return (
    <section id="projects" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production AI systems I architected, shipped, and scaled.
          </p>
        </Reveal>

        {/* Borderless editorial layout — whitespace and scale group the content,
            not frames. Media alternates side for rhythm; the animation is the hero. */}
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, index) => {
            const flipped = index % 2 === 1;
            return (
              <Reveal key={project.title} delay={index * 80}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className={flipped ? "lg:order-2" : ""}>
                    <ProjectMedia project={project} />
                  </div>

                  <div className={flipped ? "lg:order-1" : ""}>
                    <h3 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    {/* Tech stack as plain text — no pills, no boxes */}
                    <p className="mt-6 font-mono text-xs leading-relaxed text-muted-foreground/80">
                      {project.technologies.join("  ·  ")}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
                      >
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {project.demoLabel}
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Section CTA — mirrors the "Read All Posts" button in the blog section */}
        <Reveal className="mt-12 flex justify-center md:mt-16">
          <Button variant="outline" size="lg" asChild>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 mr-2" />
              View All Projects
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
