// The products the company builds and runs. The homepage lists them and the
// legal page links each one's terms. A new product is one entry here.
export type Product = {
  name: string
  blurb: string
  status: 'live' | 'private beta' | 'open source'
  url?: string
  terms?: string
  privacy?: string
  /** Shown big at the top of "What I'm building now"; the rest are listed under it. */
  featured?: boolean
}

export const products: Product[] = [
  {
    name: 'Born to Party',
    blurb: 'Invitations worth opening. Sixty-seven designed themes, one link to send, and RSVPs that come back to you.',
    status: 'live',
    url: 'https://borntoparty.app',
    terms: 'https://borntoparty.app/terms',
    privacy: 'https://borntoparty.app/privacy',
    featured: true,
  },
  {
    name: 'Finch',
    blurb: 'Find the right lawyer in Greece. Describe the problem in plain words and get matched with a lawyer who handles it.',
    status: 'private beta',
  },
  {
    name: 'Lumikey',
    blurb: 'Per-key RGB lighting for Razer keyboards on macOS. A free menu bar app.',
    status: 'open source',
    url: 'https://github.com/gthanasis/lumikey',
  },
]
