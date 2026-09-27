export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
export type Contributions = { days: Day[]; total: number; perActiveDay: number; streak: number }

// Fetched at build time, so the numbers are in the HTML crawlers and
// no-JS visitors get, then again in the browser by GitHubLive.
export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { contributions: Day[]; total: { lastYear?: number } }
    const days = data.contributions
    const total = data.total.lastYear ?? days.reduce((a, d) => a + d.count, 0)
    const active = days.filter((d) => d.count > 0).length
    let streak = 0
    for (let k = days.length - 1; k >= 0 && days[k].count > 0; k--) streak++
    return { days, total, perActiveDay: active ? Math.round(total / active) : 0, streak }
  } catch {
    return null
  }
}
