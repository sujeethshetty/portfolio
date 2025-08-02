import { Card, CardContent } from "@/components/ui/card";
import { SiApachespark, SiOpenai, SiPython } from "react-icons/si";
import { Brain, Cloud } from "lucide-react";

const About = () => {
  const expertise = [
    {
      icon: SiApachespark,
      title: "Data Engineering",
      description: "Building robust ETL pipelines, data modeling, and data warehouse migration"
    },
    {
      icon: SiOpenai,
      title: "AI Integration",
      description: "Implementing cutting-edge AI solutions with LLMs and ML models"
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "AWS, Kubernetes, and Terraform for scalable cloud solutions"
    },
    {
      icon: SiPython,
      title: "Backend Systems",
      description: "Python, RESTful APIs, MCP Server, and distributed systems architecture"
    }
  ];

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in building intelligent data solutions and AI-powered applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertise.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-highlight/20 transition-colors">
                  <item.icon className="h-6 w-6 text-highlight" style={{ color: 'currentColor' }} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto group hover:shadow-lg transition-all duration-300 border-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-highlight/20 transition-colors">
                <Brain className="h-6 w-6 text-highlight" />
              </div>
              <h3 className="font-semibold mb-2">Continuous Learning Journey</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I embrace the mindset of a perpetual learner in the rapidly evolving field of AI and data engineering. 
                Every project is an opportunity to explore new technologies, implement innovative solutions, and push 
                the boundaries of what's possible with modern data stacks and AI technologies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;