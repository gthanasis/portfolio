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
  return blogCard({ label: 'Articles', title: post.title, subtitle: post.summary })
}
