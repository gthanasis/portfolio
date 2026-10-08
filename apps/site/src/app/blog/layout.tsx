import Script from 'next/script'
import { Newsreader } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './blog.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { codeAssets } from '@/lib/code'

// Long-form reading face for post bodies; headings and UI stay in Geist.
const serif = Newsreader({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'] })

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const code = await codeAssets()
  return (
    <div className={`wrap ${serif.variable}`}>
      <style>{code.css}</style>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Copy buttons and scrollable-block focus. Loaded once; it watches the DOM for blocks added by client navigation. */}
      <Script id="expressive-code" strategy="afterInteractive">
        {code.js}
      </Script>
    </div>
  )
}
