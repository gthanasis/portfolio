import type { Metadata } from 'next'
import { ConsentSettingsLink } from '@gthanasis/ui/ConsentBanner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'
import { site } from '@/lib/site'

const title = `Company and legal | ${site.name}`
const description = `${site.company.legalName} builds and runs the products listed on this site. Contact details, and each product's terms and privacy policy.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/legal' },
}

export default function Legal() {
  return (
    <div className="wrap">
      <Header />
      <main className="legal">
        <h1>Company and legal</h1>
        <p>
          The products on this site are built and run by <strong>{site.company.legalName}</strong>, a company registered in{' '}
          {site.company.country} and run by {site.name}.
        </p>
        <p>
          Contact: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>Products</h2>
        <p>
          Each product has its own website, terms and privacy policy. Payments are processed by Stripe and show on your
          statement under the product&apos;s name.
        </p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Terms</th>
              <th>Privacy</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.name}>
                <td>{p.url ? <a href={p.url}>{p.name}</a> : p.name}</td>
                <td>{p.terms ? <a href={p.terms}>Terms</a> : p.status === 'open source' ? 'Free, MIT licence' : 'When it opens'}</td>
                <td>{p.privacy ? <a href={p.privacy}>Privacy</a> : p.status === 'open source' ? 'Collects no data' : 'When it opens'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>This website</h2>
        <p>
          gthanasis.com uses Google Analytics only if you agree to it. You can change that at any time: <ConsentSettingsLink />.
          The contact form sends your message and email address to {site.name}, only so you can get a reply.
        </p>
      </main>
      <Footer />
    </div>
  )
}
