// Google Analytics 4 with Consent Mode v2. Nothing is stored and no cookie is
// set until the visitor says yes; until then GA only gets cookieless pings.

export const GA_ID = 'G-F1JR45Q3PZ'

// Bump when what we measure changes: everyone is asked again, because an
// earlier yes did not cover the new processing.
export const CONSENT_VERSION = 1
export const CONSENT_KEY = 'gt-consent'
export const OPEN_CONSENT_EVENT = 'gt:open-consent'

export type Consent = { v: number; analytics: boolean; at: string }

// Runs inline in <head>, before gtag.js is requested: defines gtag, applies a
// stored answer if there is one, and otherwise starts everything denied.
export const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var granted = false;
try { var c = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}) || 'null'); granted = !!(c && c.v === ${CONSENT_VERSION} && c.analytics); } catch (e) {}
gtag('consent', 'default', {
  analytics_storage: granted ? 'granted' : 'denied',
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_ID)});
`

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null') as Consent | null
    return c && c.v === CONSENT_VERSION ? c : null
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean) {
  const value: Consent = { v: CONSENT_VERSION, analytics, at: new Date().toISOString() }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value))
  } catch {}
  window.gtag?.('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' })
}

export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.('event', event, params)
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
