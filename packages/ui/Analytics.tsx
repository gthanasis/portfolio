import Script from 'next/script'
import { GA_ID, consentBootstrap } from './analytics'

// Put in <head>: the consent defaults must be set before gtag.js loads.
export function Analytics() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: consentBootstrap }} />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  )
}
