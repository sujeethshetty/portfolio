import { Badge } from "@/components/ui/badge";

const TechStack = () => {
  const technologies = [
    { name: "Python", category: "Languages" },
    { name: "SQL", category: "Databases" },
    { name: "AWS", category: "Cloud" },
    { name: "OpenAI", category: "AI/ML" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "Terraform", category: "Infrastructure" },
    { name: "Apache Spark", category: "Big Data" },
    { name: "Docker", category: "Containerization" },
    { name: "Unix/Linux", category: "Systems" },
    { name: "Snowflake", category: "Data Warehouse" },
    { name: "PostgreSQL", category: "Databases" },
    { name: "ETL Pipelines", category: "Data Engineering" }
  ];

  const categories = [
    { name: "Languages", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" },
    { name: "Databases", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" },
    { name: "Cloud", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300" },
    { name: "AI/ML", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300" },
    { name: "DevOps", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300" },
    { name: "Infrastructure", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" },
    { name: "Big Data", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300" },
    { name: "Containerization", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300" },
    { name: "Systems", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300" },
    { name: "Data Warehouse", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300" },
    { name: "Data Engineering", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300" }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.color : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  return (
    <section id="tech-stack" className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Tech Stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build scalable and intelligent data solutions
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {technologies.map((tech, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`text-sm px-4 py-2 ${getCategoryColor(tech.category)} border-0 hover:scale-105 transition-transform`}
            >
              {tech.name}
            </Badge>
          ))}
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