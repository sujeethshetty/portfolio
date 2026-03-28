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
  tags?: string[];
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
    position: "Senior Data Engineer L5",
    duration: "02/2023 - 08/2025",
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
      "Implemented state-of-the-art Financial Snapshot Chatbot integration with PeopleSoft App, utilizing Oracle Cloud, REST APIs, PeopleCode, and SQL, resulting in a 90% improvement in efficiency."
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
  "AI & ML": ["AI Agents", "Snowflake Cortex AI", "LLM", "MLOps", "Redis", "MCP", "OpenAI Agent SDK", "RAG", "Vector Databases"],
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
    name: "openbell.ai / OBaI",
    description: "Real-time financial news platform that uses LLMs to score market impact of breaking news, serving curated insights to investors. Includes OBaI — a multi-agent AI system for stock market research powered by GPT and real-time custom MCP servers, with autonomous strategy backtesting and automated trading.",
    technologies: ["AI Agents", "OpenAI Agent SDK", "FastMCP", "Python", "Docker", "Polars", "DuckDB"],
    link: "https://openbell.ai",
    githubLink: "https://github.com/sixteen-dev/obai",
    tags: ["Personal", "AI", "Full Stack"]
  },
  {
    name: "pyaibridge",
    description: "Open-source Python library providing a unified async interface across OpenAI, Gemini, Claude, and xAI. Swap providers with zero code changes.",
    technologies: ["Python", "OpenAI", "Gemini", "Claude", "xAI", "Async"],
    link: "https://github.com/sixteen-dev/pyaibridge",
    tags: ["Open Source", "AI", "Developer Tool"]
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
    description: "Real-time ETL pipelines powering the recommendation engine, pushing high-value client engagement to 90%, a 37pp jump.",
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

export const professionalSummary = `Cloud Data Architect designing the backbone for enterprise data and AI. From architecting robust data models to deploying retrieval-augmented generation pipelines, I build platforms that turn real-time data into business value, slashing decision latency and directly driving seven-figure revenue growth.`;

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
