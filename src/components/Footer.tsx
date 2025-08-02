import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Sujeeth Shetty</h3>
            <p className="text-muted-foreground">AI and Data Engineer</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/sujeethshetty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/isujith/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:sujeeth.data@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-muted-foreground">
          <p>&copy; 2024 Sujeeth Shetty. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;