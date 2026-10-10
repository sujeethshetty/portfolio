import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

// Capability-focused on purpose: no employers, dates, or metrics here.
// Career history lives on /resume (src/data/resume.ts) so this stays evergreen.
const CAPABILITIES = [
  {
    title: "Data platforms",
    detail:
      "Streaming and batch pipelines, warehouses and lakes, data modeling, and the quality checks that keep it all trustworthy.",
  },
  {
    title: "Real-time and ML systems",
    detail:
      "Feature stores, low-latency model serving, and the infrastructure that takes models from experimentation to production.",
  },
  {
    title: "AI agents",
    detail:
      "Multi-agent orchestration, tool use and MCP, memory, and the evaluations and tracing that show whether an agent actually works.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">About</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I started in enterprise software, moved into data engineering, and now spend most of
              my time where data and AI meet. The work I like best is turning messy, high-volume
              data into systems people can trust, then building intelligent software on top of
              them.
            </p>
            <p>
              Outside of work, I build open-source AI agents. Fermix and OBaI are where I explore
              what agents can actually accomplish when they have tools, memory, and the ability to
              act on their own.
            </p>
          </div>
          <Link
            to="/resume"
            className="mt-8 inline-flex items-center gap-2 font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            View full experience
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <ul className="divide-y divide-border border-y border-border">
            {CAPABILITIES.map((item) => (
              <li key={item.title} className="py-6">
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
