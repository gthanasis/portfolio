// The CV as data: the page, the metadata and the structured data all read from here.
export const person = {
  name: 'Thanasis Gkliatis',
  first: 'Thanasis',
  last: 'Gkliatis',
  role: 'Senior Software Engineer',
  employer: 'n8n',
  tagline: 'Distributed systems, platforms and production AI',
  location: 'Athens, Greece',
  email: 'thanasis.glts@gmail.com',
  web: 'https://gthanasis.com',
  github: 'https://github.com/gthanasis',
  linkedin: 'https://www.linkedin.com/in/thanasis-gkliatis',
  photo: 'https://static.gthanasis.com/portfolio-photo-1.jpg',
  url: 'https://cv.gthanasis.com',
} as const

export const summary =
  'Senior Software Engineer with 10 years building distributed systems and platform infrastructure across HR-tech, marketing and B2B. These days I build through agentic coding: swarms of coding agents that write software my way, simple, reliable and tested. I design event-driven platforms on Kafka, Elasticsearch and PostgreSQL, modernise legacy monoliths, and ship LLM features to production.'

// **text** marks a metric; the page highlights it.
export type Job = { title: string; org: string; from: string; to: string; bullets: string[]; stack?: string; current?: boolean; link?: { label: string; href: string } }

export const jobs: Job[] = [
  {
    title: 'Senior Software Engineer', org: 'n8n', from: 'May 2026', to: 'Present', current: true,
    bullets: ['Working on n8n, the workflow automation platform. Remote.'],
  },
  {
    title: 'Founding Engineer', org: 'Perkit (Ekinox S.A.)', from: 'Mar 2026', to: 'Apr 2026',
    link: { label: 'Perkit', href: 'https://perkit.gr' },
    bullets: [
      'Built Perkit, an employee benefits platform, from a blank repository while the company was bootstrapping, as its top contributor.',
      'Designed the stack: NestJS API, Next.js employer app and an Expo / React Native employee app on one TypeScript monorepo.',
      'Set up Prisma, Stripe payments, Terraform and Kubernetes infrastructure, and a shared component library.',
    ],
    stack: 'nestjs · next.js · expo · prisma · stripe · terraform · k8s',
  },
  {
    title: 'Principal Software Engineer', org: 'Kariera Group', from: 'Mar 2025', to: 'May 2026',
    bullets: [
      'Set the microservice boundaries and integration patterns adopted across job board, billing and candidate teams.',
      'Shipped semantic search and recommendations on OpenAI embeddings; users with 2+ interests grew from **35% to 60%**.',
      'Led LLM-assisted development to **80% of engineers**, and cut hosting costs by **$5k/month** by replacing Druid.',
    ],
    stack: 'nestjs · kafka · postgresql · elasticsearch · openai · iceberg',
  },
  {
    title: 'Technical Lead', org: 'Kariera Group', from: 'May 2023', to: 'Feb 2025',
    bullets: [
      'Rebuilt the resume database into a full product; NPS went from **3-4 to 7-8** within a month.',
      'Designed fault-tolerant, near-real-time sync for **3M+ candidate profiles** on Kafka, PostgreSQL and Elasticsearch.',
      'Moved the job board from a monolith to event-driven microservices; deploys went from one every 1.5 weeks to **5 a week**.',
    ],
  },
  {
    title: 'Software Development Manager', org: 'Upstream, via Socital acquisition', from: 'Jan 2022', to: 'Dec 2023',
    bullets: [
      "Led the technical launch of Socital's platform in Brazil after the acquisition, including a new cloud environment, on a tight timeline.",
      'Led the V2 campaign editor, the largest customer-facing revamp, and the move of the codebase to TypeScript.',
      'Designed integrations with Brazilian e-commerce platforms and the architecture for a new business vertical.',
    ],
  },
  {
    title: 'Tech Lead', org: 'Socital', from: 'Jan 2020', to: 'Dec 2021',
    bullets: [
      'Owned platform architecture through rapid growth, including a multi-vendor subscription and billing system.',
      'Cut the public script bundle by **80%** and set up Cypress E2E testing for critical flows in CI.',
      'Modernised infrastructure: blue/green Ansible deploys, centralised ELK logging and standard monitoring.',
    ],
  },
  {
    title: 'Senior Software Engineer', org: 'Socital', from: 'Jan 2018', to: 'Dec 2020',
    bullets: [
      'Structured the monorepo with Yarn workspaces and refactored core domain models with DDD patterns.',
      'Built a rate-limited, queue-backed integration service for high-volume third-party APIs.',
    ],
  },
  {
    title: 'Software Engineer', org: 'Socital', from: 'Oct 2016', to: 'Jan 2018',
    bullets: [
      'Built integrations with Mailchimp, Moosend and Magento, including a Magento extension for on-site campaigns.',
    ],
  },
]

export const projects = [
  { name: 'Born to Party', link: { label: 'borntoparty.app', href: 'https://borntoparty.app' }, text: 'Event invitations and hosting: sixty-seven designed themes, one link to send, RSVPs that come back to you.' },
  { name: 'Custom agent skill set', link: null, text: 'My own agent workflows for UI, tickets, regression tests and browser QA, used daily. Coming soon.' },
]

export const skills = [
  { area: 'Agentic engineering', items: 'Coding agents, agent workflows and guardrails, AI-assisted development at team scale' },
  { area: 'Distributed systems', items: 'Kafka, Elasticsearch, PostgreSQL, MongoDB, event-driven architecture' },
  { area: 'Platform & infrastructure', items: 'Microservices, Kubernetes, Docker, Terraform, Ansible, Node.js, NestJS' },
  { area: 'Search & AI', items: 'OpenAI embeddings, LLMs, semantic search, pgvector, RAG' },
  { area: 'Frontend', items: 'TypeScript, React, Next.js (SSR/SSG)' },
  { area: 'Domains', items: 'HR-tech, marketing automation, e-commerce, B2B SaaS' },
]

export const education = { degree: 'B.Sc. Informatics', school: 'Ionian University, Corfu', detail: 'Track: Informatics and Humanistic Sciences (HCI). Grade 7.64/10' }

export const talks = [{ title: 'Tech excellence in start-ups', where: 'Developer Talks', href: 'https://www.youtube.com/watch?v=QnkJZYZ8dBk' }]

