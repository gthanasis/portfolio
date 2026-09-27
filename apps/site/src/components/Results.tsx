import { Reveal } from './Reveal'
import { MoreResults } from './MoreResults'
import { SyncFlowLazy } from './SyncFlowLazy'

type Result = {
  big: string
  title: string
  body: string
  where: string
  chart: 1 | 2 | 3 | 4 | 5
  viz: React.ReactNode
}

function People() {
  return (
    <div className="viz">
      <div className="cap">
        <span>engineers using it, of every 10</span>
        <span>8 / 10</span>
      </div>
      <div className="people">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} className={i < 8 ? 'on' : undefined} style={{ transitionDelay: `${i * 90}ms` }} />
        ))}
      </div>
    </div>
  )
}

function OneBar() {
  return (
    <div className="viz">
      <div className="cap">
        <span>job seekers with 2+ interests</span>
      </div>
      <div className="one" role="img" aria-label="From 35% before to 60% after">
        <div className="one-track">
          <i className="one-before" />
          <i className="one-gain" />
        </div>
        <div className="one-marks">
          <span style={{ left: '35%' }}>
            35%<small>before</small>
          </span>
          <span className="now" style={{ left: '60%' }}>
            60%<small>after</small>
          </span>
        </div>
      </div>
    </div>
  )
}

// Six weeks of deploys: one every 1.5 weeks before, five a week after.
const before = [0.2, 1.7, 3.2, 4.7]
const after = Array.from({ length: 30 }, (_, i) => 0.1 + Math.floor(i / 5) + (i % 5) * 0.18)
function Ticks() {
  const lane = (times: number[]) =>
    times.map((t, i) => <i key={i} style={{ left: `${(t / 6) * 100}%`, transitionDelay: `${i * 30}ms` }} />)
  return (
    <div className="viz">
      <div className="cap">
        <span>deploys over six weeks</span>
      </div>
      <div className="ticks">
        <div className="row">
          <span className="l">before</span>
          <div className="lane">{lane(before)}</div>
        </div>
        <div className="row after">
          <span className="l">after</span>
          <div className="lane">{lane(after)}</div>
        </div>
        <div className="axis">
          <span>week</span>
          {[1, 2, 3, 4, 5, 6].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Savings() {
  return (
    <div className="viz">
      <div className="cap">
        <span>analytics pipeline</span>
      </div>
      <div className="swap">
        <div className="old">Druid cluster</div>
        <span className="arr">→</span>
        <div className="new">
          <div>Kafka Connect</div>
          <div>Iceberg</div>
          <div>batch jobs</div>
        </div>
      </div>
      <div className="year" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ transitionDelay: `${i * 70}ms` }} />
        ))}
      </div>
      <div className="year-cap">
        <span>$5k each month</span>
        <span>$60k a year</span>
      </div>
    </div>
  )
}

function Sync() {
  return (
    <div className="viz">
      <div className="cap">
        <span>the sync, simplified</span>
        <span>3M+ profiles</span>
      </div>
      <SyncFlowLazy />
    </div>
  )
}

const results: Result[] = [
  {
    big: '80%', title: 'of engineers on AI-assisted development', where: 'Kariera Group · 2025', chart: 1, viz: <People />,
    body: 'I led the rollout of LLM-assisted development across engineering, with guardrails and shared practices for how to use it well.',
  },
  {
    big: '35% → 60%', title: 'More job seekers telling us what they want', where: 'Kariera Group · 2025', chart: 2, viz: <OneBar />,
    body: 'I shipped semantic search and recommendations built on OpenAI embeddings. Afterwards, the share of job seekers with two or more interests on their profile went from 35% to 60%.',
  },
  {
    big: '3M+ profiles', title: 'Kept in sync in near real time', where: 'Kariera Group · 2024', chart: 3, viz: <Sync />,
    body: 'I designed fault-tolerant ingestion and sync for more than 3 million candidate profiles, streaming changes from external sources through Kafka into PostgreSQL and Elasticsearch.',
  },
  {
    big: 'Decreased release cycle', title: 'From one deploy every 1.5 weeks to five a week', where: 'Kariera Group · 2024', chart: 4, viz: <Ticks />,
    body: 'I led the move from a monolithic job board to event-driven microservices on NestJS, Kafka, PostgreSQL and Elasticsearch. Smaller pieces, shipped far more often.',
  },
  {
    big: '$5k a month', title: 'Lower infrastructure costs', where: 'Kariera Group · 2025', chart: 5, viz: <Savings />,
    body: 'I replaced a self-hosted Druid cluster with a simpler setup built on Kafka Connect, Iceberg and batch jobs. That cut self-hosting costs by $5k every month.',
  },
]

function ResultRow({ r }: { r: Result }) {
  return (
    <Reveal className="result" style={{ '--c': `var(--chart-${r.chart})` } as React.CSSProperties}>
      <div>
        <div className="big">{r.big}</div>
        <h3>{r.title}</h3>
        <p>{r.body}</p>
        <span className="where">{r.where}</span>
      </div>
      {r.viz}
    </Reveal>
  )
}

const SHOWN = 3

export function Results() {
  return (
    <section className="sec" id="results" aria-labelledby="h-res">
      <div className="sec-head">
        <h2 id="h-res">Numbers from production.</h2>
        <p>Measured at Kariera Group, a multinational HR-tech platform.</p>
      </div>
      {results.slice(0, SHOWN).map((r) => (
        <ResultRow key={r.big} r={r} />
      ))}
      <MoreResults count={results.length - SHOWN}>
        {results.slice(SHOWN).map((r) => (
          <ResultRow key={r.big} r={r} />
        ))}
      </MoreResults>
    </section>
  )
}
