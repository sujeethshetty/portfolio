import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import Reveal from "./Reveal";
import HeroMascots from "./HeroMascots";
import AiSiGlitch from "./AiSiGlitch";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// Type-first by design: the portrait lives on /resume, not here. On desktop a few
// tiny Fermix mascots float on the right and react when clicked.
const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24">
      {/* Elegant background - theme adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      <div className="absolute inset-0 bg-grid-pattern"></div>

      {/* Interactive particle background */}
      <ParticleBackground />
      <HeroMascots />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-4xl">
          <Reveal y={16}>
            <h1 className="text-5xl font-bold leading-[1.02] tracking-tighter sm:text-7xl lg:text-8xl">
              I&rsquo;m Sujeeth.
              <span className="mt-4 block text-balance text-3xl leading-tight tracking-tight text-muted-foreground sm:text-5xl lg:text-6xl">
                I build data platforms and <AiSiGlitch /> agents.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={100} y={16}>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              I design the systems products quietly depend on: data that arrives on time, models
              that answer fast, and agents that actually get work done. I like hard problems,
              simple architecture, and software that keeps running long after launch.
            </p>
          </Reveal>

          <Reveal delay={180} y={16}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-highlight text-highlight-foreground shadow-lg shadow-highlight/25 hover:bg-highlight/90"
                onClick={() => scrollTo("projects")}
              >
                See my work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:border-highlight"
                onClick={() => scrollTo("contact")}
              >
                <Mail className="mr-2 h-5 w-5" />
                Get in touch
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
