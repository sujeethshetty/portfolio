import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  url: string;
}

const BLOG_BASE = import.meta.env.DEV
  ? "http://localhost:4325"
  : "https://blogs.sujeeth.io";
const BLOG_API = `${BLOG_BASE}/api/latest.json`;

const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBlogClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      const url = new URL(e.currentTarget.href);
      url.searchParams.set("theme", theme);
      e.currentTarget.href = url.toString();
    },
    []
  );

  useEffect(() => {
    fetch(BLOG_API)
      .then((res) => res.json())
      .then((data) =>
        setPosts(
          (data.posts?.slice(0, 4) ?? []).map((p: BlogPost) => ({
            ...p,
            url: `${BLOG_BASE}/posts/${p.slug}`,
          }))
        )
      )
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from the Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Writing about AI, data engineering, and things I've actually shipped
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-border/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                onClick={handleBlogClick}
              >
                <Card className="h-full border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-highlight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <time className="text-xs text-muted-foreground">
                        {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h3 className="text-lg font-semibold mt-1 mb-2 group-hover:text-highlight transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
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
