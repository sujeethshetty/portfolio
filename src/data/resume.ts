// Single source of truth for resume data
// Used by both Resume.tsx and prompt.ts

export interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  details?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  githubLink?: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export const experience: Experience[] = [
  {
    company: "Apexon",
    position: "Lead Data Engineer",
    duration: "09/2025 - Present",
    location: "Atlanta, United States",
    achievements: [
      "Built a real-time data pipeline using Kafka to process over 100M banking and financial data rows per day across 300+ topics, transforming and storing data in Snowflake for secure multi-tenant data sharing."
    ]
  },
  {
    company: "SmartAsset",
    position: "Senior Data Engineer",
    duration: "02/2023 - 08/2025",
    location: "Atlanta, United States",
    achievements: [
      "Designed and developed a low-latency REST endpoint that captures Google Tag Manager click IDs on a Terraform-provisioned EKS stack; the service responds in under 100 milliseconds at p95 and boosted attribution accuracy by 22%.",
      "Built batch ETL pipelines with Python, dbt, SQL, Airflow, and Snowflake that power the recommendation engine, pushing high-value client engagement to 90%, a 37 pp jump that unlocked $1M in added MRR.",
      "Spearheaded the MySQL to Snowflake migration with dbt star schemas and Airflow-driven ELT; lowered p95 query latency by 30%, cut batch loads by 40%, and added automated data-quality and freshness checks with alerting that held bad-record rates below 0.5%."
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
      "Optimized the ML model API with a high-performance Redis feature store integrated with Python FastAPI services, achieving a sub-10-millisecond SLA."
    ]
  },
  {
    company: "NuEra Automotive Solutions",
    position: "Founding Data Engineering & Analytics Intern",
    duration: "06/2020 - 05/2021",
    location: "Dallas, United States",
    achievements: [
      "Designed and built multi-tenant data pipelines with Python, Spark, SQL, and NiFi, boosting data extraction speed 10× and producing curated feature tables that drove our vehicle-price prediction ML model.",
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
      "Led the architectural redesign of PeopleSoft FMS (4M+ LOC) to enhance UX and performance, implemented PeopleSoft Fluid UI tool for optimal results, and mentored team members, demonstrating strong technical leadership.",
      "Implemented a Financial Snapshot chatbot integration with the PeopleSoft app, using Oracle Cloud, REST APIs, PeopleCode, and SQL, resulting in a 90% improvement in efficiency."
    ]
  },
  {
    company: "Cognizant",
    position: "Senior Developer",
    duration: "02/2011 - 08/2015",
    location: "Chennai, India",
    achievements: [
      "Efficiently managed PeopleSoft CRM update, service portal incorporation, and development of interaction models/quick case components, achieving a notable 60% performance optimization.",
      "Collaborated with JPMorgan Chase and BCBS clients to deliver customized CRM solutions that enhanced customer interaction workflows and system performance."
    ]
  }
];

export const education: Education[] = [
  {
    institution: "The University of Texas at Dallas",
    degree: "MS in Business Analytics",
    duration: "08/2019 - 05/2021"
  },
  {
    institution: "Visvesvaraya Technological University",
    degree: "BE in Telecommunications Engineering",
    duration: ""
  }
];

export const skills: Record<string, string[]> = {
  "Languages & Frameworks": ["Python", "SQL", "Scala", "PySpark", "FastAPI", "TypeScript", "Rust"],
  "Data Engineering": ["Apache Spark", "Apache Kafka", "Apache Airflow", "dbt", "Snowflake", "Redshift", "Databricks", "Hadoop", "HDFS"],
  "Cloud & DevOps": ["AWS", "Azure", "Terraform", "Kubernetes", "Docker", "EKS", "ECS", "EMR", "S3", "SQS", "CI/CD", "Git"],
  "Data Architecture": ["Data Modeling", "Data Lake", "Data Warehouse", "ETL", "ELT", "Star Schema", "Medallion Architecture", "Data Quality"],
  "AI & ML": ["LangChain", "Snowflake Cortex AI", "LLM", "MLOps", "Redis", "MCP", "OpenAI Agent SDK", "RAG", "Vector Databases"],
  "Visualization": ["Tableau", "Apache Superset"]
};

