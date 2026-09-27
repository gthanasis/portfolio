'use client'

import { useEffect, useState } from 'react'
import { getContributions, type Contributions } from '@/lib/github'
import { ContributionGraph } from './ContributionGraph'

const REFRESH_MS = 30 * 60 * 1000

// Starts from the numbers baked in at build time, so crawlers and first paint
// get real data, then refreshes in the browser: on load and every 30 minutes
// while the tab is visible.
export function GitHubLive({ initial, user }: { initial: Contributions; user: string }) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    let alive = true
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return
      const fresh = await getContributions(user)
      if (alive && fresh) setData(fresh)
    }
    refresh()
    const t = setInterval(refresh, REFRESH_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      alive = false
      clearInterval(t)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [user])

  return (
    <div className="gh">
      <dl className="gh-stats">
        <div>
          <dt className="sr-only">Contributions</dt>
          <dd>
            <b>{data.total.toLocaleString('en')}</b>
            <span>contributions, past 12 months</span>
          </dd>
        </div>
        <div>
          <dt className="sr-only">Average</dt>
          <dd>
            <b>{data.perActiveDay}</b>
            <span>per active day</span>
          </dd>
        </div>
        <div>
          <dt className="sr-only">Streak</dt>
          <dd>
            <b>
              {data.streak} {data.streak === 1 ? 'day' : 'days'}
            </b>
            <span>current streak</span>
          </dd>
        </div>
      </dl>
      <ContributionGraph days={data.days} />
    </div>
  )
}
