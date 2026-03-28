import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, PenTool } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLocation, Link } from "react-router-dom";
import { PERSONAL_INFO } from "@/config/constants";

// Custom X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Header = () => {
  const location = useLocation();
  const isResumePage = location.pathname === '/resume';
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
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
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/#/#about" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                About
              </a>
              <a href="/#/#blog" className="text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Blog
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
                <a href="https://x.com/xsujeeth" target="_blank" rel="noopener noreferrer">
                  <XIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${PERSONAL_INFO.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={import.meta.env.DEV ? "http://localhost:4325" : "https://blogs.sujeeth.io"} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                  const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
                  const url = new URL(e.currentTarget.href);
                  url.searchParams.set("theme", theme);
                  e.currentTarget.href = url.toString();
                }}>
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
                <a href="https://x.com/xsujeeth" target="_blank" rel="noopener noreferrer">
                  <XIcon className="h-3.5 w-3.5" />
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