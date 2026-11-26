// Schemas for everything contributors add by pull request. A file that doesn't
// match fails the build with a message naming the file and the field.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Plain text, or { it, en } when the text should change with the page language
const localized = z.union([z.string(), z.strictObject({ it: z.string(), en: z.string() })]);

// ISO 8601 with an explicit offset, e.g. 2026-12-12T18:30:00+01:00
const dateTime = z.iso.datetime({ offset: true });

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1).max(300),
    date: z.coerce.date(),
    author: z.string().min(1),
    github: z.string().regex(/^[A-Za-z0-9-]+$/, 'GitHub username only, without @ or URL').optional(),
    tags: z.array(z.string()).default([]),
    language: z.enum(['it', 'en']).default('it'),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  // Contributors don't write ids: each event is identified by its start time
  loader: file('src/data/events.json', {
    parser: (text) => JSON.parse(text).map((event: Record<string, unknown>) => ({ id: event.date, ...event })),
  }),
  schema: z.strictObject({
    id: z.string(),
    date: dateTime,
    end: dateTime.optional(),
    title: localized,
    description: localized.optional(),
    speaker: z.string().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    signupUrl: z.url().optional(),
  }),
});

const workshops = defineCollection({
  loader: file('src/data/workshops.json'),
  schema: z.strictObject({
    id: z.string(),
    title: localized,
    alt: z.string(),
    image: z.string().startsWith('/workshops/'),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
});

export const collections = { blog, events, workshops };
