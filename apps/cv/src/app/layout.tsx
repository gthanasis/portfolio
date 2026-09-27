import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@gthanasis/ui/Analytics'
import { ConsentBanner } from '@gthanasis/ui/ConsentBanner'
import '@gthanasis/ui/tokens.css'
import '@gthanasis/ui/base.css'
import '@gthanasis/ui/consent.css'
import './cv.css'
import { person, summary, jobs } from '@/lib/cv'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

const title = `${person.name} | CV, ${person.role}`
const description = `CV of ${person.name}, ${person.role} at ${person.employer} in Athens. Ten years building distributed systems, event-driven platforms and production AI, now through agentic coding.`

export const metadata: Metadata = {
  metadataBase: new URL(person.url),
  title,
  description,
  authors: [{ name: person.name, url: person.web }],
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', url: '/', siteName: `${person.name} CV`, title, description, locale: 'en_US', firstName: person.first, lastName: person.last },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
    { media: '(prefers-color-scheme: light)', color: '#eef0f3' },
  ],
  colorScheme: 'light dark',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: person.url,
  name: title,
  description,
  mainEntity: {
    '@type': 'Person',
    '@id': `${person.web}/#person`,
    name: person.name,
    url: person.web,
    image: person.photo,
    jobTitle: person.role,
    description: summary,
    worksFor: { '@type': 'Organization', name: person.employer, url: 'https://n8n.io' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Ionian University' },
    address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
    email: `mailto:${person.email}`,
    sameAs: [person.web, person.github, person.linkedin],
    hasOccupation: jobs.map((j) => ({ '@type': 'Occupation', name: j.title, occupationLocation: { '@type': 'City', name: 'Athens' }, description: `${j.org}, ${j.from} to ${j.to}` })),
  },
}

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Analytics />
      </head>
      <body>
        {children}
        <ConsentBanner />
      </body>
    </html>
  )
}
