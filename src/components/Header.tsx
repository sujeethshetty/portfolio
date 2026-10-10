import { Button } from "@/components/ui/button";
import { Github, Linkedin, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLocation, Link } from "react-router-dom";
import { PERSONAL_INFO } from "@/config/constants";

// Custom X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Home-page sections in scroll order (must match Index.tsx). */
const NAV = [
  { id: "projects", label: "Work" },
  { id: "blog", label: "Writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const SOCIAL = [
  { href: PERSONAL_INFO.github, label: "GitHub", Icon: Github, size: "h-4 w-4 sm:h-5 sm:w-5" },
  { href: PERSONAL_INFO.linkedin, label: "LinkedIn", Icon: Linkedin, size: "h-4 w-4 sm:h-5 sm:w-5" },
  { href: PERSONAL_INFO.x, label: "X (Twitter)", Icon: XIcon, size: "h-3.5 w-3.5 sm:h-4 sm:w-4" },
];

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const NavLinks = () => (
  <div className="hidden items-center gap-6 md:flex lg:gap-8">
    {NAV.map(({ id, label }) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={(e) => scrollToSection(e, id)}
        className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        {label}
      </a>
    ))}
  </div>
);

const SocialLinks = () => (
  <>
    {SOCIAL.map(({ href, label, Icon, size }) => (
      <Button key={label} variant="ghost" size="icon" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon className={size} />
        </a>
      </Button>
    ))}
  </>
);

// The wordmark's "ee" drawn as a ribbon bow. The right half is an "e" written out
// from the centre knot (crossbar, loop, exit tail that runs into the "t"); the
// left half is its mirror. Slanted and weighted to sit with the Kaushan letters.
const BOW_HALF =
  "M60 42 C72 40 95 32 100 18 C104 6 94 -3 83 0 C70 4 61 22 60 42 C59 54 70 64 87 64 C95 64 102 61 107 57";

const LogoBow = () => (
  <svg
    viewBox="0 0 120 80"
    aria-hidden="true"
    className="-mr-[0.16em] ml-[0.14em] inline-block h-[0.6em] w-[0.9em] overflow-visible align-[-0.12em]"
  >
    <g
      transform="translate(60 0) skewX(-14) translate(-60 0)"
      fill="none"
      stroke="currentColor"
      strokeWidth={15}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={BOW_HALF} />
      <path d={BOW_HALF} transform="translate(120 0) scale(-1 1)" />
    </g>
  </svg>
);

const Header = () => {
  const location = useLocation();
  const isResumePage = location.pathname === "/resume";
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Sujeeth"
            className="text-2xl font-bold text-foreground transition-colors duration-200 hover:text-highlight"
            style={{ fontFamily: "Kaushan Script, cursive" }}
          >
            {/* Zero-size "ee" keeps the text "Sujeeth" for copy/paste and crawlers. */}
            Suj<span className="inline-block h-0 w-0 overflow-hidden">ee</span>
            <LogoBow />
            th
          </Link>

          {isHome && <NavLinks />}

          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <SocialLinks />
            <Button
              className="ml-1 h-9 bg-highlight px-3 text-highlight-foreground hover:bg-highlight/90 sm:ml-2 sm:h-10 sm:px-4"
              asChild
            >
              <Link to={isResumePage ? "/" : "/resume"} aria-label={isResumePage ? "Portfolio" : "Resume"}>
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{isResumePage ? "Portfolio" : "Resume"}</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
