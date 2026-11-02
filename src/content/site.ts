/**
 * Site copy. Every fact here is sourced from career/PROFILE.md and career/audit/*.md.
 * Do not add metrics that are not verified there. Keep it short: one line where three would do.
 */

export const person = {
  name: 'Joseph Morrison',
  fullName: 'Joseph A. Morrison',
  email: 'josephmorrison702@gmail.com',
  linkedin: 'https://www.linkedin.com/in/joseph-a-morrison/',
  github: 'https://github.com/pixelate-solutions',
  resume: '/Joseph_Morrison_Resume.pdf',
  location: 'Shelby Township, Michigan',
}

export const hero = {
  lede: 'Michigan State computer science. I carry a ~$2M industrial-automation sales book at Electro-Matic and build production software as the founder of Pixelate Solutions.',
}

export type Stat = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
}

export const ledgers: { id: 'book' | 'code'; title: string; byline: string; stats: Stat[] }[] = [
  {
    id: 'book',
    title: 'At Electro-Matic',
    byline: 'Account manager, industrial automation, since 2024',
    stats: [
      { value: 2, prefix: '~$', suffix: 'M', label: 'annual sales across 31 accounts' },
      { value: 21, suffix: '×', label: 'one account grown, 2025 to 2026' },
    ],
  },
  {
    id: 'code',
    title: 'At Pixelate Solutions',
    byline: 'Founder and engineer, since 2024',
    stats: [
      // Counted in career/audit/project-count.md (36 counted, 29 without borderline items) and api-route-count.md.
      { value: 30, suffix: '+', label: 'projects built' },
      { value: 1200, suffix: '+', label: 'API routes shipped across my projects' },
    ],
  },
]

export type Chapter = {
  act: 'build' | 'sell' | 'both'
  when: string
  org: string
  role: string
  body: string
  /** links the chapter to a case study */
  slug?: string
}

export const acts = {
  build: 'Build',
  sell: 'Sell',
  both: 'Both',
} as const

export const chapters: Chapter[] = [
  {
    act: 'build',
    when: 'Summer 2023',
    org: 'Ally Financial',
    role: 'Mobile engineering intern',
    body: 'Customer-facing UI for the Ally Mobile app in SwiftUI, React Native and Jetpack Compose.',
  },
  {
    act: 'build',
    when: 'June 2024',
    org: 'Michigan State University',
    role: 'B.S. Computer Science, minor in Business',
    body: 'How things work, and why anyone pays for them.',
  },
  {
    act: 'sell',
    when: 'May 2024 – now',
    org: 'Electro-Matic',
    role: 'Account Manager',
    body: '~$2M a year across 31 industrial accounts. Control panels, robotics, Eplan and Siemens software.',
  },
  {
    act: 'both',
    when: 'August 2024',
    org: 'Pixelate Solutions',
    role: 'Founded',
    body: 'A software consultancy. Discovery to deployment, start to finish.',
  },
  {
    act: 'both',
    when: 'Aug 2024 – now',
    org: 'Link',
    role: 'Open source',
    body: 'Bank-connected personal finance with an API and MCP server.',
    slug: 'link',
  },
  {
    act: 'both',
    when: '2024 – now',
    org: 'MetrIQs',
    role: 'Founder-built',
    body: 'Profit and KPI intelligence for restaurants, queried through the customer’s own AI.',
    slug: 'metriqs',
  },
  {
    act: 'both',
    when: 'Jun – Oct 2026',
    org: 'Connected-machine platform',
    role: 'Client work',
    body: 'Live telemetry, support and fleet admin for a machine manufacturer. iOS, Android and web.',
    slug: 'connected-machine-platform',
  },
  {
    act: 'both',
    when: 'Aug – Sep 2026',
    org: 'Relay',
    role: 'Client work',
    body: 'Co-built the business console. Shipped interactive messages across the SDK, seven runtimes, docs and iOS.',
    slug: 'relay',
  },
  {
    act: 'both',
    when: 'October 2026',
    org: 'Acquisition Radar',
    role: 'Private build',
    body: 'Deal sourcing and underwriting for a two-partner business search.',
    slug: 'acquisition-radar',
  },
]

export type MethodStep = {
  id: string
  title: string
  line: string
  where: string
}

export const method: MethodStep[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    line: 'Find the real problem, in the customer’s words.',
    where: 'Scoping control panels and robotics with the engineers who build them, across 31 accounts.',
  },
  {
    id: 'scoping',
    title: 'Scoping',
    line: 'Draw the boundary: what ships first, what it must never do.',
    where: 'Scoping an air-gapped records system for a municipal fire department. Local database, self-hosted AI.',
  },
  {
    id: 'prototype',
    title: 'Prototype',
    line: 'Put something real in their hands fast.',
    where: 'A configurator that encodes product rules, draws the panel and produces the quote sheet.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    line: 'Ship it, watch it, own it when it breaks.',
    where: 'Re-architected live machine telemetry after a 3.7M-row incident: idempotent ingest, 10 Hz broadcast.',
  },
  {
    id: 'expand',
    title: 'Expand',
    line: 'Earn the next problem.',
    where: 'One account from $10.4K to $225K+. An MCP server so a customer’s own AI can query their data.',
  },
]

export type SkillGroup = { id: string; label: string; hue: 'sell' | 'build' | 'both'; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    label: 'AI & MCP',
    hue: 'both',
    skills: ['MCP servers', 'OpenAI', 'Anthropic', 'Agents SDK', 'Tool calling', 'RAG', 'pgvector', 'Pinecone', 'Ollama', 'Evals'],
  },
  {
    id: 'fullstack',
    label: 'Full-stack',
    hue: 'build',
    skills: ['TypeScript', 'React', 'Next.js', 'TanStack', 'Hono', 'Node', 'Python', 'FastAPI', 'OpenAPI', 'Playwright', 'Vitest'],
  },
  {
    id: 'data',
    label: 'Data & integrations',
    hue: 'build',
    skills: ['PostgreSQL', 'Drizzle', 'Supabase', 'pg-boss', 'Forecasting', 'Plaid', 'Stripe', 'QuickBooks', 'Toast', 'Shopify'],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    hue: 'build',
    skills: ['GitHub Actions', 'Docker', 'AWS', 'GCP', 'Render', 'Railway', 'Vercel', 'Cloudflare Workers'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    hue: 'build',
    skills: ['Expo', 'React Native', 'SwiftUI', 'UIKit', 'Jetpack Compose', 'TestFlight', 'EAS'],
  },
  {
    id: 'industrial',
    label: 'Industrial automation',
    hue: 'sell',
    skills: ['Eplan', 'Siemens simulation', 'Control panels', 'Robotics', 'Injection molding', 'Machine telemetry'],
  },
  {
    id: 'sales',
    label: 'Sales',
    hue: 'sell',
    skills: ['Discovery', 'Scoping', 'Proposals', 'Forecasting', 'Account growth', 'Pipedrive', 'Power Automate'],
  },
]
