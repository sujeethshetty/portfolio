import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PERSONAL_INFO } from "@/config/constants";
import {
  experience,
  education,
  skills,
  certifications,
  featuredProjects as projects,
  professionalSummary
} from "@/data/resume";

const Resume = () => {
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
              {professionalSummary}
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