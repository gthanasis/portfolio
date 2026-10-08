import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import * as runtime from 'react/jsx-runtime'
import type { MDXContent } from 'mdx/types'
import { evaluate } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeExpressiveCode from 'rehype-expressive-code'
import { codeOptions, codeRenderer } from './code'

// Posts are MDX files in content/blog; the file name is the slug. A file starting with `_`
// (e.g. _style-guide.mdx) is reference-only: viewable in `next dev`, never built or listed.
// Everything is compiled at build time, so the export ships plain HTML.
const dir = path.join(process.cwd(), 'content/blog')

export type Heading = { id: string; text: string; depth: 2 | 3 }

export type PostMeta = {
  slug: string
  title: string
  summary: string
  /** Meta description for search results; falls back to the summary. */
  description: string
  date: Date
  updated?: Date
  tags: string[]
  draft: boolean
  /** Show the "On this page" box. Off for posts that carry their own navigation. */
  showToc: boolean
  readingMinutes: number
}

export type Post = PostMeta & { Content: MDXContent; toc: Heading[] }

// Drafts are listed in `next dev` only. The build still renders them as unlisted, noindex
// pages (reachable by URL for review), which also keeps the static export from failing
// on an empty /blog/[slug] before the first post is published.
const listDrafts = process.env.NODE_ENV !== 'production'
const isReference = (slug: string) => slug.startsWith('_')

export const getPost = cache(async (slug: string): Promise<Post> => {
  // Slugs come from the URL in dev, where unknown ones reach this function.
  if (!/^_?[a-z0-9-]+$/.test(slug)) notFound()
  if (isReference(slug) && !listDrafts) notFound()
  const source = await readFile(path.join(dir, `${slug}.mdx`), 'utf8').catch(() => notFound())
  const toc: Heading[] = []
  const { default: Content, frontmatter } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, [remarkSmartypants, { dashes: 'oldschool' }], remarkMath, remarkAlert],
    rehypePlugins: [
      // KaTeX first: display math arrives as a ```math code block and must not be highlighted as code.
      rehypeKatex,
      [rehypeExpressiveCode, { ...codeOptions, customCreateRenderer: () => codeRenderer() }],
      rehypeSlug,
      [rehypeCollectHeadings, toc],
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } }],
    ],
  }).catch((err: Error) => {
    throw new Error(`content/blog/${slug}.mdx: ${err.message}`, { cause: err })
  })
  return { ...parseMeta(slug, frontmatter, source), Content, toc }
})

export const getPostSlugs = cache(async () =>
  (await readdir(dir))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .filter((slug) => listDrafts || !isReference(slug)),
)

/** Posts for the index, sitemap and feed, newest first. */
export const getPosts = cache(async (): Promise<PostMeta[]> => {
  const posts = await Promise.all((await getPostSlugs()).filter((slug) => !isReference(slug)).map(getPost))
  return posts
    .filter((p) => listDrafts || !p.draft)
    .map((p): PostMeta => ({ slug: p.slug, title: p.title, summary: p.summary, description: p.description, date: p.date, updated: p.updated, tags: p.tags, draft: p.draft, showToc: p.showToc, readingMinutes: p.readingMinutes }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
})

function parseMeta(slug: string, fm: unknown, source: string): PostMeta {
  const m = (fm ?? {}) as Record<string, unknown>
  const need = (key: string) => {
    if (m[key] === undefined || m[key] === '') throw new Error(`content/blog/${slug}.mdx: frontmatter is missing "${key}"`)
    return m[key]
  }
  const words = source.replace(/^---[\s\S]*?---/, '').split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: String(need('title')),
    summary: String(need('summary')),
    description: m.description ? String(m.description) : String(need('summary')),
    date: new Date(need('date') as string),
    updated: m.updated ? new Date(m.updated as string) : undefined,
    tags: Array.isArray(m.tags) ? m.tags.map(String) : [],
    draft: m.draft === true,
    showToc: m.toc !== false,
    readingMinutes: Math.max(1, Math.round(words / 230)),
  }
}

type HastNode = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: HastNode[] }

// Collects h2/h3 (after rehype-slug has given them ids) for the table of contents.
function rehypeCollectHeadings(toc: Heading[]) {
  const text = (n: HastNode): string => n.value ?? (n.children ?? []).map(text).join('')
  return (tree: HastNode) => {
    const walk = (n: HastNode) => {
      if (n.type === 'element' && (n.tagName === 'h2' || n.tagName === 'h3') && n.properties?.id && n.properties.id !== 'footnote-label') {
        toc.push({ id: String(n.properties.id), text: text(n), depth: n.tagName === 'h2' ? 2 : 3 })
        return
      }
      n.children?.forEach(walk)
    }
    walk(tree)
  }
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** schema.org BreadcrumbList from [name, absolute url] pairs. */
export const breadcrumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
})
