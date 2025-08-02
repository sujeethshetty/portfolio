import { 
  Code, 
  Database, 
  Cloud, 
  Brain, 
  Cog, 
  Hammer, 
  BarChart3, 
  Package, 
  Terminal, 
  Warehouse,
  Zap
} from "lucide-react";

const TechStack = () => {
  const technologies = [
    { name: "Python", icon: Code },
    { name: "SQL", icon: Database },
    { name: "AWS", icon: Cloud },
    { name: "OpenAI", icon: Brain },
    { name: "Kubernetes", icon: Cog },
    { name: "Terraform", icon: Hammer },
    { name: "Apache Spark", icon: BarChart3 },
    { name: "Docker", icon: Package },
    { name: "Unix/Linux", icon: Terminal },
    { name: "Snowflake", icon: Warehouse },
    { name: "PostgreSQL", icon: Database },
    { name: "ETL Pipelines", icon: Zap }
  ];

  return (
    <section id="tech-stack" className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Tech Stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build scalable and intelligent data solutions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center p-6 bg-card rounded-lg border hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <IconComponent className="h-8 w-8 mb-3 text-foreground" />
                <span className="text-sm font-medium text-center">{tech.name}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Constantly exploring and adapting to new technologies in the rapidly evolving landscape of 
            AI, data engineering, and cloud computing. Always eager to learn and implement cutting-edge solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;