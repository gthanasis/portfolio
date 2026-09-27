import Link from 'next/link'
import { site } from '@/lib/site'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="bar">
      <Link className="name" href="/">
        {site.name}
      </Link>
      <nav aria-label="Main">
        <a href="#results">Results</a>
        <a href="#projects">Projects</a>
        <a href={site.cv}>CV</a>
        <a href="#contact">Contact</a>
      </nav>
      <ThemeToggle />
    </header>
  )
}
