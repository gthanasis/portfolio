import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ClipVideo } from '@/components/blog/ClipVideo'
import { products, type Product } from '@/lib/products'

const others = products.filter((p) => !p.featured)

function Title({ p }: { p: Product }) {
  return (
    <h4>
      {p.url ? <a href={p.url}>{p.name}</a> : p.name}{' '}
      <span className={p.status === 'live' ? 'status live' : 'status'}>{p.status}</span>
    </h4>
  )
}

/** The picture at the top of a product card: both theme versions of an image (CSS shows one), or a clip. */
function Visual({ p }: { p: Product }) {
  const v = p.visual!
  if (v.kind === 'clip') return <ClipVideo src={v.src} label={v.label} />
  const bg = { '--frame-light': v.background.light, '--frame-dark': v.background.dark } as CSSProperties
  return (
    <div className="frame-bg" style={bg}>
      <Image className="only-dark" src={v.dark} alt={v.alt} width={1600} height={550} sizes="(max-width: 720px) 100vw, 508px" />
      <Image className="only-light" src={v.light} alt={v.alt} width={1600} height={550} sizes="(max-width: 720px) 100vw, 508px" />
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
      <article className="feature">
        <header className="feature-head">
          <Image className="feature-logo" src="/projects/born-to-party-icon.png" alt="" width={52} height={52} />
          <div className="feature-title">
            <h3>
              Born to Party <span className="status live">live</span>
            </h3>
            <p>Invitations worth opening. Sixty-seven designed themes, one link to send, and RSVPs that come back to you.</p>
          </div>
          <a className="btn feature-cta" href="https://borntoparty.app">
            Visit{' '}
            <svg className="ext" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h10v10M7 17 17 7" />
            </svg>
          </a>
        </header>
        <a className="shot" href="https://borntoparty.app" aria-label="Open borntoparty.app">
          <div className="chrome" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>borntoparty.app</span>
          </div>
          <Image
            src="/projects/born-to-party.jpg"
            alt="Born to Party homepage: send something worth opening, next to a Halloween party invitation"
            width={1200}
            height={560}
            sizes="(max-width: 1080px) 100vw, 1032px"
          />
        </a>
        <div className="feature-meta">
          <span>next.js</span>
          <span>node</span>
          <span>mongodb</span>
        </div>
      </article>
      <h3 className="products-head">Also building</h3>
      <ul className="products shots">
        {others
          .filter((p) => p.visual)
          .map((p) => (
            <li key={p.name}>
              {/* An image links to the project too; a clip doesn't, since it may show its own controls. */}
              {p.url && p.visual?.kind === 'image' ? (
                <a className="frame" href={p.url} tabIndex={-1} aria-hidden="true">
                  <Visual p={p} />
                </a>
              ) : (
                <div className="frame">
                  <Visual p={p} />
                </div>
              )}
              <div className="body">
                <Title p={p} />
                <p>{p.blurb}</p>
              </div>
            </li>
          ))}
      </ul>
      <ul className="products">
        {others
          .filter((p) => !p.visual)
          .map((p) => (
            <li key={p.name}>
              <Title p={p} />
              <p>{p.blurb}</p>
            </li>
          ))}
      </ul>
    </section>
  )
}
