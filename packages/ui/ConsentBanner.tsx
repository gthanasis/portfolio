'use client'

import { useEffect, useState } from 'react'
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from './analytics'

// A terminal prompt instead of a cookie wall. Declining is exactly as easy as
// accepting: same size, same row, and the same one-key shortcut.
export function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    if (!readConsent()) {
      const t = setTimeout(show, 600)
      window.addEventListener(OPEN_CONSENT_EVENT, show)
      return () => {
        clearTimeout(t)
        window.removeEventListener(OPEN_CONSENT_EVENT, show)
      }
    }
    window.addEventListener(OPEN_CONSENT_EVENT, show)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'y' || e.key === 'n') choose(e.key === 'y')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function choose(analytics: boolean) {
    saveConsent(analytics)
    setOpen(false)
  }

  if (!open) return null
  return (
    <div className="gt-consent" role="dialog" aria-labelledby="gt-consent-q" aria-describedby="gt-consent-d">
      <p className="gt-consent-q" id="gt-consent-q">
        <span className="gt-consent-prompt" aria-hidden="true">~ $</span> analytics --opt-in<span className="gt-consent-caret">?</span>
      </p>
      <p className="gt-consent-d" id="gt-consent-d">
        Mind if I count visits? Just anonymous stats, no ads. Either answer is fine.
      </p>
      <div className="gt-consent-actions">
        <button type="button" className="gt-consent-btn yes" onClick={() => choose(true)}>
          <kbd>y</kbd> accept
        </button>
        <button type="button" className="gt-consent-btn" onClick={() => choose(false)}>
          <kbd>n</kbd> decline
        </button>
      </div>
    </div>
  )
}

// A link that reopens the prompt, for footers.
export function ConsentSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={`gt-consent-link ${className ?? ''}`} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      Cookie settings
    </button>
  )
}
