import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ClipVideo } from '@/components/blog/ClipVideo'
import { products, type Product } from '@/lib/products'

const sizes = '(max-width: 640px) 100vw, 504px'

/** Where the card goes, as its foot shows it: the site's domain, or "github" for a repo. */
function destination(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, '')
  return host === 'github.com' ? 'github' : host
}

function Visual({ v }: { v: Product['visual'] }) {
  if (v.kind === 'clip') return <ClipVideo src={v.src} label={v.label} />
  if (v.kind === 'shot') return <Image src={v.src} alt={v.alt} width={1200} height={675} sizes={sizes} />
  const bg = { '--frame-light': v.background.light, '--frame-dark': v.background.dark } as CSSProperties
  return (
    <div className="frame-bg" style={bg}>
      <Image className="only-dark" src={v.dark} alt={v.alt} width={1600} height={550} sizes={sizes} />
      <Image className="only-light" src={v.light} alt={v.alt} width={1600} height={550} sizes={sizes} />
    </div>
  )
}

export function Building() {
  return (
    <section className="sec" id="projects" aria-labelledby="h-proj">
      <div className="sec-head">
        <h2 id="h-proj">What I&apos;m building now.</h2>
        <p>Built with the same loop.</p>
      </div>
      <ul className="showcase">
        {products.map((p) => (
          <li key={p.name}>
            <div className="frame">
              <Visual v={p.visual} />
            </div>
            <div className="body">
              <h3>
                {/* The name's link covers the whole card. */}
                {p.url ? <a href={p.url}>{p.name}</a> : p.name}{' '}
                <span className={p.status === 'live' ? 'status live' : 'status'}>{p.status}</span>
              </h3>
              <p>{p.blurb}</p>
              <div className="meta">
                <span className="stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </span>
                {p.url ? (
                  <span className="to" aria-hidden="true">
                    {destination(p.url)}{' '}
                    <svg className="ext" viewBox="0 0 24 24">
                      <path d="M7 7h10v10M7 17 17 7" />
                    </svg>
                  </span>
                ) : (
                  <span>invite only</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
