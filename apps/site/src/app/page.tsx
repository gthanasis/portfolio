import { Header } from '@/components/Header'
import { Intro } from '@/components/Intro'
import { GitHubActivity } from '@/components/GitHubActivity'
import { Results } from '@/components/Results'
import { Building } from '@/components/Building'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="wrap">
      <Header />
      <main>
        <Intro />
        <GitHubActivity />
        <Results />
        <Building />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
