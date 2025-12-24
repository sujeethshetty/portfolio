import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Calendar,
  ExternalLink,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PERSONAL_INFO } from "@/config/constants";

const Resume = () => {
  const experience = [
    {
      company: "SmartAsset",
      position: "Senior Data Engineer L5",
      duration: "02/2023 - Present",
      location: "Atlanta, United States",
      achievements: [
        "Designed and developed a low-latency REST endpoint that captures Google Tag Manager click IDs on a Terraform-provisioned EKS stack; the service responds in under 100 milliseconds p95, boosts attribution accuracy by 22%.",
        "Built batch ETL pipelines Python, dbt, SQL, Airflow, and Snowflake that power our recommendation engine, pushing high value client engagement to 90%, a 37 pp jump that unlocked $1M in added MRR.",
        "Spearheaded the MySQL to Snowflake migration with DBT star-schemas and Airflow-driven ELT; lowered p95 query latency by 30%, cut batch loads by 40%, and added automated data-quality and freshness checks with alerting that held bad-record rates below 0.5%."
      ]
    },
    {
      company: "Slalom",
      position: "Senior Data Engineer",
      duration: "06/2021 - 02/2023",
      location: "Atlanta, United States",
      achievements: [
        "Spearheaded a 100-terabyte migration from on-prem Hadoop to AWS Redshift; mentored a three-engineer team, reduced monthly infrastructure costs by 25 percent, and implemented KMS encryption with IAM-based row-level security.",
        "Engineered an end-to-end ML pipeline, including feature store, data transformation, orchestration, model registry, and real-time inference API, which supported business growth and contributed an additional $5M MRR.",
        "Drove the optimization of the ML model API by high-performance Redis Feature Store, and integrating it with Python-based FastAPI services, achieving a sub-10-millisecond SLA."
      ]
    },
    {
      company: "NuEra Automotive Solutions",
      position: "Founding Data Engineering & Analytics Intern",
      duration: "06/2020 - 05/2021",
      location: "Dallas, United States",
      achievements: [
        "Designed and built multi-tenant data pipelines with Python, Spark, SQL, and NiFi, boosting data extraction speed 10× and produced curated feature tables that drove our vehicle-price prediction ML model.",
        "Researched and implemented a scalable data lake from scratch on AWS EMR, after evaluating multiple architectures, boosting data-ingestion throughput 5x and unlocking advanced forecasting models.",
        "Achieved over 40% revenue growth by implementing KPIs and reporting dashboards for sales performance and inventory management using Apache Superset."
      ]
    },
    {
      company: "Oracle",
      position: "Project Lead ERP Development",
      duration: "08/2015 - 07/2019",
      location: "Bangalore, India",
      achievements: [
        "Led the architectural redesign of PeopleSoft FMS(4M+ LOC) to enhance UX and performance, implemented PeopleSoft Fluid UI tool for optimal results, and mentored team members, demonstrating strong technical leadership.",
        "Implemented state-of-the-art Financial Snapshot Chatbot integration with PeopleSoft App, utilizing Oracle Cloud, REST APIs, PeopleCode, and SQL, resulting in a 90% improvement in efficiency.",
        "Managed cross-functional teams to deliver enterprise-level financial management solutions, ensuring compliance with industry standards and improving system reliability."
      ]
    },
    {
      company: "Cognizant Technology Solutions",
      position: "Senior Developer",
      duration: "02/2011 - 08/2015",
      location: "Chennai, India",
      achievements: [
        "Efficiently managed PeopleSoft CRM update, service portal incorporation, and development of interaction models/quick case components, achieving a notable 60% performance optimization.",
        "Collaborated with JPMorgan Chase and BCBS clients to deliver customized CRM solutions that enhanced customer interaction workflows and system performance.",
        "Developed and maintained complex PeopleCode applications, ensuring seamless integration with existing enterprise systems and meeting strict security requirements."
      ]
    }
  ];

  const education = [
    {
      institution: "The University of Texas at Dallas",
      degree: "MS in Business Analytics",
      duration: "08/2019 - 05/2021",
      details: ""
    },
    {
      institution: "Visvesvaraya Technological University",
      degree: "BE in Telecommunications Engineering",
      duration: "08/2006 - 06/2010",
      details: ""
    }
  ];

  const skills = {
    "Core Technologies": ["Python", "SQL", "AWS", "Spark", "MLOps", "DBT", "Big Data", "Airflow", "Kubernetes"],
    "Data & Analytics": ["DataOps", "Scala", "ETL", "ELT", "AI/ML", "HDFS", "Data Lake", "Snowflake", "Hadoop"],
    "Development & DevOps": ["FastAPI", "Oracle", "PySpark", "Terraform", "Git", "CI/CD", "Docker", "SQS", "EKS"],
    "Visualization & Cloud": ["Tableau", "S3", "Data Modeling", "Databricks", "Azure", "Data Warehouse"],
    "AI & Modern Stack": ["ChatGPT API", "FastMCP", "RAG", "UNIX"]
  };

  const certifications = [
    { name: "AWS Certified Solutions Architect - Associate", issuer: "AWS" },
    { name: "AWS Certified Machine Learning - Specialty", issuer: "AWS" },
    { name: "Oracle SQL & PL/SQL Certified Developer", issuer: "Oracle" },
    { name: "DevOps", issuer: "University of Chicago" }
  ];

  const projects = [
    {
      name: "openbell.ai",
      description: "Real-time financial news platform with AI-powered impact scores",
      technologies: ["AWS", "ECS", "ChatGPT API", "Next.js", "LLM"],
      link: "https://openbell.ai"
    },
    {
      name: "pyaibridge",
      description: "Unified API library for multiple LLM providers",
      technologies: ["python", "async", "api-client", "ai/ml", "gemini", "openai", "claude", "xai", "llm"],
      link: "https://github.com/sixteen-dev/pyaibridge"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 max-w-4xl">
        {/* Header with download button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{PERSONAL_INFO.name}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{PERSONAL_INFO.title}</p>
          </div>
          <Button className="bg-highlight text-highlight-foreground hover:bg-highlight/90 w-fit" asChild>
            <a href={PERSONAL_INFO.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>
          </Button>
        </div>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-sm hover:text-highlight">
                  {PERSONAL_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-highlight">
                  linkedin.com/in/isujith
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-highlight">
                  github.com/sujeethshetty
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Cloud Data Architect designing the backbone for enterprise AI. From architecting robust data models to
              deploying retrieval-augmented generation pipelines, I build platforms that turn real-time data into business
              value, slashing decision latency and directly driving seven-figure revenue growth.
            </p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Professional Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.map((job, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.position}</h3>
                    <p className="text-highlight font-medium">{job.company}</p>
                  </div>
                  <div className="sm:text-right text-sm text-muted-foreground sm:flex-shrink-0">
                    <p>{job.duration}</p>
                    <p className="hidden sm:block">{job.location}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {job.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-sm">{achievement}</li>
                  ))}
                </ul>
                {index < experience.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <h4 className="font-medium mb-2 text-foreground">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Featured Projects */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Featured Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="mb-2">
                  <h3 className="font-semibold text-lg flex items-center space-x-2">
                    <span>{project.name}</span>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-highlight hover:text-highlight/80">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {index < projects.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <span className="font-medium">{cert.name}</span>
                  <Badge variant="outline" className="text-xs">{cert.issuer}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{edu.degree}</h3>
                    <p className="text-highlight font-medium">{edu.institution}</p>
                    {edu.details && <p className="text-muted-foreground text-sm">{edu.details}</p>}
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.duration}</p>
                </div>
                {index < education.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Resume;