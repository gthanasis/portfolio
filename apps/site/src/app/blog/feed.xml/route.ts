import { getPosts } from '@/lib/blog'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const posts = await getPosts()
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid>${site.url}/blog/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}: Articles</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes on agentic coding, reliable systems and the software I build.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
