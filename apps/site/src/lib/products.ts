// The products the company builds and runs. The homepage lists them and the
// legal page links each one's terms. A new product is one entry here.
export type Product = {
  name: string
  blurb: string
  status: 'live' | 'private beta' | 'open source' | 'source available'
  url?: string
  terms?: string
  privacy?: string
  /** Shown big at the top of "What I'm building now"; the rest are listed under it. */
  featured?: boolean
  /** A picture for the card: an image per theme (on its own background colour), or a silent looping clip. */
  visual?:
    | { kind: 'image'; light: string; dark: string; alt: string; background: { light: string; dark: string } }
    | { kind: 'clip'; src: string; label: string }
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
    name: 'ebby',
    blurb: 'Every bank you use, in one place. A self-hosted spending app for Greek banks that tells you whether the month is on track before it ends.',
    status: 'source available',
    url: 'https://github.com/gthanasis/ebby',
    visual: {
      kind: 'image',
      light: '/projects/ebby-light.webp',
      dark: '/projects/ebby-dark.webp',
      alt: "ebby's logo next to two phones showing this month's spending",
      background: { light: '#f6f5f2', dark: '#121211' },
    },
  },
  {
    name: 'Lumikey',
    blurb: 'Per-key RGB lighting for Razer keyboards on macOS. A free menu bar app.',
    status: 'open source',
    url: 'https://github.com/gthanasis/lumikey',
    visual: { kind: 'clip', src: '/projects/lumikey.mp4', label: 'Lumikey playing fire, rain and rainbow animations across a keyboard' },
  },
]
