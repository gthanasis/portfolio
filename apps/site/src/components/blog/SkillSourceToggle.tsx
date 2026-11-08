'use client'

import { useState } from 'react'

/** Show/hide a skill's SKILL.md (server-rendered into `children`), and offer it as a download or, for a skill with more files, on GitHub. */
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
  /** Top-level files and folders beside SKILL.md; non-empty means `href` is the skill's folder on GitHub. */
  extras: string[]
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const folder = extras.length > 0
  return (
    <>
      <div className="sk-actions">
        <button className="btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? 'Hide SKILL.md' : 'Show SKILL.md'}
        </button>
        {folder ? (
          <a className="btn btn-ghost" href={href} target="_blank" rel="noopener">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
            </svg>
            View on GitHub
          </a>
        ) : (
          <a className="btn btn-ghost" href={href} download={filename}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
            </svg>
            Download
          </a>
        )}
        <span className="sk-lines">
          {lines} lines{folder && ` · + ${extras.join(', ')}`}
        </span>
      </div>
      <div id={id} className="sk-source" hidden={!open}>
        {children}
      </div>
    </>
  )
}
