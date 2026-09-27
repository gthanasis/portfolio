import { getContributions } from '@/lib/github'
import { site } from '@/lib/site'
import { GitHubLive } from './GitHubLive'

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
        <GitHubLive initial={data} user={site.githubUser} />
      ) : (
        <p className="gh-err">
          See my activity on <a href={site.github}>GitHub</a>.
        </p>
      )}
    </section>
  )
}
