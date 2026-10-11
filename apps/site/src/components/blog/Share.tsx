'use client'

import { useState, useSyncExternalStore } from 'react'

const noop = () => () => {}

/** Icon buttons beside the post's date: the device's own share sheet where available, plus X, LinkedIn and copy link. */
export function Share({ url, title }: { url: string; title: string }) {
  // The share sheet only exists in some browsers; the static HTML renders without it.
  const canShare = useSyncExternalStore(noop, () => 'share' in navigator, () => false)
  const [copied, setCopied] = useState(false)

  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="share" role="group" aria-label="Share this article">
      {canShare && (
        <button type="button" className="btn btn-ghost" aria-label="Share" title="Share" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
        </button>
      )}
      <a className="btn btn-ghost" aria-label="Share on X" title="Share on X" href={`https://x.com/intent/post?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer">
        <svg className="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.1 14.45Z" />
        </svg>
      </a>
      <a className="btn btn-ghost" aria-label="Share on LinkedIn" title="Share on LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        <svg className="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-.95 1.84-1.96 3.79-1.96 4.05 0 4.8 2.53 4.8 5.83V21h-4v-5.13c0-1.22-.02-2.8-1.75-2.8-1.75 0-2.02 1.33-2.02 2.71V21H9.5V9.75Z" />
        </svg>
      </a>
      <button type="button" className="btn btn-ghost" onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'} title={copied ? 'Copied' : 'Copy link'}>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          {copied ? <path d="M5 12l5 5L20 7" /> : <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />}
        </svg>
      </button>
    </div>
  )
}
