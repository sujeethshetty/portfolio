import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate on innovative AI and data engineering projects? 
            Let's discuss how we can build something amazing together.
          </p>
        </div>

        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <p className="text-muted-foreground mb-6">
                    Whether you're looking for a data engineer, AI specialist, or just want to chat about 
                    technology, I'm always open to new opportunities and conversations.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-highlight" />
                    <span className="text-muted-foreground">USA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-highlight" />
                    <a href="mailto:sujeeth.data@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      sujeeth.data@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="mailto:sujeeth.data@gmail.com">
                        <Mail className="h-5 w-5 mr-3" />
                        Send Email
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://www.linkedin.com/in/isujith/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5 mr-3" />
                        LinkedIn Profile
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://github.com/sujeethshetty" target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5 mr-3" />
                        GitHub Profile
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90">
                    Schedule a Meeting
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;