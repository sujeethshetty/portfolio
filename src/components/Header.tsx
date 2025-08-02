import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, PenTool } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isResumePage = location.pathname === '/resume';
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Kaushan Script, cursive' }}>
            {isResumePage ? (
              <a href="/#/" className="hover:text-highlight transition-colors">
                Sujeeth
              </a>
            ) : (
              "Sujeeth"
            )}
          </div>
          
          {!isResumePage && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#/#about" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                About
              </a>
              <a href="/#/#tech-stack" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('tech-stack')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Tech Stack
              </a>
              <a href="/#/#projects" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Projects
              </a>
              <a href="/#/#contact" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Contact
              </a>
            </div>
          )}

          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/sujeethshetty" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.linkedin.com/in/isujith/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:sujeeth.data@gmail.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://medium.com/@datadelight" target="_blank" rel="noopener noreferrer">
                <PenTool className="h-5 w-5" />
              </a>
            </Button>
            <Button className="bg-highlight text-highlight-foreground hover:bg-highlight/90 ml-2 sm:ml-4" asChild>
              <a href={isResumePage ? "/#/" : "/#/resume"}>
                <FileText className="h-4 w-4 mr-2" />
                {isResumePage ? "Portfolio" : "Resume"}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;