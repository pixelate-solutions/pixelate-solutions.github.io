/**
 * Site copy. Every fact here is sourced from career/PROFILE.md and career/audit/*.md.
 * Do not add metrics that are not verified there.
 */

export const person = {
  name: 'Joseph Morrison',
  fullName: 'Joseph A. Morrison',
  email: 'josephmorrison702@gmail.com',
  linkedin: 'https://www.linkedin.com/in/joseph-a-morrison/',
  github: 'https://github.com/pixelate-solutions',
  resume: '/Joseph_Morrison_Resume.pdf',
  location: 'Shelby Township, MI',
  availability: 'Open to remote Solutions Engineering roles',
  roles: ['Solutions Engineer', 'Forward Deployed Engineer', 'Solutions Architect', 'Sales Engineer'],
}

export const hero = {
  eyebrow: 'Portfolio — 2026',
  lede:
    'Michigan State CS grad. I carry a ~$2M B2B technical sales book in industrial automation, and I build production software as the founder of Pixelate Solutions. I run the discovery call, then I write the code.',
}

export type Stat = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
  note: string
}

export const ledgers: { id: 'book' | 'code'; title: string; byline: string; stats: Stat[] }[] = [
  {
    id: 'book',
    title: 'The book',
    byline: 'Electro-Matic · Account Manager',
    stats: [
      { value: 2, prefix: '~$', suffix: 'M', label: 'Annual sales', note: 'Industrial automation, from small shops to large OEMs and machine builders.' },
      { value: 31, label: 'B2B accounts', note: 'Technical discovery with controls engineers and integrators. Quotes, proposals, forecasts.' },
      { value: 30, prefix: '+', suffix: '%', label: 'Eplan, year over year', note: '$130K to $170K. I own Eplan and Siemens simulation software sales across five territories.' },
      { value: 21, suffix: '×', label: 'One account, grown', note: '$10.4K in 2025 sales to $225K+ through September 2026.' },
    ],
  },
  {
    id: 'code',
    title: 'The code',
    byline: 'Pixelate Solutions · Founder',
    stats: [
      { value: 100, prefix: '~', suffix: 'k', label: 'Lines of code, flagship', note: 'MetrIQs: TypeScript, 63 tables, 135 migrations, ~2,100 commits across its repos.' },
      { value: 889, label: 'Automated tests', note: 'MetrIQs suite: 885 pass, 4 skipped, 0 fail.' },
      { value: 217, label: 'Production API routes', note: 'Node/Express API behind a connected-machine platform shipped to iOS and Android.' },
      { value: 22, label: 'MCP tools', note: "So a customer's own Claude, ChatGPT or Cursor can query their business data." },
    ],
  },
]

export const growth = {
  title: 'One account, 21×',
  caption: 'Assigned account, annual sales',
  bars: [
    { label: '2025', value: 10.4, display: '$10.4K' },
    { label: 'Jan–Sep 2026', value: 225, display: '$225K+' },
  ],
}

export type Chapter = {
  act: 'build' | 'sell' | 'both'
  when: string
  org: string
  role: string
  body: string
  tags: string[]
}

export const acts = {
  build: { numeral: 'I', title: 'Learned to build' },
  sell: { numeral: 'II', title: 'Learned to sell' },
  both: { numeral: 'III', title: 'Now I do both' },
} as const

export const chapters: Chapter[] = [
  {
    act: 'build',
    when: 'Graduated June 2024',
    org: 'Michigan State University',
    role: 'B.S. Computer Science · Minor in Business',
    body: 'Computer science for how things work. A business minor for why anyone pays for them.',
    tags: ['CS', 'Business'],
  },
  {
    act: 'build',
    when: 'May – Aug 2023',
    org: 'Ally Financial',
    role: 'Mobile Software Development Engineer Intern',
    body: 'Shipped customer-facing UI for the Ally Mobile app in SwiftUI, React Native and Jetpack Compose. Interviewed engineers about onboarding and presented the fixes to executive leadership.',
    tags: ['SwiftUI', 'React Native', 'Compose'],
  },
  {
    act: 'sell',
    when: 'May 2024 – now',
    org: 'Electro-Matic',
    role: 'Account Manager · Industrial automation',
    body: 'Control panels, robotics, injection-molding integrations. ~$2M a year across 31 accounts. Then I automated my own desk: product configurators that quote, and Power Automate flows for backorder alerts and lead intake.',
    tags: ['Discovery', 'Quoting', 'Eplan', 'Siemens'],
  },
  {
    act: 'both',
    when: 'Aug 2024 – now',
    org: 'Pixelate Solutions',
    role: 'Founder & Software Engineer',
    body: 'A software consultancy where I own every engagement end to end: discovery, scope, proposal, build, deploy, support. Clients in manufacturing, municipal and finance.',
    tags: ['Discovery', 'Full-stack', 'AI'],
  },
  {
    act: 'both',
    when: '2025 – 2026',
    org: 'MetrIQs + a connected-machine platform',
    role: 'Flagship product · Client platform',
    body: 'A ~100k-line analytics platform with an MCP server. A 217-route platform for a laser-marking machine manufacturer, shipped to iOS and Android in under four months.',
    tags: ['MCP', 'Telemetry', 'Expo'],
  },
  {
    act: 'both',
    when: 'Next',
    org: 'Your customers',
    role: 'Solutions Engineer · Forward Deployed · Solutions Architect',
    body: 'The role that needs someone who can earn trust in the room and ship in the repo. Remote, US.',
    tags: ['Remote', 'Eastern time'],
  },
]

