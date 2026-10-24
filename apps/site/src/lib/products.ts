// The products the company builds and runs. The homepage shows them as a grid, in this
// order, and the legal page links each one's terms. A new product is one entry here.
export type Product = {
  name: string
  blurb: string
  status: 'live' | 'private beta' | 'open source' | 'source available'
  url?: string
  terms?: string
  privacy?: string
  /** A few words of what it's built with, shown at the foot of its card. */
  stack: string[]
  /**
   * The picture at the top of its card, cropped to 16:9: a page screenshot, an image per theme
   * (on its own background colour), or a silent looping clip.
   */
  visual:
    | { kind: 'shot'; src: string; alt: string }
    | { kind: 'image'; light: string; dark: string; alt: string; background: { light: string; dark: string } }
    | { kind: 'clip'; src: string; label: string }
}

export const products: Product[] = [
  {
    name: 'Get a Seat',
    blurb: 'Take a number, take a walk. Walk-ins scan a QR at the door and wait on their phone. Staff call them from a tablet.',
    status: 'live',
    url: 'https://get-a-seat.com',
    stack: ['next.js', 'nestjs', 'postgres'],
    visual: { kind: 'shot', src: '/projects/get-a-seat.jpg', alt: 'Get a Seat homepage next to a queue ticket, number 17' },
  },
  {
    name: 'Born to Party',
    blurb: 'Invitations worth opening. Sixty-seven designed themes, one link to send, and RSVPs that come back to you.',
    status: 'live',
    url: 'https://borntoparty.app',
    terms: 'https://borntoparty.app/terms',
    privacy: 'https://borntoparty.app/privacy',
    stack: ['next.js', 'node', 'mongodb'],
    visual: {
      kind: 'shot',
      src: '/projects/born-to-party.jpg',
      alt: 'Born to Party homepage: send something worth opening, next to a Halloween party invitation',
    },
  },
  {
    name: 'ebby',
    blurb: 'Every bank you use, in one place. A self-hosted spending app for Greek banks that tells you whether the month is on track before it ends.',
    status: 'source available',
    url: 'https://github.com/gthanasis/ebby',
    stack: ['react', 'hono', 'postgres'],
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
    stack: ['swift', 'macos'],
    visual: { kind: 'clip', src: '/projects/lumikey.mp4', label: 'Lumikey playing fire, rain and rainbow animations across a keyboard' },
  },
  {
    name: 'Finch',
    blurb: 'Find the right lawyer in Greece. Describe the problem in plain words and get matched with a lawyer who handles it.',
    status: 'private beta',
    stack: ['next.js', 'node', 'pgvector'],
    visual: { kind: 'shot', src: '/projects/finch.jpg', alt: "Finch homepage: tell us what's happening and we'll find you a lawyer" },
  },
]
