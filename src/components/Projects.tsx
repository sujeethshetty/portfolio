import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { PERSONAL_INFO } from "@/config/constants";

const Projects = () => {
  const projects = [
    {
      title: "openbell.ai / OBaI",
      description: "Real-time financial news platform that uses LLMs to score market impact of breaking news, serving curated insights to investors. Includes OBaI — a multi-agent AI system for stock market research powered by GPT and real-time custom MCP servers, with autonomous strategy backtesting and automated trading.",
      technologies: ["OpenAI Agent SDK", "FastMCP", "Docker", "Python", "Polars", "DuckDB", "AI Agents"],
      demoLink: "https://openbell.ai",
      demoLabel: "Live Demo",
      githubLink: "https://github.com/sixteen-dev/obai",
      logo: "/openbell-logo.png",
      iconBg: "bg-white",
      featured: true
    },
    {
      title: "fermix",
      description: "Your personal AI, everywhere you are. Fermix is an always-on, fully-local Elixir daemon that lives on your own machine and meets you in the apps you already use — Telegram, WhatsApp, Slack, Discord, Signal, voice, or the terminal. One resilient BEAM runtime schedules work while you sleep, dispatches subagents for the heavy lifting, and remembers what matters — staying provider-agnostic across OpenAI, Claude, Grok, Mistral, and local Ollama. Your assistant, your hardware, no SaaS in the middle.",
      technologies: ["Elixir", "OTP", "Phoenix", "BEAM", "AI Agents", "MCP", "Multi-Provider LLM"],
      demoLink: "https://tezra.io/projects/fermix",
      demoLabel: "Project Page",
      githubLink: "https://github.com/tezra-io/fermix",
      logo: "/fermix-logo.png",
      iconBg: "bg-[#0b1020]",
      featured: true
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of innovative AI and data engineering solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg overflow-hidden border border-border/50 flex items-center justify-center ${project.iconBg}`}>
                      <img
                        src={project.logo}
                        alt={`${project.title} logo`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-highlight transition-colors">
                        {project.title}
                      </CardTitle>
                      {project.featured && (
                        <Badge variant="secondary" className="mt-1 bg-highlight/15 text-highlight border border-highlight/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {project.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-3 pt-4">
                  {project.demoLink && (
                    <Button variant="default" size="sm" asChild className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {project.demoLabel}
                      </a>
                    </Button>
                  )}
                  {project.githubLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Interested in seeing more of my work?
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;