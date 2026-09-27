'use client'

import { useEffect, useRef, useState } from 'react'

// Adds `in` the first time the element scrolls into view; the CSS animates from there.
export function Reveal({ className, style, children }: { className: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${className}${seen ? ' in' : ''}`} style={style}>
      {children}
    </div>
  )
}
