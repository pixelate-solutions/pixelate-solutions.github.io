/**
 * Case studies. Facts come from career/audit/local-projects.md and career/audit/github-repos.md.
 * Confidentiality: the connected-machine client is never named; private repos are never linked;
 * no Electro-Matic pricing appears anywhere.
 *
 * Screenshots are NOT listed here. `npm run sync-assets` writes src/content/assets.generated.json
 * from career/assets/screenshots/<slug>/; slugs without images render a generated placeholder.
 */
import manifest from './assets.generated.json'

export type Outcome = { value: string; label: string }
export type ProjectLink = { label: string; href: string }

export type Project = {
  slug: string
  name: string
  kicker: string
  client?: string
  role: string
  period: string
  tagline: string
  problem: string
  built: string[]
  note?: string
  flow: string[]
  stack: string[]
  outcomes: Outcome[]
  links: ProjectLink[]
  privacy?: string
  /** two-stop gradient used for the card glow and the generated placeholder */
  palette: [string, string]
  /** 12-col span on desktop */
  span: number
  /** substring of the screenshot file name to use as the cover (defaults to the first desktop shot) */
  cover?: string
  tags: string[]
}

export type ShotImage = {
  base: string
  widths: number[]
  w: number
  h: number
  kind: 'desktop' | 'mobile' | 'document'
  caption: string
  lqip: string
}

