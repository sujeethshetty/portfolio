# Blog & AI News Platform — Planning Document

> Portfolio: sujeeth.io
> Blog Subdomain: blogs.sujeeth.io
> Date: 2026-03-04

---

## Table of Contents

1. [Overview](#overview)
2. [Blog Platform (blogs.sujeeth.io)](#blog-platform)
3. [AI News Section](#ai-news-section)
4. [Infrastructure & Cost](#infrastructure--cost)
5. [Implementation Phases](#implementation-phases)
6. [Technical Architecture](#technical-architecture)

---

## Overview

Two new content features for the portfolio:

| Feature | Description | Hosting |
|---------|-------------|---------|
| **Blog Platform** | Medium-style blog for articles, news, and TILs — organized by content collections | `blogs.sujeeth.io` (separate Cloudflare Pages project) |
| **AI News Feed** | Automated daily AI news stored in blog platform, surfaced on both sites | `blogs.sujeeth.io` (cron writes to KV) + `sujeeth.io` (homepage fetches latest) |
| **Homepage Sync** | Portfolio homepage dynamically displays top 3-5 news and top 3-5 blog posts | `sujeeth.io` fetches from `blogs.sujeeth.io/api/latest.json` at runtime |

### Current Stack (for reference)

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Cloudflare Pages (hosting + edge functions)
- Supabase (PostgreSQL + Auth)
- TanStack React Query
- GitHub Actions CI/CD

---

## Blog Platform

### Approach: Astro + MDX on Cloudflare Pages

**Why Astro:**

- Static Site Generation (SSG) — critical for blog SEO (Google indexes static HTML, not SPAs)
- Ships zero JavaScript by default — fastest possible page loads
- Supports React components via Astro islands — reuse existing shadcn/ui components
- First-class MDX support — write in Markdown with embedded JSX
- Native Tailwind integration — same design system as the portfolio
- Built-in RSS feed, sitemap, and content collections
- Deploys to Cloudflare Pages with zero config

### Blog Features

#### Core (MVP)

- [ ] MDX-based articles with frontmatter (title, date, tags, description, cover image)
- [ ] Astro Content Collections for type-safe content management
- [ ] Medium-style typography using `@tailwindcss/typography` (`prose` classes)
- [ ] Tag-based filtering and categorization
- [ ] Reading time estimation
- [ ] Responsive design matching portfolio theme (dark/light mode)
- [ ] SEO meta tags, Open Graph, and Twitter Card support
- [ ] RSS feed (`/rss.xml`)
- [ ] Sitemap (`/sitemap.xml`)

#### Enhanced (Post-MVP)

- [ ] Full-text search (client-side with Pagefind or Fuse.js)
- [ ] Table of contents auto-generated from headings
- [ ] Code syntax highlighting with Shiki (built into Astro)
- [ ] Related posts suggestions
- [ ] Newsletter subscription (via Buttondown or Resend — both have free tiers)
- [ ] View count tracking (Cloudflare Analytics or Supabase)
- [ ] Comments (GitHub Discussions via Giscus — free)
- [ ] Web-based editor via Supabase + Tiptap (future phase)

### Blog Project Structure

```
blogs.sujeeth.io/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas (posts, news, til)
│   │   ├── posts/                 # Long-form blog articles
│   │   │   ├── my-first-post.mdx
│   │   │   └── another-post.mdx
│   │   ├── news/                  # AI/tech news & commentary
│   │   │   └── ai-news-2026-03.mdx
│   │   └── til/                   # Short "Today I Learned" posts
│   │       └── til-cloudflare-kv.mdx
│   ├── components/
│   │   ├── BlogCard.astro         # Post preview card
│   │   ├── NewsCard.astro         # News item card (compact)
│   │   ├── BlogLayout.astro       # Article page layout
│   │   ├── Header.astro           # Blog header/nav
│   │   ├── Footer.astro           # Blog footer
│   │   ├── TagList.astro          # Tag display/filter
│   │   ├── ReadingTime.astro      # Reading time indicator
│   │   ├── TableOfContents.astro  # Auto-generated TOC
│   │   └── ui/                    # Shared shadcn/ui React components
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML skeleton with meta tags
│   ├── pages/
│   │   ├── index.astro            # Blog home (all content listing)
│   │   ├── posts/
│   │   │   └── [slug].astro       # Individual blog post page
│   │   ├── news/
│   │   │   ├── index.astro        # News listing page
│   │   │   └── [slug].astro       # Individual news article
│   │   ├── til/
│   │   │   ├── index.astro        # TIL listing page
│   │   │   └── [slug].astro       # Individual TIL post
│   │   ├── tags/
│   │   │   └── [tag].astro        # Posts filtered by tag
│   │   ├── api/
│   │   │   └── latest.json.ts     # JSON API for homepage sync
│   │   ├── rss/
│   │   │   ├── posts.xml.ts       # RSS feed for blog posts
│   │   │   └── news.xml.ts        # RSS feed for news
│   │   └── rss.xml.ts             # Combined RSS feed
│   └── styles/
│       └── global.css             # Tailwind + custom blog styles
├── public/
│   └── images/                    # Blog post images
├── astro.config.mjs               # Astro configuration
├── tailwind.config.ts             # Tailwind config (shared theme)
├── tsconfig.json
└── package.json
```

### Content Schema (Astro Content Collections)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  updatedDate: z.date().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
  author: z.string().default('Sujeeth'),
});

const posts = defineCollection({
  type: 'content',
  schema: baseSchema,
});

const news = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    source: z.string().optional(),      // e.g., "TechCrunch", "The Verge"
    sourceUrl: z.string().url().optional(), // link to original article
  }),
});

