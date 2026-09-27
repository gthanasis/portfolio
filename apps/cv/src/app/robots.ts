import type { MetadataRoute } from 'next'
import { person } from '@/lib/cv'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${person.url}/sitemap.xml`, host: person.url }
}
