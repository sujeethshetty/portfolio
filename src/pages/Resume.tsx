import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Linkedin,
  Github,
  BookOpen,
  ExternalLink,
  Download,
  Briefcase,
  Award,
  GraduationCap,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { PERSONAL_INFO } from "@/config/constants";
import {
  experience,
  education,
  skills,
  certifications,
  featuredProjects,
  professionalHighlights,
} from "@/data/resume";

const Resume = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        {/* Profile Hero - Mobile: full-screen image with blue gradient */}
        <div className="md:hidden relative -mx-4 sm:-mx-6 -mt-20 sm:-mt-24 h-[100svh] mb-8">
          <img
            src="/profile.jpg"
            alt={PERSONAL_INFO.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 pb-10">
            <h1 className="text-3xl font-bold text-white mb-1">
              {PERSONAL_INFO.name}
            </h1>
            <p className="text-lg font-medium text-white/80 mb-2">
              {PERSONAL_INFO.title}
            </p>
            <p className="text-sm text-white/70 flex items-center gap-1 mb-4">
              <MapPin className="h-4 w-4" />
              {PERSONAL_INFO.location}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 text-sm hover:bg-white/30 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Resume
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={PERSONAL_INFO.medium}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <p className="md:hidden text-muted-foreground leading-relaxed mb-16">
          Cloud Data Architect designing the backbone for enterprise AI. From architecting robust data models to
deploying retrieval-augmented generation pipelines, I build platforms that turn real-time data into business
value, slashing decision latency and directly driving seven-figure revenue growth.
        </p>

        {/* Profile Hero - Desktop: side-by-side layout */}
        <section className="hidden md:flex items-start gap-8 mb-16">
          <div className="relative flex flex-col items-start flex-shrink-0 pb-3">
            <img
              src="/profile.jpg"
              alt={PERSONAL_INFO.name}
              className="w-44 h-44 rounded-2xl object-cover border-2 border-border shadow-md"
            />
            <div className="flex items-center justify-center gap-1.5 w-44 absolute -bottom-5 left-0 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-highlight text-highlight-foreground px-1.5 py-0.5 text-xs hover:bg-highlight/90 transition-colors"
              >
                <Download className="h-3 w-3" />
                Resume
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center rounded-md border border-border p-1 text-muted-foreground hover:text-highlight hover:border-highlight transition-colors"
              >
                <Linkedin className="h-3 w-3" />
              </a>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center rounded-md border border-border p-1 text-muted-foreground hover:text-highlight hover:border-highlight transition-colors"
              >
                <Github className="h-3 w-3" />
              </a>
              <a
                href={PERSONAL_INFO.medium}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                className="inline-flex items-center justify-center rounded-md border border-border p-1 text-muted-foreground hover:text-highlight hover:border-highlight transition-colors"
              >
                <BookOpen className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="text-left flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {PERSONAL_INFO.name}
            </h1>
            <p className="text-xl text-highlight font-medium mb-3">
              {PERSONAL_INFO.title}
            </p>
            <p className="text-muted-foreground flex items-center gap-1 mb-4">
              <MapPin className="h-4 w-4" />
              {PERSONAL_INFO.location}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cloud Data Architect designing the backbone for enterprise AI. From architecting robust data models to
deploying retrieval-augmented generation pipelines, I build platforms that turn real-time data into business
value, slashing decision latency and directly driving seven-figure revenue growth.
            </p>
          </div>
        </section>

        {/* Project Spotlight */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Rocket className="h-5 w-5 text-highlight" />
            Project Spotlight
          </h2>

          {/* Personal Projects */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Personal & Open Source
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {featuredProjects.map((project, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-foreground">
                      {project.name}
                    </h3>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-highlight hover:text-highlight/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 5}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Professional Highlights */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Professional Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalHighlights.map((highlight, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground">
                      {highlight.title}
                    </h3>
                    <div className="flex items-center gap-1 text-highlight flex-shrink-0 ml-2">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">
                        {highlight.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    @ {highlight.company}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {highlight.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {highlight.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Career Journey */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Briefcase className="h-5 w-5 text-highlight" />
            Career Journey
          </h2>
          <div className="space-y-0 divide-y divide-border">
            {experience.map((job, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 first:pt-0">
                <span className="text-sm font-mono text-muted-foreground sm:w-16 flex-shrink-0">
                  {job.duration.split("/")[1]?.split(" ")[0] ||
                    job.duration.substring(0, 4)}
                </span>
                <span className="font-semibold text-foreground sm:w-40 flex-shrink-0">
                  {job.company}
                </span>
                <span className="text-sm text-muted-foreground flex-1">
                  {job.position}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline flex-shrink-0">
                  {job.location}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Tools */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-highlight" />
            Skills & Tools
          </h2>
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-4">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Credentials */}
        <section>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <GraduationCap className="h-5 w-5 text-highlight" />
            Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {cert.name}
                        </span>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {cert.issuer}
                        </Badge>
                      </div>
                      {index < certifications.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium text-foreground">
                        {edu.degree}
                      </p>
                      <p className="text-sm text-highlight">{edu.institution}</p>
                      {edu.duration && (
                        <p className="text-xs text-muted-foreground">
                          {edu.duration}
                        </p>
                      )}
                      {index < education.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Chatbot />
    </div>
  );
};

export default Resume;
