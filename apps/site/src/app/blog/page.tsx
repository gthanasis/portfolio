import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbs, formatDate, getPosts } from '@/lib/blog'
import { site } from '@/lib/site'

const title = `Articles | ${site.name}`
const description =
  'Notes from Thanasis Gkliatis on agentic coding, Claude Code skills and shipping reliable software with coding agents.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/feed.xml' } },
  openGraph: { type: 'website', url: '/blog', siteName: site.name, locale: 'en_US', title, description },
  twitter: { card: 'summary_large_image', title, description },
}

export default async function BlogIndex() {
  const posts = await getPosts()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${site.url}/blog#blog`,
        url: `${site.url}/blog`,
        name: title,
        description,
        inLanguage: 'en',
        author: { '@id': `${site.url}/#person` },
        publisher: { '@id': `${site.url}/#person` },
        blogPost: posts
          .filter((p) => !p.draft)
          .map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${site.url}/blog/${p.slug}`, datePublished: p.date.toISOString() })),
      },
      breadcrumbs([
        ['Home', site.url],
        ['Articles', `${site.url}/blog`],
      ]),
    ],
  }
  return (
    <section className="blog-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="blog-head">
        <div>
          <h1>Articles</h1>
          <p>Notes on agentic coding, reliable systems and the software I build.</p>
        </div>
        <a className="btn btn-ghost" href="/blog/feed.xml">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          RSS
        </a>
      </header>
      {posts.length === 0 ? (
        <p className="empty">Nothing published yet.</p>
      ) : (
        <ol className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>
                <time dateTime={p.date.toISOString()}>{formatDate(p.date)}</time>
                <div>
                  <h2>
                    {p.title}
                    {p.draft && <span className="status live">draft</span>}
                  </h2>
                  <p>{p.summary}</p>
                  <span className="meta">
                    {p.readingMinutes} min read{p.tags.length > 0 && ` · ${p.tags.join(', ')}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
