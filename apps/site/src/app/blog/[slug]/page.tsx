import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbs, formatDate, getPost, getPostSlugs } from '@/lib/blog'
import { site } from '@/lib/site'
import { mdxComponents } from '@/components/blog/mdx'

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
    robots: post.draft ? { index: false, follow: false } : undefined,
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
      <header className="post-head">
        <Link href="/blog" className="back">
          ← Articles
        </Link>
        <h1>{post.title}</h1>
        <p className="lede">{post.summary}</p>
        <p className="meta">
          <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
          {post.draft && <span className="status live">draft</span>}
        </p>
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
    </article>
  )
}
