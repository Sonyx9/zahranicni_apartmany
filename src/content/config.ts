import { defineCollection, z } from 'astro:content';

const destinations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    countrySlug: z.string(),
    summary: z.string().min(50).max(220),
    heroImage: z.string().optional(),
    faq: z.array(
      z.object({
        q: z.string().min(5),
        a: z.string().min(20),
      })
    ).min(4).max(10),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(200),
    published: z.date(),
    topic: z.string(),
  }),
});

export const collections = { destinations, guides };