export const certifications: Certification[] = [
  { name: "AWS Certified Solutions Architect - Associate", issuer: "AWS" },
  { name: "AWS Certified Machine Learning - Specialty", issuer: "AWS" },
  { name: "Oracle SQL & PL/SQL Certified Developer", issuer: "Oracle" },
  { name: "DevOps", issuer: "University of Chicago" }
];

export const featuredProjects: Project[] = [
  {
    name: "OBaI",
    description: "A self-hosted, multi-agent research desk for stocks, crypto, and prediction markets. A central hub sends each question to the right specialists in parallel, each working through its own custom MCP server. A strategy agent backtests ideas with walk-forward validation and can paper trade them on Alpaca. Every run is traced end to end, with an eval suite that scores answers for faithfulness and completeness.",
    technologies: ["AI Agents", "OpenAI Agents SDK", "FastMCP", "Python", "Polars", "DuckDB", "Opik", "Docker"],
    link: "https://openbell.ai/obai/docs",
    githubLink: "https://github.com/sixteen-dev/obai"
  },
  {
    name: "Fermix",
    description: "Fermix is an open-source personal AI agent that lives on your own computer. It remembers what matters, works with the tools you connect, and gets things done without waiting for you to ask. It runs in the background, handles scheduled tasks, and reaches you through messaging apps or its desktop companion. You can use models from OpenAI, Anthropic, or run them locally with Ollama. Its memory, configuration, and logs stay on your machine, with permissions controlling what the agent can access.",
    technologies: ["Elixir", "OTP", "Phoenix LiveView", "SQLite", "AI Agents", "MCP", "TLA+"],
    link: "https://fermix.ai",
    githubLink: "https://github.com/tezra-io/fermix"
  }
];

export interface ProfessionalHighlight {
  title: string;
  company: string;
  impact: string;
  description: string;
  technologies: string[];
}

export const professionalHighlights: ProfessionalHighlight[] = [
  {
    title: "Real-Time Financial Data Platform",
    company: "Apexon",
    impact: "100M+ rows/day",
    description: "Built real-time data pipeline processing banking & financial data across 300+ Kafka topics into Snowflake for secure multi-tenant data sharing.",
    technologies: ["Apache Kafka", "Snowflake", "Python", "AWS"]
  },
  {
    title: "Revenue Attribution & Recommendation Platform",
    company: "SmartAsset",
    impact: "+$1M MRR",
    description: "Batch ETL pipelines powering the recommendation engine, pushing high-value client engagement to 90%, a 37pp jump.",
    technologies: ["Python", "dbt", "Airflow", "Snowflake"]
  },
  {
    title: "ML Inference Platform (Sub-10ms SLA)",
    company: "Slalom",
    impact: "+$5M MRR",
    description: "Feature store, model registry, orchestration, and real-time inference API with sub-10ms SLA via Redis + FastAPI.",
    technologies: ["FastAPI", "Redis", "MLOps", "AWS", "Feature Store", "Kubernetes"]
  },
  {
    title: "100TB Hadoop to Redshift Migration",
    company: "Slalom",
    impact: "25% cost reduction",
    description: "Led on-prem Hadoop to AWS Redshift migration with KMS encryption and IAM row-level security. Mentored a 3-engineer team.",
    technologies: ["AWS Redshift", "Hadoop", "Terraform", "Apache Spark", "AWS Glue"]
  }
];

export const professionalSummary = `Data and AI engineer specializing in enterprise data platforms and production AI systems. I design scalable data architectures, real-time pipelines, and intelligent agents that turn complex systems into reliable products. My work spans cloud infrastructure, data engineering, and applied AI, with a focus on performance, simplicity, and measurable business impact.`;

// Helper function to generate text summary for chatbot context
export function generateExperienceSummary(): string {
  return experience.map(job => {
    const highlights = job.achievements.slice(0, 2).join(' '); // First 2 achievements
    return `**${job.company}** (${job.position}, ${job.duration}): ${highlights}`;
  }).join('\n\n');
}

export function generateSkillsSummary(): string {
  return Object.entries(skills)
    .map(([category, skillList]) => `${category}: ${skillList.join(', ')}`)
    .join('\n');
}
