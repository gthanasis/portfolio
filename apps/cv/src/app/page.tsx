import { Toolbar } from '@/components/Toolbar'
import { Highlights } from '@/components/Highlights'
import { Rich } from '@/components/Rich'
import { ConsentSettingsLink } from '@gthanasis/ui/ConsentBanner'
import { person, summary, jobs, projects, skills, education, talks } from '@/lib/cv'

const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '')

export default function CV() {
  return (
    <>
      <Toolbar />
      <Highlights />
      <article className="paper">
        <header className="head">
          <div>
            <h1>
              {person.first} <em>{person.last}</em>
            </h1>
            <p className="position">
              {person.role} at {person.employer} <span>· {person.tagline}</span>
            </p>
          </div>
          <ul className="contact mono">
            <li>
              <span className="k">email</span>
              <a href={`mailto:${person.email}`}>{person.email}</a>
            </li>
            <li>
              <span className="k">web</span>
              <a href={person.web}>{host(person.web)}</a>
            </li>
            <li>
              <span className="k">github</span>
              <a href={person.github} rel="me">
                {host(person.github).replace('github.com/', '')}
              </a>
            </li>
            <li>
              <span className="k">linkedin</span>
              <a href={person.linkedin} rel="me">
                {person.linkedin.split('/in/')[1]}
              </a>
            </li>
            <li>
              <span className="k">based</span>
              {person.location}
            </li>
          </ul>
        </header>

        <div className="cols">
          <main>
            <section id="summary">
              <h2>Summary</h2>
              <p className="summary">{summary}</p>
            </section>

            <section id="experience">
              <h2>Experience</h2>
              <div className="jobs">
                {jobs.map((j) => (
                  <div key={`${j.org}-${j.title}`} className={`job${j.current ? ' now' : ''}`}>
                    <div className="top">
                      <h3>
                        {j.title} <span className="org">· {j.org}</span>
                      </h3>
                      <span className="when">
                        {j.from} - {j.to}
                      </span>
                    </div>
                    <ul>
                      {j.bullets.map((b) => (
                        <li key={b}>
                          <Rich text={b} />
                        </li>
                      ))}
                    </ul>
                    {j.stack && <div className="stack">{j.stack}</div>}
                  </div>
                ))}
              </div>
            </section>

            <section id="independent">
              <h2>Independent work</h2>
              <div className="projects">
                {projects.map((p) => (
                  <div key={p.name} className="proj">
                    <h3>{p.name}</h3>
                    {p.link ? <a href={p.link.href}>{p.link.label}</a> : <span />}
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside>
            <section id="skills">
              <h2>Skills</h2>
              {skills.map((s) => (
                <div key={s.area} className="skill">
                  <b>{s.area}</b>
                  <span>{s.items}</span>
                </div>
              ))}
            </section>
            <section id="education">
              <h2>Education</h2>
              <div className="side-item">
                <b>{education.degree}</b>
                <span>{education.school}</span>
                <span>{education.detail}</span>
              </div>
            </section>
            <section id="talks">
              <h2>Talks</h2>
              {talks.map((t) => (
                <div key={t.title} className="side-item">
                  <a href={t.href}>
                    <b>{t.title}</b>
                    <span>{t.where} ↗</span>
                  </a>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </article>
      <p className="tool-note mono">
        Prints to a clean A4 PDF. <ConsentSettingsLink />
      </p>
    </>
  )
}
