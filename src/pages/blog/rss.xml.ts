import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postUrl } from '../../lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'MCC Blog',
    description: 'Articoli, guide e appunti scritti dai membri del Monopoli Coders Club.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      author: post.data.author,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>it-it</language>',
  });
}
