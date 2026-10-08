import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

// Link-preview card for blog pages, in the home page's preview style (src/app/opengraph-image.tsx).
// ImageResponse can't read CSS variables, so these are the dark theme's token values.
const ink = { bg: '#0b0c0e', fg: '#eceef2', muted: '#9097a3', gold: '#dcb45a' }

export const ogSize = { width: 1200, height: 630 }

export function blogCard({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  const titleSize = title.length > 60 ? 64 : title.length > 36 ? 76 : 88
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: ink.bg, color: ink.fg, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', fontSize: 30, color: ink.muted }}>
          <span>{site.name}</span>
          <span style={{ margin: '0 14px' }}>·</span>
          <span style={{ color: ink.gold }}>{label}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 34, color: ink.muted, lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div style={{ fontSize: 28, color: ink.muted }}>gthanasis.com/blog</div>
      </div>
    ),
    ogSize,
  )
}
