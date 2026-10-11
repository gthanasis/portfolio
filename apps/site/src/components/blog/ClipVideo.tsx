'use client'

import { useEffect, useRef } from 'react'

/**
 * Silent looping clip that downloads only when it nears the viewport and pauses when it leaves.
 * Serves `<name>.av1.mp4` where AV1 plays, else `<name>.mp4`; `<name>.poster.webp` shows until it starts.
 * With reduced motion it doesn't autoplay and shows controls instead.
 */
export function ClipVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const base = src.replace(/\.mp4$/, '')

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true
      return
    }
    let loaded = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            video.preload = 'auto'
            video.load()
            loaded = true
          }
          video.play().catch(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <video ref={ref} muted loop playsInline preload="none" poster={`${base}.poster.webp`} aria-label={label}>
      <source src={`${base}.av1.mp4`} type='video/mp4; codecs="av01.0.08M.08"' />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  )
}
