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
  "/covers/horizon.jpg",
  "/covers/neural-ai.jpg",
  "/covers/network-mesh.jpg",
  "/covers/pipeline.jpg",
  "/covers/data-layers.jpg",
  "/covers/chatbot.jpg",
  "/covers/audio-wave.jpg",
  "/covers/messaging.jpg",
  "/covers/cloud-data.jpg",
];

const hashSlug = (slug: string) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
};

/**
 * Assign each post a cover from the pool: the pick is stable per slug, and a
 * bounded greedy probe keeps every cover in the rendered list unique. New
 * posts slot in deterministically and stay distinct (up to the pool size).
 */
const assignCovers = (posts: BlogPost[]): BlogPost[] => {
  const used = new Set<number>();
  return posts.map((p) => {
    let idx = hashSlug(p.slug) % COVER_POOL.length;
    for (let n = 0; n < COVER_POOL.length && used.has(idx); n++) {
      idx = (idx + 1) % COVER_POOL.length;
    }
    used.add(idx);
    return { ...p, coverImage: COVER_POOL[idx] };
  });
};

/**
 * Cover image for a homepage panel. `src` is always a local pool image (see
 * assignCovers), so it should never fail — but if one ever 404s we cycle to
 * the next pool image rather than ever falling back to a blank/black panel.
 * Greyscale at rest, full colour when its panel is in focus.
 */
const Cover = ({ src, active }: { src: string; active: boolean }) => {
  const start = Math.max(0, COVER_POOL.indexOf(src));
  const [step, setStep] = useState(0);
  const current = COVER_POOL[(start + step) % COVER_POOL.length];
  return (
    <img
      src={current}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setStep((s) => (s < COVER_POOL.length ? s + 1 : s))}
      className={`absolute inset-0 h-full w-full object-cover contrast-[1.05] transition-[transform,filter] duration-700 ease-out ${
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
      .then((res) => res.json())
      .then((data) =>
        setPosts(
          assignCovers(
            (data.posts?.slice(0, MAX_PANELS) ?? []).map((p: BlogPost) => ({
              ...p,
              url: `${BLOG_BASE}/posts/${p.slug}`,
            }))
          )
        )
      )
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

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

        {/* Expanding image accordion */}
        {loading ? (
          <div className="flex gap-2 sm:gap-3 h-[440px] md:h-[560px]">
            {[...Array(MAX_PANELS)].map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-xl md:rounded-2xl bg-muted animate-pulse"
                style={{ flexGrow: i === 0 ? 6 : 1, flexBasis: 0 }}
              />
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="flex gap-2 sm:gap-3 h-[440px] md:h-[560px]">
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
                    className={`group relative block h-full min-w-[44px] sm:min-w-[56px] cursor-pointer overflow-hidden rounded-xl md:rounded-2xl ring-1 transition-all duration-700 ease-in-out ${
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
                      className={`pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7 text-white transition-all duration-500 ${
                        isActive
                          ? "opacity-100 translate-y-0 delay-200"
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
