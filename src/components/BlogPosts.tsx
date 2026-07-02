import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Reveal from "./Reveal";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  url: string;
  coverImage?: string;
}

const BLOG_BASE = import.meta.env.DEV
  ? "http://localhost:4325"
  : "https://blogs.sujeeth.io";
const BLOG_API = `${BLOG_BASE}/api/latest.json`;

/** How many covers to show in the accordion. */
const MAX_PANELS = 6;

/**
 * Portfolio-local premium cover pool (served from this app's own /public).
 * Used ONLY in this homepage list — the live blog keeps its own covers and
 * these never touch post frontmatter. Drop a new file in /public/covers and
 * add it here to grow the pool.
 */
const COVER_POOL = [
  "/covers/horizon.webp",
  "/covers/neural-ai.webp",
  "/covers/network-mesh.webp",
  "/covers/pipeline.webp",
  "/covers/data-layers.webp",
  "/covers/chatbot.webp",
  "/covers/audio-wave.webp",
  "/covers/messaging.webp",
  "/covers/cloud-data.webp",
];

/**
 * Cover image for a homepage panel. Each panel gets a distinct pool image by
 * index (see the fetch below), so the visible list is always unique. If an
 * image ever 404s we show a neutral panel — never a duplicate or black tile.
 * Greyscale at rest, full colour when its panel is in focus.
 */
const Cover = ({ src, active }: { src: string; active: boolean }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="absolute inset-0 bg-muted" />;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover contrast-[1.05] transition-[transform,filter] duration-500 ease-out-expo ${
        active ? "grayscale-0 scale-[1.04]" : "grayscale scale-100"
      }`}
    />
  );
};

const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  const handleBlogClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      const url = new URL(e.currentTarget.href);
      url.searchParams.set("theme", theme);
      e.currentTarget.href = url.toString();
    },
    []
  );

  // First tap/click expands a slit; a click on the already-open panel opens it.
  const handlePanelClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      if (active !== index) {
        e.preventDefault();
        setActive(index);
        return;
      }
      handleBlogClick(e);
    },
    [active, handleBlogClick]
  );

  useEffect(() => {
    fetch(BLOG_API)
      .then((res) => {
        if (!res.ok) throw new Error(`Blog API responded with ${res.status}`);
        return res.json();
      })
      .then((data) =>
        setPosts(
          (data.posts?.slice(0, MAX_PANELS) ?? []).map(
            (p: BlogPost, i: number) => ({
              ...p,
              url: `${BLOG_BASE}/posts/${p.slug}`,
              coverImage: COVER_POOL[i % COVER_POOL.length],
            })
          )
        )
      )
      .catch((err) => {
        console.error("Failed to load blog posts:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest from the Blog
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Writing about AI, data engineering, and things I&apos;ve actually
            shipped
          </p>
        </Reveal>

        {/* Mobile: vertical cards · Desktop: expanding hover accordion */}
        {loading ? (
          <>
            <div className="grid gap-4 md:hidden">
              {[...Array(MAX_PANELS)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
            <div className="hidden md:flex gap-3 h-[560px]">
              {[...Array(MAX_PANELS)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-muted animate-pulse"
                  style={{ flexGrow: i === 0 ? 6 : 1, flexBasis: 0 }}
                />
              ))}
            </div>
          </>
        ) : posts.length === 0 ? null : (
          <>
            {/* Mobile: full-width cards — a tap opens the post (no hover/accordion) */}
            <div className="grid gap-4 md:hidden">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBlogClick}
                  className="relative block aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-border/60"
                >
                  <img
                    src={post.coverImage ?? COVER_POOL[0]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <time className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-white/55">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={tag} className="flex items-center gap-2">
                          {i > 0 && <span className="text-white/30">/</span>}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Desktop: expanding hover accordion */}
            <Reveal className="hidden md:block" delay={120}>
              <div className="flex gap-3 h-[560px]">
                {posts.map((post, index) => {
                  const isActive = active === index;
                  return (
                    <a
                      key={post.slug}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      draggable={false}
                      aria-expanded={isActive}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={(e) => handlePanelClick(e, index)}
                      style={{ flexGrow: isActive ? 6 : 1, flexBasis: 0 }}
                      className={`group relative block h-full min-w-[56px] cursor-pointer overflow-hidden rounded-2xl ring-1 [contain:layout_paint] transition-all duration-500 ease-out-expo ${
                        isActive ? "ring-foreground/30" : "ring-border/60"
                      }`}
                    >
                      <Cover
                        src={post.coverImage ?? COVER_POOL[0]}
                        active={isActive}
                      />

                      {/* Legibility gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Collapsed: vertical title in the slit */}
                      <span
                        className={`pointer-events-none absolute bottom-5 left-1/2 max-h-[80%] -translate-x-1/2 overflow-hidden whitespace-nowrap text-sm font-semibold tracking-wide text-white/90 transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180 ${
                          isActive ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        {post.title}
                      </span>

                      {/* Expanded: full detail */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7 text-white transition-all duration-400 ${
                          isActive
                            ? "opacity-100 translate-y-0 delay-100"
                            : "opacity-0 translate-y-3"
                        }`}
                      >
                        <time className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        <h3 className="mt-1.5 max-w-md text-xl md:text-2xl font-semibold leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-white/55">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={tag} className="flex items-center gap-2">
                              {i > 0 && <span className="text-white/30">/</span>}
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <a
              href={BLOG_BASE}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBlogClick}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Read All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;
