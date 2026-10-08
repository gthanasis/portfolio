import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { getPosts } from '@/lib/blog'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/blog`, lastModified: posts[0]?.date ?? new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updated ?? p.date, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
