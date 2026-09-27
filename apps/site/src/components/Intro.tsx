import Image from 'next/image'
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
          <Image src={site.photo} alt="" width={48} height={48} priority />
          <div>
            <b>{site.name}</b>
            {site.role} at {site.employer.name} · Athens
          </div>
        </div>
        <h1>
          Reliable systems, built through <em>agentic coding</em>.
        </h1>
        <p>
          I run swarms of coding agents that write software <strong>my way</strong>: simple, reliable and tested.
          That&apos;s how I deliver production-grade software with AI, for my own products and for clients.
        </p>
        <div className="cta">
          <a className="btn btn-primary" href="#contact">
            Work with me
          </a>
          <a href={site.cv}>Read my CV</a>
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
        <figcaption className="loop-foot">Custom agent skill set coming soon</figcaption>
      </figure>
    </div>
  )
}
