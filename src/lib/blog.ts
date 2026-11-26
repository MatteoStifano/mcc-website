import { getCollection, type CollectionEntry } from 'astro:content';
import { GITHUB_REPO } from '../config';

export type Post = CollectionEntry<'blog'>;

export const CONTRIBUTING_POSTS = `${GITHUB_REPO}/blob/main/CONTRIBUTING.md#scrivere-un-articolo`;

// Published = not a draft and not dated in the future (relative to build time)
export async function getPublishedPosts(): Promise<Post[]> {
  const now = new Date();
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.date <= now);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// /blog/2026/11/file-name/ — dates are read in UTC so a date-only value never shifts
export function postSlug(post: Post): string {
  const year = post.data.date.getUTCFullYear();
  const month = String(post.data.date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}/${month}/${post.id}`;
}

export const postUrl = (post: Post) => `/blog/${postSlug(post)}/`;

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
