import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const sorted = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return new Response(
    JSON.stringify({
      posts: sorted.slice(0, 5).map((p) => ({
        title: p.data.title,
        description: p.data.description,
        date: p.data.date.toISOString(),
        tags: p.data.tags,
        slug: p.slug,
        url: `https://blogs.sujeeth.io/posts/${p.slug}`,
      })),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
};
