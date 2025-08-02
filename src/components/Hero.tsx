import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-highlight/10 text-highlight-foreground border border-highlight/20 mb-8">
          <span className="w-2 h-2 bg-highlight rounded-full mr-2"></span>
          Available for opportunities
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          Hi, I'm{" "}
          <span className="text-foreground">Sujeeth</span>
          <br />
          <span className="text-highlight">AI and Data Engineer</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Passionate about building intelligent data solutions that drive impact. 
          Experienced in AI, machine learning, and scalable data engineering with 
          cutting-edge technologies like AWS, OpenAI, and modern data stacks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule a meet
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#projects" className="flex items-center">
              View Projects
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;