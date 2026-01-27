import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, PenTool } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLocation, Link } from "react-router-dom";
import { PERSONAL_INFO } from "@/config/constants";

// Custom Bluesky icon (from Bootstrap Icons) - uses currentColor to match theme
const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
  </svg>
);

const Header = () => {
  const location = useLocation();
  const isResumePage = location.pathname === '/resume';
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Kaushan Script, cursive' }}>
            {isResumePage ? (
              <Link to="/" className="hover:text-highlight transition-colors">
                Sujeeth
              </Link>
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
            
            {/* Desktop: Show all social icons + resume button */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://bsky.app/profile/sujeeth.dev" target="_blank" rel="noopener noreferrer">
                  <BlueskyIcon className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${PERSONAL_INFO.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={PERSONAL_INFO.medium} target="_blank" rel="noopener noreferrer">
                  <PenTool className="h-5 w-5" />
                </a>
              </Button>
              <Button className="bg-highlight text-highlight-foreground hover:bg-highlight/90 ml-2" asChild>
                <Link to={isResumePage ? "/" : "/resume"}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isResumePage ? "Portfolio" : "Resume"}
                </Link>
              </Button>
            </div>

            {/* Mobile: Show essential social links + resume button */}
            <div className="flex sm:hidden items-center space-x-1">
              <Button variant="ghost" size="icon" asChild>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://bsky.app/profile/sujeeth.dev" target="_blank" rel="noopener noreferrer">
                  <BlueskyIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${PERSONAL_INFO.email}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button className="bg-highlight text-highlight-foreground hover:bg-highlight/90 ml-1" size="sm" asChild>
                <Link to={isResumePage ? "/" : "/resume"}>
                  <FileText className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;