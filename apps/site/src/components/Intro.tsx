import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'

type Step = { title: string; note: string; by: string; role: 'me' | 'setup' | 'build' | 'test' | 'qa' }

// The loop every change goes through: I scope and merge, specialised agents do the rest.
const steps: Step[] = [
  { title: 'Pick the issue', note: 'Scoped, labelled, with acceptance criteria.', by: 'me', role: 'me' },
  { title: 'Own worktree', note: 'Its own branch, URL and database. No agent steps on another.', by: 'setup agent', role: 'setup' },
  { title: 'Build to the rules', note: "The repo's design system, conventions and boundaries.", by: 'implementation agent', role: 'build' },
  { title: 'Regression test', note: 'Proves the bug, then proves the fix.', by: 'test agent', role: 'test' },
  { title: 'Check it in a real browser', note: 'Against the acceptance criteria, not just green tests.', by: 'QA agent', role: 'qa' },
  { title: 'Review and merge', note: 'CI green, diff read, shipped.', by: 'me', role: 'me' },
]

export function Intro() {
  return (
    <div className="intro">
      <div>
        <div className="who">
          <Image src={site.photo} alt={site.name} width={72} height={72} priority />
          <span>
            {site.role} at {site.employer.name}
          </span>
        </div>
        <h1>
          Hi, I&apos;m Thanasis. I build software with <em>swarms of coding agents</em>.
        </h1>
        <p>
          By day I&apos;m an engineer at {site.employer.name}. The rest of the time I ship my own products, run my own
          little cloud, and keep making my home a bit smarter.
        </p>
        <p>
          The agents write it <strong>my way</strong>: simple, reliable and tested. That&apos;s how I deliver
          production-grade software with AI, for my own products and for clients.
        </p>
        <div className="cta">
          <a className="btn btn-primary" href="#contact">
            Work with me
          </a>
          <a href={site.cv}>Read my CV</a>
          <span className="socials">
            <a href={site.github}>GitHub</a>
            <a href={site.linkedin}>LinkedIn</a>
          </span>
        </div>
      </div>

      <figure className="loop" aria-label="How a change ships">
        <div className="loop-head">
          <span>
            <b>How a change ships</b>
          </span>
        </div>
        <ol>
          {steps.map((s) => (
            <li key={s.title} className={s.role === 'me' ? 'me' : `a-${s.role}`}>
              <b>
                {s.title} <span className="who-does">{s.by}</span>
              </b>
              <span>{s.note}</span>
            </li>
          ))}
        </ol>
        <figcaption className="loop-foot">
          <Link href="/blog/claude-code-skills">The skills behind this loop →</Link>
        </figcaption>
      </figure>
    </div>
  )
}
