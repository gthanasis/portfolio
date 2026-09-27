import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const alt = site.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The link preview: dark page, gold accent, the one line that says what I do.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: '#0b0c0e', color: '#eceef2', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 30, color: '#9097a3' }}>{`${site.name} · ${site.role} at ${site.employer.name}`}</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
          <span>Reliable systems, built through</span>
          <span style={{ color: '#dcb45a' }}>agentic coding.</span>
        </div>
        <div style={{ fontSize: 28, color: '#9097a3' }}>gthanasis.com</div>
      </div>
    ),
    size,
  )
}