export type MethodStep = {
  id: string
  title: string
  line: string
  example: { where: string; title: string; body: string; proof: string[] }
}

export const method: MethodStep[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    line: 'Find the real problem, in the customer’s words, with the people who live with it.',
    example: {
      where: 'Electro-Matic',
      title: 'Technical discovery with controls engineers',
      body: 'I scope control panels, robotics and injection-molding integrations with the engineers and integrators who build them, then turn that into a quote and a forecast management can trust.',
      proof: ['31 B2B accounts', '~$2M annual book'],
    },
  },
  {
    id: 'scoping',
    title: 'Scoping',
    line: 'Draw the boundary: what ships first, what it must never do, and what it runs on.',
    example: {
      where: 'Pixelate Solutions',
      title: 'An air-gapped records system for a fire department',
      body: 'Scoping an on-prem system for a municipal fire department: a local database and self-hosted AI on the department’s own GPUs, no internet, strict access control. Civic Records AI is the public concept demo.',
      proof: ['On-prem', 'Local LLMs', 'Access control'],
    },
  },
  {
    id: 'prototype',
    title: 'Prototype',
    line: 'Put something real in their hands fast. The prototype is the best discovery question.',
    example: {
      where: 'Electro-Matic',
      title: 'Configurators that let reps quote themselves',
      body: 'I encoded product rules (slot capacity, nomenclature, valid combinations) into a web configurator that draws the panel and produces a BOM and a quote sheet, instead of waiting on engineering.',
      proof: ['4 product families', 'Drawing · BOM · PDF quote'],
    },
  },
  {
    id: 'deploy',
    title: 'Deploy',
    line: 'Ship to production, watch it, and own it when it breaks.',
    example: {
      where: 'Connected-machine platform',
      title: 'Re-architecting telemetry after an incident',
      body: 'Live machine data hit a 3.7M-row table, statement timeouts and 1-second polling. I rebuilt the path: idempotent ingest, per-machine realtime broadcast capped at 10 Hz, change-only events, compressed raw archives.',
      proof: ['217 API routes', 'iOS + Android', '370 commits in <4 months'],
    },
  },
  {
    id: 'expand',
    title: 'Expand',
    line: 'Earn the next problem. Land, prove value, grow the account.',
    example: {
      where: 'MetrIQs · Electro-Matic',
      title: 'Meet customers inside the AI they already use',
      body: 'I shipped an MCP server so a customer’s own Claude, ChatGPT or Cursor can query their business data, compare to peers and generate reports. On the sales side, one account went from $10.4K to $225K+.',
      proof: ['22 MCP tools', 'OAuth via Clerk', 'Account grown 21×'],
    },
  },
]

export type SkillGroup = { id: string; label: string; hue: 'sell' | 'build' | 'both'; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    label: 'AI / LLM & MCP',
    hue: 'both',
    skills: ['MCP servers', 'MCP clients', 'OpenAI', 'Anthropic', 'OpenAI Agents SDK', 'Tool calling', 'RAG', 'pgvector', 'Pinecone', 'ChromaDB', 'Ollama', 'Evals', 'Human-in-the-loop'],
  },
  {
    id: 'fullstack',
    label: 'Full-stack',
    hue: 'build',
    skills: ['TypeScript', 'React 19', 'Next.js', 'Hono', 'Node / Express', 'Python', 'FastAPI', 'Zod', 'Tailwind', 'Playwright', 'Vitest'],
  },
  {
    id: 'data',
    label: 'Data & integrations',
    hue: 'build',
    skills: ['PostgreSQL', 'Drizzle ORM', 'Supabase', 'Neon', 'pg-boss', 'Forecasting', 'Plaid', 'Stripe', 'QuickBooks', 'Toast', 'Shopify'],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    hue: 'build',
    skills: ['GitHub Actions', 'Docker', 'AWS', 'GCP', 'Render', 'Railway', 'Vercel', 'Cloudflare Workers', 'Infisical'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    hue: 'build',
    skills: ['Expo', 'React Native', 'SwiftUI', 'MapKit', 'Jetpack Compose', 'Flutter', 'TestFlight', 'Firebase push'],
  },
  {
    id: 'industrial',
    label: 'Industrial automation',
    hue: 'sell',
    skills: ['Eplan', 'Siemens simulation', 'Control panels', 'Robotics integration', 'Injection molding', 'Machine telemetry', 'Power distribution'],
  },
  {
    id: 'sales',
    label: 'Sales',
    hue: 'sell',
    skills: ['Technical discovery', 'Scoping', 'Proposals & quotes', 'Forecasting', 'Account growth', 'Territory management', 'Pipedrive', 'Power Automate', 'Exec presentations'],
  },
]
