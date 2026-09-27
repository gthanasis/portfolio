import Image from 'next/image'

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
    </section>
  )
}