export const projects: Project[] = [
  {
    slug: 'metriqs',
    name: 'MetrIQs',
    kicker: 'Flagship · Founder-built',
    role: 'Founder, product and engineering',
    period: '2024 – now',
    tagline: 'Profit and KPI intelligence for multi-location restaurants, now queried through the customer’s own AI.',
    problem:
      'Owners of small multi-location businesses run on a POS, accounting, payroll and a bank, and none of them agree. Nobody can tell the owner where margin is leaking this week, or why.',
    built: [
      'Native adapters for 9 systems (Toast, Square, Clover, Shopify, QuickBooks, Xero, 7shifts, Plaid, Stripe) plus the Composio catalog, normalized into one daily-metrics store.',
      'A backtested forecasting engine that picks between seasonal-median models by MAPE on each business’s own last 28 days, with p10–p90 bands derived from the method’s real errors.',
      'An MCP server with 22 tools over OAuth, so Claude, ChatGPT and Cursor can query a client’s data, compare to peers and build reports. Code does the math; the model never computes a number.',
      'An automated Profit Leak Report: 36 months of deterministic analysis, a graded rubric, and a one-page PDF rendered in the client’s own logo, colors and fonts.',
      'Anomaly alerts over SMS and email, and AES-256-GCM credential encryption with key rotation.',
    ],
    note:
      'Earlier versions included an in-app AI analyst on OpenAI and Anthropic, a Python FastAPI service and Stripe billing. In October 2026 I consolidated everything into one TypeScript service and cut ~76k lines.',
    flow: ['POS · accounting · payroll · bank', 'Provider adapters', 'PostgreSQL daily metrics', 'Forecasts · anomalies · leaks', 'MCP server · 22 tools', 'Claude · ChatGPT · Cursor'],
    stack: ['TypeScript', 'Next.js 15', 'Hono', 'Zod', 'Drizzle', 'PostgreSQL 17', 'Clerk OAuth', 'MCP SDK', 'Twilio', 'Resend', 'AWS S3', 'pdfkit', 'Render', 'GitHub Actions'],
    outcomes: [
      { value: '~100k', label: 'lines of TypeScript' },
      { value: '889', label: 'automated tests, 0 failing' },
      { value: '135', label: 'guarded SQL migrations' },
      { value: '22', label: 'MCP tools' },
    ],
    links: [],
    privacy: 'Private repository. Screens use demo data with fictional businesses.',
    palette: ['#5CE1E6', '#FF7A45'],
    cover: '01-profit-leak-report',
    span: 7,
    tags: ['MCP', 'Forecasting', '9 integrations'],
  },
  {
    slug: 'connected-machine-platform',
    name: 'Connected-Machine Platform',
    kicker: 'Client work · Industrial',
    client: 'An industrial laser-marking machine manufacturer',
    role: 'Lead engineer, via Pixelate Solutions',
    period: 'Jun – Oct 2026',
    tagline: 'Live machine telemetry, AI-assisted support and fleet admin for a machine manufacturer. iOS, Android and web.',
    problem:
      'The manufacturer’s customers had no window into their machines, and support ran on email and memory. They needed one product for customers and staff, on phones and the web, in months, not years.',
    built: [
      'An Expo / React Native app for iOS and Android: machines, live telemetry (amperage, voltage, vibration, temperature, laser state), support tickets with chat, documents and videos. Released through TestFlight and Google Play.',
      'A 217-route Node/Express API and a 31-page Next.js staff admin for tickets, fleet, warranties, customers and billing, on Supabase Postgres with row-level security.',
      'Re-architected telemetry after a production incident (3.7M-row table, statement timeouts, 1-second polling): idempotent ingest, per-machine realtime broadcast capped at 10 Hz, change-only event storage, gzip NDJSON archives.',
      'An AI support agent on OpenAI with retrieval over manuals, videos and past tickets. It triages new tickets and escalates to people.',
      'CRM sync with Pipedrive, Stripe billing for premium telemetry, Firebase push, and an outbound-only GPU worker so customers can train vision models on the client’s on-prem server with no inbound ports.',
    ],
    flow: ['Machine controller', 'Ingest API · idempotent', 'Realtime broadcast ≤ 10 Hz', 'State · events · archives', 'iOS · Android · staff web'],
    stack: ['Expo', 'React Native', 'TypeScript', 'Node.js', 'Express 5', 'Supabase', 'Postgres RLS', 'Realtime', 'OpenAI', 'Stripe', 'Pipedrive', 'Firebase', 'Next.js 16', 'Railway', 'Vercel', 'Playwright'],
    outcomes: [
      { value: '217', label: 'API routes in production' },
      { value: '~130k', label: 'lines of code' },
      { value: '370', label: 'commits in under 4 months' },
      { value: '156', label: 'test files across app, API, web' },
    ],
    links: [],
    privacy: 'Client name withheld. Private repositories; screens are anonymized demo data.',
    palette: ['#FF7A45', '#FFC46B'],
    span: 5,
    tags: ['IIoT', 'Realtime', 'iOS + Android'],
  },
  {
    slug: 'acquisition-radar',
    name: 'Acquisition Radar',
    kicker: 'Private build · M&A intelligence',
    role: 'Designer and engineer',
    period: 'Oct 2026',
    tagline: 'Deal sourcing and underwriting for a two-partner team searching to buy a Michigan business.',
    problem:
      'Searchers buying a small business drown in broker emails, CIMs and noise. They need a system that watches public signals, scores targets against their criteria, and only spends AI money on what is promising.',
    built: [
      'Scheduled ingestion of Michigan WARN notices, 21 FRED economic series, forwarded broker emails and uploaded CIMs, PDFs and CSVs into an append-only history.',
      'Explainable rules-based scoring, deal underwriting (financing assumptions, replacement-manager cost) and market-timing classification.',
      'Guarded LLM use across Anthropic and OpenAI: schema-validated JSON only, no tool access, prompt-injection guards, cached by input hash, under a monthly budget. With no key it falls back to rules.',
      'pg-boss workers on 10 cron schedules with retries and a dead-letter queue, feeding daily, weekly and monthly briefings to an in-app inbox.',
    ],
    flow: ['WARN · FRED · broker email · CIMs', 'pg-boss workers', 'PostgreSQL · 45 tables', 'Rules scoring + underwriting', 'Guarded AI memos', 'Alerts & briefings'],
    stack: ['TypeScript', 'Next.js 16', 'React 19', 'PostgreSQL 17', 'Drizzle', 'pg-boss', 'Anthropic SDK', 'OpenAI SDK', 'Docker', 'Vitest'],
    outcomes: [
      { value: '21', label: 'FRED series on a schedule' },
      { value: '10', label: 'cron schedules, DLQ' },
      { value: '45', label: 'tables' },
      { value: '2 days', label: 'from empty repo to tested build' },
    ],
    links: [],
    privacy: 'Private repository. Screens use the demo database only.',
    palette: ['#9B8CFF', '#5CE1E6'],
    cover: '03-deal-radar',
    span: 4,
    tags: ['Workers', 'Guarded AI', 'Public data'],
  },
  {
    slug: 'link',
    name: 'Link',
    kicker: 'Open source · Personal finance',
    role: 'Solo build',
    period: '2024 – 2026',
    tagline: 'Bank-connected personal finance that turns a plain-language goal into a plan, with an API and MCP server for your own AI.',
    problem:
      'Budgeting apps miscategorize, then make you fix it. And your own financial data is locked away from the AI tools you already use.',
    built: [
      'Plaid bank connections with a sync pipeline into Postgres.',
      'Two-stage categorization: deterministic rules first, then LLM classification behind a 0.8 confidence gate.',
      'Plain-language goals turned into projected plans, computed on integer-money engines.',
      'A read-only REST API with personal tokens, and an MCP server so AI agents can query your finances.',
    ],
    note: 'First commit August 2024; rebuilt from the ground up in October 2026 as Link 2.0.',
    flow: ['Plaid', 'Sync pipeline', 'Rules → LLM (≥ 0.8)', 'Integer-money engines', 'UI · REST · MCP'],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Drizzle', 'Postgres', 'Plaid', 'Clerk', 'OpenAI', 'MCP', 'Tailwind v4', 'Vitest', 'Playwright'],
    outcomes: [
      { value: '437', label: 'commits' },
      { value: '0.8', label: 'confidence gate before AI labels' },
      { value: 'MCP', label: 'server for your own agents' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/link' }],
    palette: ['#5CE1E6', '#7CF29A'],
    span: 4,
    tags: ['Plaid', 'MCP', 'Open source'],
  },
  {
    slug: 'civic-records-ai',
    name: 'Civic Records AI',
    kicker: 'Open source · Public-sector AI',
    role: 'Solo build',
    period: '2026',
    tagline: 'Document intelligence for municipal records: cited answers, version diffs, a knowledge graph. Runs fully offline.',
    problem:
      'Municipal and public-safety teams sit on decades of PDFs they cannot search, and policy often forbids sending them to a cloud model.',
    built: [
      'OCR ingestion with PyMuPDF and Tesseract into a ChromaDB vector store.',
      'Questions answered with page-level citations and inline PDF previews.',
      'Document version comparison and a 3D knowledge graph of extracted entities.',
      'Local models through Ollama, so the whole system can run air-gapped.',
    ],
    note:
      'The public concept behind an on-prem records system I am scoping for a municipal fire department: a local database and self-hosted AI on the department’s own GPUs. Ships with synthetic data for the fictional City of Rivergate.',
    flow: ['Scanned PDFs', 'OCR + chunking', 'ChromaDB', 'FastAPI', 'Ollama · local LLM', 'Cited answers'],
    stack: ['Python', 'FastAPI', 'ChromaDB', 'PyMuPDF', 'Tesseract', 'Ollama', 'React', 'pdf.js', 'three.js'],
    outcomes: [
      { value: 'Offline', label: 'air-gap capable' },
      { value: 'Page', label: 'level citations' },
      { value: '3D', label: 'entity knowledge graph' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/civic-records-ai' }],
    palette: ['#7CA8FF', '#5CE1E6'],
    span: 4,
    tags: ['RAG', 'On-prem', 'OCR'],
  },
  {
    slug: 'pdu-configurator',
    name: 'PDU Configurator',
    kicker: 'Built in my sales job · Quoting',
    role: 'Account manager who wrote the software',
    period: 'Electro-Matic',
    tagline: 'A rules-driven configurator that lets reps configure and quote power distribution equipment themselves.',
    problem:
      'Quoting panels and PDUs meant hand-checking slot capacity and part nomenclature, then waiting on engineering for a drawing. Slow for the rep, slower for the customer.',
    built: [
      'Guided configuration of panelboards, weld and control power distribution panels, PDUs and remote power panels.',
      'Product rules encoded as code: slot capacity, nomenclature, valid combinations.',
      'Live panel drawings, a CSV bill of materials, PNG drawing export and a print-ready PDF quote sheet.',
      'An admin catalog editor so the product list stays current without a developer.',
    ],
    flow: ['Rep enters requirements', 'Rule engine · slots · nomenclature', 'Live panel drawing', 'BOM + PDF quote'],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Zod', 'Drizzle', 'Postgres', 'Tailwind v4', 'Vercel'],
    outcomes: [
      { value: '4', label: 'product families' },
      { value: '1', label: 'form to drawing, BOM and quote' },
      { value: 'In use', label: 'on the sales desk' },
    ],
    links: [],
    privacy: 'Private repository. Pricing, cost and margin data are never shown.',
    palette: ['#FF7A45', '#FF4D6D'],
    cover: '01-pdu-step-power',
    span: 5,
    tags: ['Rules engine', 'CPQ', 'Sales tooling'],
  },
  {
    slug: 'marlow',
    name: 'Marlow',
    kicker: 'Open source · Sales tech',
    role: 'Solo build',
    period: 'Jul 2026',
    tagline: 'An AI outbound agent that does the research and the drafting, and cannot send a thing without your approval.',
    problem:
      'Outbound tools either spray generic email or need hours of research per lead. The fix is an agent that does the work but keeps a human on the send button.',
    built: [
      'Describe your company, offer and market in chat; the agent builds a campaign profile.',
      'Finds leads through Apollo’s remote MCP server, researches each one, and drafts emails into a review queue.',
      'Sending requires an explicit, hash-checked approval. The model has no path to send on its own.',
      'Gmail and Microsoft sending, with 7-day follow-up detection.',
    ],
    flow: ['Chat brief', 'Campaign profile', 'Apollo MCP → leads', 'Research + drafts', 'Human approval · hash-checked', 'Gmail · Microsoft'],
    stack: ['TypeScript', 'pnpm', 'Turborepo', 'Next.js', 'Postgres job worker', 'Supabase', 'OpenAI', 'MCP client', 'Zod', 'Vitest', 'Playwright', 'Railway'],
    outcomes: [
      { value: '40', label: 'test files' },
      { value: '3 days', label: 'to a working monorepo' },
      { value: '0', label: 'sends without approval' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/Marlow' }],
    palette: ['#FFC46B', '#FF7A45'],
    span: 7,
    tags: ['Agents', 'MCP client', 'Approval gates'],
  },
  {
    slug: 'meminios',
    name: 'MeminiOS',
    kicker: 'Open source · Enterprise AI',
    role: 'Solo build',
    period: '2026',
    tagline: 'A permissions-aware company brain: cited answers, proactive signals and governed skills for AI agents.',
    problem:
      'Company knowledge is scattered across tools, and most “chat with your docs” products ignore who is allowed to see what.',
    built: [
      'Ask: cited answers with an evidence rail, filtered by what the asker is allowed to see.',
      'Brief: proactive signals, plus an entity map across sources.',
      'Governed skills AI agents can use, exposed over REST and as MCP tools (brain_search, brain_answer and more).',
      'Ingest, enrich and signal workers behind a model-router abstraction.',
    ],
    flow: ['Company sources', 'Ingest · enrich workers', 'Postgres', 'Permission-filtered retrieval', 'REST + MCP tools'],
    stack: ['TypeScript', 'pnpm', 'Turborepo', 'Hono', 'Cloudflare Workers', 'Next.js', 'Postgres', 'Drizzle', 'MCP', 'Vitest', 'GitHub Actions', 'Docker Compose'],
    outcomes: [
      { value: 'MCP', label: 'tools for agents' },
      { value: 'RBAC', label: 'aware retrieval' },
      { value: 'Edge', label: 'Hono on Cloudflare Workers' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/MeminiOS' }],
    palette: ['#9B8CFF', '#FF7A45'],
    span: 6,
    tags: ['RAG', 'Permissions', 'MCP'],
  },
  {
    slug: 'northstar',
    name: 'Northstar',
    kicker: 'Live product · Consumer AI',
    role: 'Solo build',
    period: 'Live',
    tagline: 'A free AI trip planner: every day of a trip on one map, and an assistant that edits the plan, with undo.',
    problem: 'Trip planning lives in tabs, notes and group chats. Most AI planners hand you an itinerary you cannot really edit.',
    built: [
      'Every day of a trip on one map, with drag-and-drop reordering.',
      'An AI assistant that edits the plan through tool calls as reversible operations, so every change can be undone.',
      'A native SwiftUI + MapKit iPhone app on the same JSON API and Clerk accounts as the web app.',
      'Grew out of an earlier Flutter app with a Fastify agent server.',
    ],
    flow: ['Web · Next.js', 'iPhone · SwiftUI', 'Shared JSON API', 'Tool calls → reversible edits', 'Neon Postgres'],
    stack: ['Next.js 16', 'React', 'TypeScript', 'Drizzle', 'Neon Postgres', 'Clerk', 'OpenAI', 'Leaflet', 'dnd-kit', 'Vercel Blob', 'SwiftUI', 'MapKit', 'Playwright'],
    outcomes: [
      { value: 'Live', label: 'northstartravelguide.com' },
      { value: '2', label: 'clients, one API: web + native iOS' },
      { value: 'Undo', label: 'on every AI edit' },
    ],
    links: [
      { label: 'Live site', href: 'https://northstartravelguide.com' },
      { label: 'GitHub', href: 'https://github.com/pixelate-solutions/northstar-web' },
    ],
    palette: ['#7CA8FF', '#FFC46B'],
    cover: '02-trip-map',
    span: 6,
    tags: ['Consumer', 'SwiftUI', 'Tool calling'],
  },
]

const shots = (manifest as { projects: Record<string, { images: ShotImage[] }> }).projects

export function imagesFor(slug: string): ShotImage[] {
  return shots[slug]?.images ?? []
}

/** The cover image for a project: the configured one, else the first desktop shot, else a document page. */
export function coverFor(p: Project): ShotImage | undefined {
  const imgs = imagesFor(p.slug)
  return (
    (p.cover && imgs.find((i) => i.base.includes(p.cover!))) ||
    imgs.find((i) => i.kind === 'desktop') ||
    imgs.find((i) => i.kind === 'document')
  )
}

export const headshots = (manifest as unknown as {
  headshots: Record<'casual' | 'suit', { base: string; widths: number[]; w: number; h: number; lqip: string }>
}).headshots
