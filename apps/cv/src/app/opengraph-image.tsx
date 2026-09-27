import { ImageResponse } from 'next/og'
import { person } from '@/lib/cv'

export const dynamic = 'force-static'
export const alt = `${person.name}, CV`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: '#0b0c0e', color: '#eceef2', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 30, color: '#dcb45a', letterSpacing: 4 }}>CURRICULUM VITAE</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span style={{ fontSize: 96, letterSpacing: -3 }}>{person.name}</span>
          <span style={{ fontSize: 38, color: '#9097a3', marginTop: 20 }}>{`${person.role} at ${person.employer} · ${person.tagline}`}</span>
        </div>
        <div style={{ fontSize: 28, color: '#9097a3' }}>cv.gthanasis.com</div>
      </div>
    ),
    size,
  )
}
