'use client'

import { useState } from 'react'

/** Show/hide a skill's SKILL.md (server-rendered into `children`) and offer the skill as a download. */
export function SkillSourceToggle({
  id,
  href,
  filename,
  lines,
  extras,
  children,
}: {
  id: string
  href: string
  filename: string
  lines: number
  /** Top-level files and folders the download adds beside SKILL.md; non-empty means it's a zip. */
  extras: string[]
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const zipped = extras.length > 0
  return (
    <>
      <div className="sk-actions">
        <button className="btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? 'Hide SKILL.md' : 'Show SKILL.md'}
        </button>
        <a className="btn btn-ghost" href={href} download={filename}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
          </svg>
          {zipped ? 'Download .zip' : 'Download'}
        </a>
        <span className="sk-lines">
          {lines} lines{zipped && ` · + ${extras.join(', ')}`}
        </span>
      </div>
      <div id={id} className="sk-source" hidden={!open}>
        {children}
      </div>
    </>
  )
}
