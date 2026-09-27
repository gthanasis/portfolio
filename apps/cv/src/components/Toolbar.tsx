'use client'

import { useEffect, useRef, useState } from 'react'
import { person } from '@/lib/cv'

type Cmd = { label: string; run: () => void }

// Page-level side effects, kept outside the component on purpose.
function toggleTheme() {
  const root = document.documentElement
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  const next = dark ? 'light' : 'dark'
  root.dataset.theme = next
  try {
    localStorage.setItem('theme', next)
  } catch {}
}
function openUrl(url: string) {
  window.location.assign(url)
}

export function Toolbar() {
  const [toast, setToast] = useState('')
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1600)
  }
  const copyEmail = () => navigator.clipboard?.writeText(person.email).then(() => flash(`Copied ${person.email}`))
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const cmds: Cmd[] = [
    { label: 'Summary', run: () => go('summary') },
    { label: 'Experience', run: () => go('experience') },
    { label: 'Independent work', run: () => go('independent') },
    { label: 'Skills', run: () => go('skills') },
    { label: 'Education', run: () => go('education') },
    { label: 'Download PDF', run: () => window.print() },
    { label: 'Copy email', run: copyEmail },
    { label: 'Toggle theme', run: toggleTheme },
    { label: 'Open gthanasis.com', run: () => openUrl(person.web) },
  ]
  const shown = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))

  const openPalette = () => {
    setQ('')
    setSel(0)
    setOpen(true)
  }
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const run = (i: number) => {
    const c = shown[i]
    if (!c) return
    setOpen(false)
    c.run()
  }

  return (
    <>
      <div className="tools">
        <div className="inner">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            PDF
          </button>
          <button className="btn btn-ghost" onClick={copyEmail} aria-label="Copy email address">
            <span className="long">Copy email</span>
            <span className="short">Email</span>
          </button>
          <a className="btn btn-ghost" href={person.web}>
            <span className="long">gthanasis.com</span>
            <span className="short">Site</span>
          </a>
          <button className="btn btn-ghost cmdk" onClick={openPalette} aria-label="Open command menu">
            <span className="kbd">⌘K</span>
          </button>
          <button className="btn btn-ghost" onClick={toggleTheme} aria-label="Toggle light and dark theme" style={{ padding: '0 .7rem' }}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </div>
      </div>

      <dialog ref={dialog} aria-label="Command menu" onClose={() => setOpen(false)} onClick={(e) => e.target === dialog.current && setOpen(false)}>
        <input
          autoFocus
          placeholder="Jump to..."
          aria-label="Search commands"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setSel(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setSel((s) => (s + 1) % Math.max(shown.length, 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setSel((s) => (s - 1 + shown.length) % Math.max(shown.length, 1))
            }
            if (e.key === 'Enter') run(sel)
          }}
        />
        <ul role="listbox" aria-label="Commands">
          {shown.map((c, i) => (
            <li key={c.label} role="option" aria-selected={i === sel} onClick={() => run(i)} onMouseEnter={() => setSel(i)}>
              {c.label}
            </li>
          ))}
        </ul>
      </dialog>

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}
