'use client'

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }
  return (
    <button className="theme" onClick={toggle} aria-label="Toggle light and dark theme">
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  )
}
