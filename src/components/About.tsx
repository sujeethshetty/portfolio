import { SiApachespark, SiOpenai, SiPython } from "react-icons/si";
import { Cloud, Bot, Activity } from "lucide-react";
import Reveal from "./Reveal";

const About = () => {
  const expertise = [
    {
      icon: SiApachespark,
      title: "Data Engineering",
      description:
        "ETL pipelines, data modeling, warehouse migrations, and real-time streaming architectures",
    },
    {
      icon: SiOpenai,
      title: "AI Integration",
      description:
        "LLM-powered applications, RAG systems, function calling, and fine-tuning models",
    },
    {
      icon: Bot,
      title: "AI Agents",
      description:
        "Multi-agent orchestration, MCP servers, tool-use patterns, and autonomous workflows",
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description:
        "AWS, Kubernetes, Terraform, and Cloudflare for scalable cloud-native deployments",
    },
    {
      icon: SiPython,
      title: "Backend Systems",
      description:
        "Python, RESTful APIs, distributed systems, and event-driven architectures",
    },
    {
      icon: Activity,
      title: "Real-time Analytics",
      description:
        "AI-scored news pipelines, market data processing, and live monitoring dashboards",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where I go deep — from streaming pipelines to multi-agent systems.
          </p>
        </Reveal>

        {/* Compact card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {expertise.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) * 70} y={18}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border p-6 transition-all duration-500 hover:-translate-y-1 hover:border-foreground hover:bg-foreground">
                  {/* Ghost index number */}
                  <span className="pointer-events-none absolute -right-1 -top-5 select-none text-7xl font-bold tracking-tighter text-foreground/[0.04] transition-colors duration-500 group-hover:text-background/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-all duration-500 group-hover:rotate-6 group-hover:border-background/20 group-hover:bg-background/10 group-hover:text-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-5 text-lg font-semibold tracking-tight transition-colors duration-500 group-hover:text-background">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-sm text-muted-foreground transition-colors duration-500 group-hover:text-background/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
