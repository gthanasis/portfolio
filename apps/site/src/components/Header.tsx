import Link from 'next/link'
import { Logo } from '@gthanasis/ui/Logo'
import { site } from '@/lib/site'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="bar">
      <Link className="name" href="/" aria-label={`${site.name}, home`}>
        <Logo className="logo" title={site.name} />
      </Link>
      <nav aria-label="Main">
        <Link href="/#results">Results</Link>
        <Link href="/#projects">Projects</Link>
        <a href={site.cv}>CV</a>
        <Link href="/#contact">Contact</Link>
        <span className="nav-sep" aria-hidden="true">
          |
        </span>
        <Link href="/blog">Articles</Link>
      </nav>
      <ThemeToggle />
    </header>
  )
}
