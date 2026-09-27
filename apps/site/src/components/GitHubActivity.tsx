import { getContributions } from '@/lib/github'
import { site } from '@/lib/site'
import { ContributionGraph } from './ContributionGraph'

export async function GitHubActivity() {
  const data = await getContributions(site.githubUser)
  return (
    <section className="sec" id="github" aria-labelledby="h-gh">
      <div className="sec-head">
        <h2 id="h-gh">
          On GitHub, <a href={site.github}>@{site.githubUser}</a>
        </h2>
      </div>
      {data ? (
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
      ) : (
        <p className="gh-err">
          See my activity on <a href={site.github}>GitHub</a>.
        </p>
      )}
    </section>
  )
}
