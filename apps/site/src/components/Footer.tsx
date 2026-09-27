import { ConsentSettingsLink } from '@gthanasis/ui/ConsentBanner'
import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer>
      <span>{site.name}, Athens</span>
      <nav aria-label="Profiles">
        <a href={site.cv}>CV</a>
        <a href={site.github} rel="me">
          GitHub
        </a>
        <a href={site.linkedin} rel="me">
          LinkedIn
        </a>
        <ConsentSettingsLink />
      </nav>
    </footer>
  )
}
