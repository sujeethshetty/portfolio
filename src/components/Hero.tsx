import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import { PERSONAL_INFO } from "@/config/constants";

const Hero = () => {
  const [currentTitle, setCurrentTitle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const titles = ["Engineer", "Architect"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTitle((prev) => (prev + 1) % titles.length);
        setIsAnimating(false);
      }, 300); // Half animation duration
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 relative overflow-hidden">
      {/* Elegant background - theme adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      <div className="absolute inset-0 bg-grid-pattern"></div>
      
      {/* Interactive particle background */}
      <ParticleBackground />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-highlight/10 text-highlight border border-highlight/20 mb-10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-highlight"></span>
          </span>
          Open to opportunities
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          <span className="text-foreground">{PERSONAL_INFO.name}</span>
          <br />
          <span className="text-muted-foreground">AI & Data</span>{" "}
          <span className="inline-block relative text-highlight">
            <span className="invisible">{titles.reduce((a, b) => a.length > b.length ? a : b)}</span>
            <span className={`absolute inset-0 ${isAnimating ? 'animate-word-slide' : ''}`}>
              {titles[currentTitle]}
            </span>
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Designing scalable architectures that bridge data, AI, and business impact.
          <span className="block mt-3">
            Applying systems thinking to turn petabyte-scale data into real-time intelligence.
          </span>
          <span className="block mt-3">
            Building AI agents and RAG pipelines that deliver seven-figure impact.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 shadow-lg shadow-highlight/25" asChild>
            <a href={PERSONAL_INFO.topmateUrl} target="_blank" rel="noopener noreferrer">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule a meeting
            </a>
          </Button>
          <Button variant="outline" size="lg" className="border-border hover:border-highlight" onClick={() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            View work
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;