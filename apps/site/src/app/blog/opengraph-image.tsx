import { blogCard, ogSize } from '@/lib/og'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const alt = `Articles by ${site.name}`
export const size = ogSize
export const contentType = 'image/png'

export default function OpengraphImage() {
  return blogCard({ label: 'Articles', title: 'Notes on agentic coding and reliable software' })
}
