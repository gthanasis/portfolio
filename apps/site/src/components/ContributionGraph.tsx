'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Day } from '@/lib/github'

const GAP = 3
const MIN_CELL = 9
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// Sunday-first weeks, padded so the first column starts on the right weekday.
function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = []
  let wk: (Day | null)[] = new Array(new Date(days[0].date).getDay()).fill(null)
  for (const d of days) {
    wk.push(d)
    if (wk.length === 7) {
      weeks.push(wk)
      wk = []
    }
  }
  if (wk.length) weeks.push(wk.concat(new Array(7 - wk.length).fill(null)))
  return weeks
}

export function ContributionGraph({ days }: { days: Day[] }) {
  const weeks = useMemo(() => toWeeks(days), [days])
  const ref = useRef<HTMLDivElement>(null)
  // Server render shows the whole year; the client narrows it to what fits.
  const [shown, setShown] = useState(weeks.length)
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => setShown(Math.max(12, Math.min(weeks.length, Math.floor((el.clientWidth + GAP) / (MIN_CELL + GAP)))))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [weeks.length])

  const visible = weeks.slice(-shown)
  const first = visible.flat().find(Boolean)

  return (
    <>
      <div
        ref={ref}
        className="gh-grid"
        style={{ '--weeks': visible.length } as React.CSSProperties}
        role="img"
        aria-label={`GitHub contributions from ${first ? fmt(first.date) : ''} to ${fmt(days[days.length - 1].date)}`}
        onPointerLeave={() => setTip(null)}
      >
        {visible.flat().map((d, i) =>
          d ? (
            <i
              key={d.date}
              data-l={d.level}
              onPointerEnter={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                const x = Math.min(Math.max(r.left + r.width / 2, 90), window.innerWidth - 90)
                setTip({ x, y: r.top, text: `${d.count ? `${d.count} contribution${d.count === 1 ? '' : 's'}` : 'No contributions'} on ${fmt(d.date)}` })
              }}
            />
          ) : (
            <i key={`pad-${i}`} style={{ visibility: 'hidden' }} />
          ),
        )}
      </div>
      <div className="gh-foot">
        <span>{first ? `${fmt(first.date)} to ${fmt(days[days.length - 1].date)}` : ''}</span>
        <span className="gh-legend" aria-hidden="true">
          less <i data-l="0" />
          <i data-l="1" />
          <i data-l="2" />
          <i data-l="3" />
          <i data-l="4" /> more
        </span>
      </div>
      {tip && (
        <div className="gh-tip" style={{ left: tip.x, top: tip.y, opacity: 1 }}>
          {tip.text}
        </div>
      )}
    </>
  )
}