const til = defineCollection({
  type: 'content',
  schema: baseSchema.omit({ coverImage: true }), // TILs are short, no cover needed
});

export const collections = { posts, news, til };
```

### JSON API Endpoint for Homepage Sync

The blog exposes a JSON endpoint that the portfolio homepage fetches at runtime to display the latest content. This keeps the homepage automatically in sync — no manual updates needed.

```typescript
// src/pages/api/latest.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [posts, news] = await Promise.all([
    getCollection('posts', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft),
  ]);

  const sortByDate = (a: any, b: any) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime();

  return new Response(
    JSON.stringify({
      posts: posts.sort(sortByDate).slice(0, 5).map((p) => ({
        title: p.data.title,
        description: p.data.description,
        date: p.data.date,
        tags: p.data.tags,
        slug: p.slug,
        url: `https://blogs.sujeeth.io/posts/${p.slug}`,
      })),
      news: news.sort(sortByDate).slice(0, 3).map((n) => ({
        title: n.data.title,
        description: n.data.description,
        date: n.data.date,
        tags: n.data.tags,
        slug: n.slug,
        source: n.data.source,
        url: `https://blogs.sujeeth.io/news/${n.slug}`,
      })),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://sujeeth.io',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
      },
    }
  );
};
```

> **Note:** Since Astro is SSG by default, this API route requires `output: 'hybrid'` or `output: 'server'` in `astro.config.mjs`, or the route can be prerendered at build time (regenerated on each deploy). For a fully dynamic endpoint on Cloudflare Pages, use `export const prerender = false;` at the top of the file.

### Blog Post Frontmatter Example

```mdx
---
title: "Building an AI-Powered Portfolio Chatbot"
description: "How I integrated GPT-4o-mini into my portfolio with rate limiting and conversation logging"
date: 2026-03-04
coverImage: "/images/chatbot-cover.jpg"
tags: ["ai", "openai", "cloudflare", "supabase"]
draft: false
---

Your article content here with full MDX support...

