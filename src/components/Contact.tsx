import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { PERSONAL_INFO } from "@/config/constants";
import Reveal from "./Reveal";

const Contact = () => {
  return (
    <section id="contact" className="bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Let&rsquo;s talk</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            If your team is working on challenging data or AI problems, I&apos;d like to hear
            about it. Email is the fastest way to reach me.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="group mt-10 inline-flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            <span className="underline decoration-border decoration-2 underline-offset-8 transition-colors group-hover:decoration-foreground">
              {PERSONAL_INFO.email}
            </span>
            <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-8 sm:w-8" />
          </a>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90" asChild>
              <a href={PERSONAL_INFO.topmateUrl} target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Book 30 minutes
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/resume">
                <FileText className="mr-2 h-5 w-5" />
                View resume
              </Link>
            </Button>
          </div>
          <p className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {PERSONAL_INFO.location}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
