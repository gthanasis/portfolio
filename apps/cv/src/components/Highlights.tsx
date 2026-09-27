'use client'

import { useEffect } from 'react'

// Sweeps the marker across each job's metrics as it scrolls into view.
// Before printing, everything is lit so the PDF never misses a highlight.
export function Highlights() {
  useEffect(() => {
    const jobs = document.querySelectorAll<HTMLElement>('.job')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.querySelectorAll<HTMLElement>('b').forEach((b, i) => (b.style.transitionDelay = `${250 + i * 220}ms`))
          e.target.classList.add('lit')
          io.unobserve(e.target)
        }),
      { threshold: 0.5 },
    )
    jobs.forEach((j) => io.observe(j))
    const lightAll = () => jobs.forEach((j) => j.classList.add('lit'))
    window.addEventListener('beforeprint', lightAll)
    return () => {
      io.disconnect()
      window.removeEventListener('beforeprint', lightAll)
    }
  }, [])
  return null
}