<CustomComponent prop="value" />
```

### Subdomain Setup (Cloudflare)

1. Create a new Cloudflare Pages project (e.g., `sujeeth-blog`)
2. In Cloudflare DNS for `sujeeth.io`:
   - Add CNAME record: `blogs` → `sujeeth-blog.pages.dev`
3. In Cloudflare Pages project settings:
   - Add custom domain: `blogs.sujeeth.io`
4. SSL/TLS is automatic

### Blog CI/CD

Separate GitHub repo or monorepo with separate workflow:

```yaml
# .github/workflows/deploy-blog.yml
name: Deploy Blog
on:
  push:
    branches: [main]
    paths: ['blog/**']  # if monorepo

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=sujeeth-blog
```

---

## AI News Section

### Approach: Cloudflare Cron Worker + KV Store + Tavily API

**Architecture:**

```
┌─────────────────────────────────────────────────────┐
│                   DAILY CRON (1x/day)               │
│                                                     │
│  Cloudflare Worker ──→ Tavily Search API            │
│       (cron trigger)     "latest AI news"           │
│            │                                        │
│            ▼                                        │
│     Cloudflare KV                                   │
│   (stores JSON news data)                           │
│            │                                        │
│            ▼                                        │
│  Pages Function: /api/news                          │
│   (reads from KV, serves to frontend)               │
│            │                                        │
│            ▼                                        │
│  React Component: <AINews />                        │
│   (displays cards on sujeeth.io)                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Why this architecture:**

- API is called exactly **once per day** (not per visitor)
- All visitors read from KV — instant response, zero API cost per visit
- KV reads are free up to 100K/day (more than enough)
- If Tavily API goes down, stale data still serves from KV
- No Supabase dependency — keeps infrastructure simple

### Tavily API Integration

**Why Tavily over alternatives:**

| Feature | Tavily | Exa | NewsAPI |
|---------|--------|-----|---------|
| Free tier | 1,000 req/month | 1,000 req/month | 100 req/day (dev only) |
| AI summaries | Yes (included) | No | No |
| Production use | Yes | Yes | Paid only |
| Result quality | High (AI-curated) | High (semantic) | Medium |
| Best for | News + summaries | Deep research | Raw headlines |

**Tavily Search Query:**

```typescript
const response = await fetch('https://api.tavily.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: env.TAVILY_API_KEY,
    query: 'latest artificial intelligence news today',
    search_depth: 'advanced',
    topic: 'news',
    days: 1,
    max_results: 10,
    include_answer: true,       // AI summary of top results
    include_raw_content: false, // save bandwidth
  }),
});
```

### Cloudflare Worker (Cron)

**File: `workers/news-cron/src/index.ts`**

```typescript
export interface Env {
  AI_NEWS_KV: KVNamespace;
  TAVILY_API_KEY: string;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;       // AI-generated summary
  published_date: string;
  score: number;
}

interface NewsData {
  articles: TavilyResult[];
  summary: string;       // overall AI summary
  fetchedAt: string;     // ISO timestamp
}

export default {
  // Cron trigger — runs once daily at 6:00 AM UTC
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.TAVILY_API_KEY,
        query: 'latest artificial intelligence news today',
        search_depth: 'advanced',
        topic: 'news',
        days: 1,
        max_results: 10,
        include_answer: true,
        include_raw_content: false,
      }),
    });

    const data = await response.json();

    const newsData: NewsData = {
      articles: data.results.map((r: TavilyResult) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        published_date: r.published_date,
        score: r.score,
      })),
      summary: data.answer,
      fetchedAt: new Date().toISOString(),
    };

    // Store in KV with 25-hour expiration (buffer beyond 24h cron)
    await env.AI_NEWS_KV.put(
      'latest-news',
      JSON.stringify(newsData),
      { expirationTtl: 90000 } // 25 hours in seconds
    );
  },
};
```

**Wrangler config: `workers/news-cron/wrangler.toml`**

```toml
name = "ai-news-cron"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 6 * * *"]  # Daily at 6:00 AM UTC

[[kv_namespaces]]
binding = "AI_NEWS_KV"
id = "<KV_NAMESPACE_ID>"

[vars]
# TAVILY_API_KEY set via `wrangler secret put TAVILY_API_KEY`
```

### Pages Function (API Endpoint)

**File: `functions/api/news.ts`**

