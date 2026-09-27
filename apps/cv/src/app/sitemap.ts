import type { MetadataRoute } from 'next'
import { person } from '@/lib/cv'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${person.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
