/**
 * Definisi content collection artikel (SPEC §6).
 *
 * Lokasi file ini WAJIB di `src/` (bukan `src/content/config.ts` yang sudah
 * deprecated sejak Astro 5). Jalankan `npx astro sync` setiap kali skema
 * diubah agar tipe `CollectionEntry<'blog'>` ikut ter-generate.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // WAJIB coerce: tanggal di frontmatter adalah string, `z.date()` akan
    // menggagalkan build.
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    author: z.string().default('Haitham Tech'),
  }),
});

export const collections = { blog };