```typescript
interface Env {
  AI_NEWS_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cached = await context.env.AI_NEWS_KV.get('latest-news');

  if (!cached) {
    return new Response(
      JSON.stringify({ articles: [], summary: '', fetchedAt: null }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800', // browser cache 30 min
        },
      }
    );
  }

  return new Response(cached, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
```

### Homepage Content Sync (sujeeth.io)

The portfolio homepage replaces static content sections with dynamically fetched latest posts and news from the blog platform.

**How it works:**
1. `blogs.sujeeth.io/api/latest.json` returns the top 5 posts and top 3 news items
2. The homepage fetches this endpoint at runtime via React Query
3. Content is displayed in two sections: "Latest News" and "Latest Posts"
4. "View All" links point users to the full listings on `blogs.sujeeth.io`

**React Hook: `src/hooks/useBlogContent.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  url: string;
}

interface NewsItem extends BlogPost {
  source?: string;
}

interface LatestContent {
  posts: BlogPost[];
  news: NewsItem[];
}

export function useBlogContent() {
  return useQuery<LatestContent>({
    queryKey: ['blog-latest'],
    queryFn: () =>
      fetch('https://blogs.sujeeth.io/api/latest.json').then((r) => r.json()),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
```

**Homepage Layout:**

```
┌─────────────────────────────────┐
│  Hero / About                   │
├────────────────┬────────────────┤
│  Latest News   │  Latest Posts  │
│  ┌──────────┐  │  ┌──────────┐  │
│  │ News 1   │  │  │ Post 1   │  │
│  │ News 2   │  │  │ Post 2   │  │
│  │ News 3   │  │  │ Post 3   │  │
│  └──────────┘  │  │ Post 4   │  │
│                │  │ Post 5   │  │
│                │  └──────────┘  │
│  → All News    │  → All Posts   │
├────────────────┴────────────────┤
│  Projects / Experience / etc    │
└─────────────────────────────────┘
```

- "All News" links to `blogs.sujeeth.io/news`
- "All Posts" links to `blogs.sujeeth.io/posts`
- Each card links to the full article on `blogs.sujeeth.io`
- Loading states use shadcn/ui Skeleton components
- Graceful fallback if fetch fails (hide section or show cached data)

### AI News Cron → Blog Content

The Cloudflare Cron Worker still fetches from Tavily daily, but instead of only storing in KV for the portfolio, the curated news items are also used as source material for the `news/` content collection in the blog. The flow:

```
Tavily API → Cron Worker → KV (raw data for immediate display)
                         → Can also seed MDX files for news/ collection (manual or automated)
```

**AI News Card Design (on homepage):**

```
┌──────────────────────────────┐
│  SOURCE DOMAIN      • 2h ago │
│                              │
│  Article Title Here          │
│  That Can Span Two Lines     │
│                              │
│  AI-generated summary of the │
│  article content that gives  │
│  readers a quick overview... │
│                              │
│  [AI]  [LLM]  [Research]    │
│                     Read →   │
└──────────────────────────────┘
```

### KV Namespace Setup

```bash
# Create the KV namespace
npx wrangler kv:namespace create "AI_NEWS_KV"

# Bind to Pages project (in Cloudflare Dashboard):
# Settings → Functions → KV namespace bindings
# Variable name: AI_NEWS_KV → Select the namespace
```

---

## Infrastructure & Cost

### Total Monthly Cost Breakdown

| Component | Service | Monthly Cost |
|-----------|---------|-------------|
| **Blog hosting** | Cloudflare Pages (free tier) | $0 |
| **Blog CDN/SSL** | Cloudflare (included) | $0 |
| **Blog domain** | `blogs.sujeeth.io` CNAME (included) | $0 |
| **News cron worker** | Cloudflare Workers (free: 100K req/day) | $0 |
| **News KV storage** | Cloudflare KV (free: 100K reads, 1K writes/day) | $0 |
| **News API** | Tavily (free: 1,000 req/month, using ~30) | $0 |
| **Image storage** | Cloudflare R2 (free: 10GB) or repo `/public` | $0 |
| **CI/CD** | GitHub Actions (free: 2,000 min/month) | $0 |
| **Total** | | **$0/month** |

