import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import BlogPosts from "@/components/BlogPosts";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Chatbot = lazy(() => import("@/components/Chatbot"));

const Index = () => {
  const { hash } = useLocation();

  // Direct links like sujeeth.io/#projects: the browser's own anchor jump fires
  // before React mounts the sections, so scroll once they exist.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  // Easter egg for anyone who opens DevTools.
  useEffect(() => {
    console.log(
      "%cHey, you opened the console.",
      "font: 600 14px system-ui",
      "\nTry poking the little Fermix mascots in the hero. Or just say hi: hello@sujeeth.io",
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Projects />
      <BlogPosts />
      <About />
      <Contact />
      <Footer />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
};

export default Index;
