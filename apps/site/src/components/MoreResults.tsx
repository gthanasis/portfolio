'use client'

import { useState } from 'react'

export function MoreResults({ count, children }: { count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div id="more-results" hidden={!open}>
        {children}
      </div>
      <button
        className="btn more"
        aria-expanded={open}
        aria-controls="more-results"
        onClick={() => {
          setOpen(!open)
          if (open) document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        {open ? 'Show fewer' : `See ${count} more results`}
      </button>
    </>
  )
}