### When Costs Start

| Trigger | Threshold | Cost |
|---------|-----------|------|
| High blog traffic | >100K req/day | Cloudflare Pages paid: $20/month |
| Heavy KV usage | >100K reads/day or >1GB stored | KV paid: $5/month |
| More Tavily calls | >1,000 req/month | Tavily paid: $40/month |
| Large image storage | >10GB on R2 | R2: $0.015/GB/month |
| Supabase (if added) | >500MB DB or 1GB storage | Supabase Pro: $25/month |

**Realistic projection:** $0/month for the foreseeable future. These free tiers are extremely generous for a personal portfolio + blog.

### Environment Variables / Secrets

```
# Cloudflare Worker (news cron)
TAVILY_API_KEY          # Tavily API key (set via wrangler secret)

# Cloudflare Pages (existing + new)
AI_NEWS_KV              # KV namespace binding (set in dashboard)
OPENAI_API_KEY          # Existing
SUPABASE_URL            # Existing
SUPABASE_SERVICE_ROLE_KEY  # Existing

# Blog (if separate project)
# No secrets needed for static MDX blog
```

---

## Implementation Phases

### Phase 1: AI News Section (1-2 days)

Priority: High — adds dynamic content to existing site immediately.

1. **Set up Cloudflare KV namespace**
   - Create via Wrangler CLI
   - Bind to existing Pages project

2. **Create Cron Worker** (`workers/news-cron/`)
   - Tavily API integration
   - KV write logic
   - Deploy with `wrangler deploy`

3. **Create Pages Function** (`functions/api/news.ts`)
   - KV read endpoint
   - Cache headers

4. **Build AINews component** (`src/components/AINews.tsx`)
   - News card grid with shadcn/ui Card, Badge, Skeleton
   - React Query integration
   - Responsive layout

5. **Add to Index.tsx**
   - Place between existing sections (e.g., after Projects, before Contact)

6. **Test & deploy**
   - Verify cron trigger in Cloudflare dashboard
   - Confirm KV data flow

### Phase 2: Blog Platform MVP (3-5 days)

Priority: Medium — separate project, can be developed in parallel.

1. **Initialize Astro project**
   - `npm create astro@latest` with blog template
   - Configure Tailwind with matching theme from portfolio
   - Set up content collections: `posts/`, `news/`, `til/`

2. **Design blog pages**
   - Home page (combined content listing with category tabs/filters)
   - `/posts` — blog post listing with cards
   - `/news` — news listing page
   - `/til` — TIL listing page
   - Individual article pages (Medium-style layout)
   - Tag filter page

3. **Create JSON API endpoint**
   - `/api/latest.json` — returns top 5 posts + top 3 news
   - CORS configured for `sujeeth.io`
   - Configure `output: 'hybrid'` in Astro for this dynamic route

4. **Write first 1-2 posts per collection**
   - Seed content for testing layout and typography

5. **Set up Cloudflare Pages deployment**
   - New project: `sujeeth-blog`
   - GitHub Actions workflow
   - Custom domain: `blogs.sujeeth.io`

6. **Cross-link portfolio ↔ blog**
   - Add "Blog" link to portfolio header
   - Add "Portfolio" link to blog header

### Phase 3: Homepage Integration (1-2 days)

Priority: High — ties the two sites together.

1. **Create `useBlogContent` hook** on portfolio
   - Fetches `blogs.sujeeth.io/api/latest.json`
   - React Query with 30-min stale time

2. **Build homepage content sections**
   - "Latest News" section (top 3 news items)
   - "Latest Posts" section (top 5 blog posts)
   - "View All" links to respective blog pages
   - Loading skeletons + error fallbacks

3. **Replace/reorganize existing homepage sections**
   - Insert news + posts sections (e.g., after Hero/About, before Projects)
   - Ensure responsive layout (stacked on mobile, side-by-side on desktop)

