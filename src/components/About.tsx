import { Card, CardContent } from "@/components/ui/card";
import { SiApachespark, SiOpenai, SiPython } from "react-icons/si";
import { Cloud, Bot, Activity } from "lucide-react";

const About = () => {
  const expertise = [
    {
      icon: SiApachespark,
      title: "Data Engineering",
      description: "ETL pipelines, data modeling, warehouse migrations, and real-time streaming architectures"
    },
    {
      icon: SiOpenai,
      title: "AI Integration",
      description: "LLM-powered applications, RAG systems, function calling, and fine-tuning models"
    },
    {
      icon: Bot,
      title: "AI Agents",
      description: "Multi-agent orchestration, MCP servers, tool-use patterns, and autonomous workflows"
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "AWS, Kubernetes, Terraform, and Cloudflare for scalable cloud-native deployments"
    },
    {
      icon: SiPython,
      title: "Backend Systems",
      description: "Python, RESTful APIs, distributed systems, and event-driven architectures"
    },
    {
      icon: Activity,
      title: "Real-time Analytics",
      description: "AI-scored news pipelines, market data processing, and live monitoring dashboards"
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in building intelligent data solutions and AI-powered applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
};

export default About;
