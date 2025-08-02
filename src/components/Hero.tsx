import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";

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
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
      {/* Elegant background - theme adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      <div className="absolute inset-0 bg-grid-pattern"></div>
      
      {/* Interactive particle background */}
      <ParticleBackground />
      
      {/* Floating shapes - theme adaptive */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-highlight/[0.03] dark:bg-highlight/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/[0.03] dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-highlight/15 text-highlight border border-highlight/30 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" style={{ backgroundColor: '#00FF41' }}></span>
          Available for opportunities
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          Hi, I'm{" "}
          <span className="text-foreground">Sujeeth</span>
          <br />
          <span className="text-muted-foreground">AI & Data</span>{" "}
          <span className="inline-block relative text-highlight">
            <span className="invisible">{titles.reduce((a, b) => a.length > b.length ? a : b)}</span>
            <span className={`absolute inset-0 ${isAnimating ? 'animate-word-slide' : ''}`}>
              {titles[currentTitle]}
            </span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          AWS-certified Solutions Architect who applies systems thinking to transform petabyte-scale 
          streaming data into actionable ML features and real-time dashboards. Builds AI agents and 
          retrieval-augmented generation pipelines that unlock seven-figure revenue channels.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule a meet
          </Button>
          <Button variant="outline" size="lg" onClick={() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            View Projects
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;