import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { blogCard, ogSize } from '@/lib/og'
import { getPost, getPostSlugs } from '@/lib/blog'
import { site } from '@/lib/site'

export const alt = `Blog post by ${site.name}`
export const size = ogSize
export const contentType = 'image/png'

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }))
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  // A frontmatter `image` replaces the generated card: the picture, cropped from the top to fill 1200x630.
  if (post.cover?.src.startsWith('/')) {
    const file = await readFile(path.join(process.cwd(), 'public', post.cover.src))
    const type = post.cover.src.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const src = `data:${type};base64,${file.toString('base64')}`
    return new ImageResponse(<img src={src} alt="" width={ogSize.width} height={ogSize.height} style={{ objectFit: 'cover', objectPosition: 'top' }} />, ogSize)
  }
  return blogCard({ label: 'Articles', title: post.title, subtitle: post.summary })
}