### Phase 4: Enhancements (Ongoing)

- Full-text search (Pagefind)
- Comments (Giscus)
- Newsletter subscription
- View count analytics
- Table of contents
- Related posts

---

## Technical Architecture Diagram

```
                    ┌─────────────────────────────┐
                    │       sujeeth.io             │
                    │     (Cloudflare Pages)        │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ React SPA (Vite)       │  │
                    │  │                        │  │
                    │  │ - Hero                 │  │
                    │  │ - About                │  │
                    │  │ - Latest News (top 3) ─────────┐  (runtime fetch)
                    │  │ - Latest Posts (top 5) ────────┤
                    │  │ - Projects             │  │    │
                    │  │ - Contact              │  │    │
                    │  │ - Chatbot              │  │    │
                    │  └────────────────────────┘  │    │
                    │                              │    │
                    │  /api/chat  → OpenAI         │    │
                    │  /api/news  → KV Read        │    │
                    └──────────────────────────────┘    │
                                │                       │
                    ┌───────────┴───────────┐           │
                    │                       │           │
          ┌─────────────────┐  ┌────────────────────┐   │
          │ Cloudflare KV   │  │ Supabase           │   │
          │                 │  │                    │   │
          │ latest-news     │  │ chat_sessions      │   │
          │ (JSON blob)     │  │ messages           │   │
          └────────▲────────┘  └────────────────────┘   │
                   │                                    │
          ┌────────┴────────┐                           │
          │ Cron Worker     │                           │
          │ (daily 6am UTC) │                           │
          │                 │                           │
          │ Tavily API call │                           │
          │ → parse results │                           │
          │ → write to KV   │                           │
          └─────────────────┘                           │
                                                        │
                    ┌───────────────────────────────┐    │
                    │     blogs.sujeeth.io           │    │
                    │    (Cloudflare Pages)           │    │
                    │                               │    │
                    │  ┌─────────────────────────┐  │    │
                    │  │ Astro SSG/Hybrid        │  │    │
                    │  │                         │  │    │
                    │  │ Content Collections:    │  │    │
                    │  │ - posts/  (articles)    │  │    │
                    │  │ - news/   (AI news)     │  │    │
                    │  │ - til/    (quick tips)  │  │    │
                    │  │                         │  │    │
                    │  │ Pages:                  │  │    │
                    │  │ - /posts   (listing)    │  │    │
                    │  │ - /news    (listing)    │  │    │
                    │  │ - /til     (listing)    │  │    │
                    │  │ - /tags    (filtering)  │  │    │
                    │  │ - /rss     (feeds)      │  │    │
                    │  │ - /sitemap              │  │    │
                    │  └─────────────────────────┘  │    │
                    │                               │    │
                    │  /api/latest.json ◄────────────────┘
                    │  (returns top posts + news     │
                    │   for homepage consumption)    │
                    │                               │
                    │  Content: MDX files            │
                    │  (committed to repo)           │
                    └───────────────────────────────┘
```

---

## Open Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Blog repo structure | Separate repo vs. monorepo | **Separate repo** — cleaner deploys, independent CI/CD |
| Tavily query frequency | 1x/day vs. 2x/day | **1x/day** at 6 AM UTC — sufficient for news freshness |
| News display on homepage | 3 vs. 5 items | **3 news items** — concise, drives clicks to blog |
| Posts display on homepage | 3 vs. 5 items | **5 posts** — enough to show breadth of content |
| Astro output mode | SSG vs. hybrid | **Hybrid** — SSG for content pages, server for `/api/latest.json` |
| Blog comments | Giscus vs. none | **Giscus** in Phase 4 — free, GitHub-based |
| Newsletter | Buttondown vs. Resend | **Buttondown** — generous free tier (100 subscribers) |
| Blog search | Pagefind vs. Fuse.js | **Pagefind** — built for static sites, zero config with Astro |
| News subdomain | `news.sujeeth.io` vs. category under blog | **Category under blog** — all content under one domain for SEO, less maintenance |
