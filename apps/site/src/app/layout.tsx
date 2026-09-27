import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@gthanasis/ui/Analytics'
import { ConsentBanner } from '@gthanasis/ui/ConsentBanner'
import '@gthanasis/ui/tokens.css'
import '@gthanasis/ui/base.css'
import '@gthanasis/ui/consent.css'
import './site.css'
import { site } from '@/lib/site'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
    firstName: 'Thanasis',
    lastName: 'Gkliatis',
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
  ],
  colorScheme: 'dark light',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.name,
      url: site.url,
      image: site.photo,
      jobTitle: site.role,
      worksFor: { '@type': 'Organization', name: site.employer.name, url: site.employer.url },
      address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
      email: `mailto:${site.email}`,
      sameAs: [site.github, site.linkedin, site.cv],
      knowsAbout: ['Agentic coding', 'AI-assisted software development', 'Distributed systems', 'Kafka', 'PostgreSQL', 'Elasticsearch', 'TypeScript', 'Next.js', 'LLMs'],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { '@id': `${site.url}/#person` },
      inLanguage: 'en',
    },
  ],
}

// Runs before paint so a saved light/dark choice never flashes the other theme.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
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
