'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

const IDEAS = [
  'An AI assistant that answers customer questions from our docs',
  'Match candidates to jobs by meaning, not keywords',
  'Help my team ship with coding agents, safely',
  'Pull line items out of supplier invoices automatically',
]

// Where messages go. Set NEXT_PUBLIC_CONTACT_ENDPOINT at build time (the n8n
// webhook); without it the form hands off to the visitor's mail client.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT

type Status = 'idea' | 'who' | 'sending' | 'sent' | 'error'

// Types example ideas into the empty composer's placeholder, then deletes them.
function useGhostPlaceholder(active: boolean) {
  const [text, setText] = useState(IDEAS[0])
  useEffect(() => {
    if (!active || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0, j = 0, dir = 1, wait = 0
    const t = setInterval(() => {
      if (wait) return void wait--
      const idea = IDEAS[i]
      j += dir
      if (dir > 0 && j >= idea.length) {
        setText(idea)
        dir = -1
        wait = 45
      } else if (dir < 0 && j <= 0) {
        setText('')
        dir = 1
        i = (i + 1) % IDEAS.length
        wait = 6
      } else setText(idea.slice(0, j) + (dir > 0 ? '▍' : ''))
    }, 45)
    return () => clearInterval(t)
  }, [active])
  return text
}

export function Contact() {
  const [idea, setIdea] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  // Honeypot: hidden from people, filled by bots. The webhook drops those.
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idea')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const ideaRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const placeholder = useGhostPlaceholder(status === 'idea' && !idea)
  const canContinue = idea.trim().length >= 8

  // Move focus with the step, but never on first render: that would steal
  // focus on page load and open the keyboard on phones.
  const moved = useRef(false)
  useEffect(() => {
    if (!moved.current) return void (moved.current = true)
    if (status === 'who') emailRef.current?.focus()
    if (status === 'idea') ideaRef.current?.focus()
  }, [status])

  const toWho = () => canContinue && setStatus('who')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const valid = emailRef.current?.checkValidity() && email.trim()
    setEmailInvalid(!valid)
    if (!valid) return emailRef.current?.focus()
    if (!ENDPOINT) {
      const body = encodeURIComponent(`${idea.trim()}\n\n${name ? `${name}\n` : ''}${email}`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project idea')}&body=${body}`
      return setStatus('sent')
    }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), email: email.trim(), name: name.trim(), source: 'gthanasis.com', website }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="sec" id="contact" aria-labelledby="h-contact">
      <h2 id="h-contact" className="c-title">
        What do you want to build?
      </h2>
      <form className={`composer${status === 'sent' ? ' done' : ''}`} onSubmit={submit} noValidate>
        <div className="hp" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
        {status === 'idea' && (
          <div className="step">
            <label className="sr-only" htmlFor="idea">
              Your idea
            </label>
            <textarea
              ref={ideaRef}
              id="idea"
              name="idea"
              rows={3}
              placeholder={placeholder}
              value={idea}
              required
              onChange={(e) => {
                setIdea(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.max(110, e.target.scrollHeight)}px`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  toWho()
                }
              }}
            />
            <div className="composer-bar">
              <button className="send" type="button" onClick={toWho} disabled={!canContinue} aria-label="Continue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {(status === 'who' || status === 'sending' || status === 'error') && (
          <div className="step">
            <div className="echo">
              <span className="k">your idea</span>
              <p>{idea.trim()}</p>
              <button type="button" className="edit" onClick={() => setStatus('idea')}>
                edit
              </button>
            </div>
            <div className="who-row">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                value={email}
                aria-invalid={emailInvalid}
                className={emailInvalid ? 'invalid' : undefined}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="sr-only" htmlFor="name">
                Name
              </label>
              <input id="name" name="name" autoComplete="name" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </div>
            {status === 'error' && (
              <p className="send-err" role="alert">
                That didn&apos;t go through. Try again, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            )}
          </div>
        )}

        <div className="sent" role="status">
          {status === 'sent' && (
            <>
              <b>Got it.</b>
              <p>I&apos;ll read it properly and reply within two working days.</p>
            </>
          )}
        </div>
      </form>
    </section>
  )
}
