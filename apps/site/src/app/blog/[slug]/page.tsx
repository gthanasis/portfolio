import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbs, formatDate, getPost, getPostSlugs, getPosts, type PostMeta } from '@/lib/blog'
import { site } from '@/lib/site'
import { mdxComponents } from '@/components/blog/mdx'
import { Share } from '@/components/blog/Share'

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  const url = `/blog/${post.slug}`
  return {
    title: `${post.title} | ${site.name}`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url, types: { 'application/rss+xml': '/blog/feed.xml' } },
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      locale: 'en_US',
      title: post.title,
      description: post.description,
      publishedTime: post.date.toISOString(),
      modifiedTime: (post.updated ?? post.date).toISOString(),
      authors: [site.url],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    // Spelled out for published posts too: `undefined` here would drop the site's defaults, not inherit them.
    robots: post.draft
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  const { Content, toc } = post
  const url = `${site.url}/blog/${post.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        headline: post.title,
        description: post.description,
        image: `${url}/opengraph-image`,
        datePublished: post.date.toISOString(),
        dateModified: (post.updated ?? post.date).toISOString(),
        url,
        mainEntityOfPage: url,
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': `${site.url}/#person`, name: site.name, url: site.url },
        publisher: { '@id': `${site.url}/#person` },
        isPartOf: { '@id': `${site.url}/blog#blog` },
        keywords: post.tags,
      },
      breadcrumbs([
        ['Home', site.url],
        ['Articles', `${site.url}/blog`],
        [post.title, url],
      ]),
    ],
  }

  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="post-main">
        <header className="post-head">
          <Link href="/blog" className="back">
            ← Articles
          </Link>
          <h1>{post.title}</h1>
          <p className="lede">{post.summary}</p>
          <div className="meta-row">
            <p className="meta">
              <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
              <span>{post.readingMinutes} min read</span>
              {post.draft && <span className="status live">draft</span>}
            </p>
            <Share url={`${site.url}/blog/${post.slug}`} title={post.title} />
          </div>
        </header>

        {post.showToc && toc.length > 2 && (
          <nav className="toc" aria-label="On this page">
            <details open>
              <summary>
                <span>On this page</span>
                <span>{toc.filter((h) => h.depth === 2).length} sections</span>
              </summary>
              <ol>
                {toc.map((h) => (
                  <li key={h.id} data-depth={h.depth}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
        )}

        <div className="prose">
          <Content components={mdxComponents} />
        </div>
      </div>

      <MoreArticles current={post} posts={await getPosts()} />
    </article>
  )
}

/** Up to three other posts (most shared tags first, then newest): a right column on wide screens, cards below the post otherwise. */
function MoreArticles({ current, posts }: { current: PostMeta; posts: PostMeta[] }) {
  const shared = (p: PostMeta) => p.tags.filter((t) => current.tags.includes(t)).length
  const more = posts
    .filter((p) => p.slug !== current.slug && (!p.draft || current.draft))
    .sort((a, b) => shared(b) - shared(a) || b.date.getTime() - a.date.getTime())
    .slice(0, 3)
  if (!more.length) return null
  return (
    <aside className="more" aria-labelledby="more-h">
      <h2 id="more-h">More articles</h2>
      <ul>
        {more.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export serves images as files */}
              <img className="post-thumb" src={p.image?.src ?? `/blog/${p.slug}/opengraph-image`} alt={p.image?.alt ?? ''} loading="lazy" />
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <span className="meta">
                <time dateTime={p.date.toISOString()}>{formatDate(p.date)}</time> · {p.readingMinutes} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
