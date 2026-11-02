/**
 * Case studies. Facts come from career/audit/local-projects.md, career/audit/github-repos.md,
 * career/audit/relay.md and career/audit/macbook-extras.md.
 * Confidentiality: the connected-machine client is never named; private repos are never linked;
 * no Electro-Matic pricing appears anywhere.
 *
 * Screenshots are NOT listed here. `npm run sync-assets` writes src/content/assets.generated.json
 * from career/assets/screenshots/<slug>/; slugs without images render a generated placeholder.
 */
import manifest from './assets.generated.json'

export type ProjectLink = { label: string; href: string }

export type Project = {
  slug: string
  name: string
  /** 2–4 words, sentence case */
  kicker: string
  client?: string
  /** ≤ 6 words */
  role: string
  period: string
  /** one line, ≤ 90 characters: what it is */
  summary: string
  /** exactly three: the problem, what I built, the result. Each ≤ 150 characters. */
  points: [string, string, string]
  /** ≤ 8 chips */
  stack: string[]
  links: ProjectLink[]
  /** ≤ 90 characters */
  privacy?: string
  /** two-stop gradient used for the card glow and the generated placeholder */
  palette: [string, string]
  /** 12-col span on desktop */
  span: number
  /** substring of the screenshot file name to use as the cover (defaults to the first desktop shot) */
  cover?: string
  /** ≤ 3, each ≤ 14 characters */
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
    kicker: 'Founder-built',
    role: 'Founder, product and engineering',
    period: '2024 – now',
    summary: 'Profit and KPI intelligence for multi-location restaurants, queried through your own AI.',
    points: [
      'Multi-location owners run on a POS, accounting, payroll and a bank that never agree, so nobody can say where margin is leaking.',
      'I built it end to end: 9 integrations, backtested forecasts, a 22-tool MCP server, plus an earlier Python FastAPI multi-agent analyst and Expo app.',
      '~132k lines of TypeScript at peak, 889 tests today, and Claude, ChatGPT or Cursor query a client’s data through 22 MCP tools.',
    ],
    stack: ['TypeScript', 'Next.js 15', 'Hono', 'Drizzle', 'PostgreSQL 17', 'Clerk OAuth', 'MCP SDK', 'Expo'],
    links: [],
    privacy: 'Private repository. Screens use demo data with fictional businesses.',
    palette: ['#9FBDD3', '#F26B3A'],
    cover: '01-profit-leak-report',
    span: 7,
    tags: ['MCP', 'Forecasting', '9 integrations'],
  },
  {
    slug: 'connected-machine-platform',
    name: 'Connected-Machine Platform',
    kicker: 'Client work',
    client: 'An industrial laser-marking machine manufacturer',
    role: 'Lead engineer, via Pixelate Solutions',
    period: 'Jun – Oct 2026',
    summary: 'Live telemetry, AI support and fleet admin for a machine maker, on iOS, Android and web.',
    points: [
      'Customers had no window into their machines, support ran on email and memory, and the manufacturer needed one product within months.',
      'I led the build: an Expo app for iOS and Android, a Node API and Next.js staff admin, an AI support agent, and a ~3,800-ticket data migration.',
      '217 routes in production, telemetry rebuilt to a 10 Hz cap after a 3.7M-row incident, and 1,900 machines reconciled against ~7,900 CRM deals.',
    ],
    stack: ['Expo', 'React Native', 'TypeScript', 'Node.js', 'Supabase', 'Postgres RLS', 'OpenAI', 'Next.js 16'],
    links: [],
    privacy: 'Client name withheld. Private repositories; screens are anonymized demo data.',
    palette: ['#F26B3A', '#E8B97A'],
    span: 5,
    tags: ['IIoT', 'Realtime', 'iOS + Android'],
  },
  {
    slug: 'relay',
    name: 'Relay',
    kicker: 'Client work',
    client: 'Relay (relayapp.im), the messenger for AI agents',
    role: 'Contract engineer, via Pixelate Solutions',
    period: 'Aug – Sep 2026',
    summary: 'A messenger where AI agents are contacts people text like friends.',
    points: [
      'Businesses needed a console to launch and run agents, and agents needed richer replies than text, identical across every runtime.',
      'I co-built the business console with the founder and shipped buttons, multi-select and Stripe invoices across the API, SDK, docs and iOS.',
      'Second-largest console contributor at 238 commits, with 3 interactive message types live across 7 agent runtimes, the docs and the iOS app.',
    ],
    stack: ['TypeScript', 'React 19', 'TanStack Start', 'Hono', 'Cloudflare Workers', 'OpenAPI', 'Mintlify', 'Swift / UIKit'],
    links: [
      { label: 'relayapp.im', href: 'https://relayapp.im' },
      { label: 'Developer docs', href: 'https://docs.relayapp.im' },
      { label: 'Buttons guide', href: 'https://docs.relayapp.im/interactions/buttons' },
      { label: 'Selection guide', href: 'https://docs.relayapp.im/interactions/selection' },
    ],
    privacy: 'Public product. Screens show the site and docs. Console screens await the founder’s OK.',
    palette: ['#7FA6D9', '#B8B3D6'],
    cover: 'site-07-docs-buttons',
    span: 7,
    tags: ['SDK', 'Developer docs', '7 runtimes'],
  },
  {
    slug: 'acquisition-radar',
    name: 'Acquisition Radar',
    kicker: 'Private build',
    role: 'Designer and engineer',
    period: 'Oct 2026',
    summary: 'Deal sourcing and underwriting for a two-partner team buying a Michigan business.',
    points: [
      'Searchers drown in broker emails and CIMs, and need a system that scores targets and only spends AI money on promising ones.',
      'I built scheduled ingestion of WARN notices, 21 FRED series, broker email and CIMs, with rules-based scoring, underwriting and guarded LLM memos.',
      'pg-boss workers on 10 cron schedules feed daily, weekly and monthly briefings, and it went from empty repo to tested build in 2 days.',
    ],
    stack: ['TypeScript', 'Next.js 16', 'PostgreSQL 17', 'Drizzle', 'pg-boss', 'Anthropic SDK', 'OpenAI SDK', 'Docker'],
    links: [],
    privacy: 'Private repository. Screens use the demo database only.',
    palette: ['#B8B3D6', '#9FBDD3'],
    cover: '03-deal-radar',
    span: 5,
    tags: ['Workers', 'Guarded AI', 'Public data'],
  },
  {
    slug: 'link',
    name: 'Link',
    kicker: 'Open source',
    role: 'Solo build',
    period: '2024 – 2026',
    summary: 'Bank-connected personal finance that turns a plain-language goal into a plan.',
    points: [
      'Budgeting apps miscategorize and make you fix it, and your own financial data is locked away from the AI tools you already use.',
      'I built Plaid sync into Postgres, rules-first categorization with an LLM behind a 0.8 confidence gate, and goals turned into projected plans.',
      '437 commits and a ground-up Link 2.0 rebuild in October 2026, with a read-only REST API and MCP server so your AI agents can query your finances.',
    ],
    stack: ['Next.js 16', 'TypeScript', 'Drizzle', 'Postgres', 'Plaid', 'Clerk', 'OpenAI', 'MCP'],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/link' }],
    palette: ['#9FBDD3', '#A9C9B5'],
    span: 4,
    tags: ['Plaid', 'MCP', 'Open source'],
  },
  {
    slug: 'civic-records-ai',
    name: 'Civic Records AI',
    kicker: 'Open source',
    role: 'Solo build',
    period: '2026',
    summary: 'Document intelligence for municipal records that runs fully offline.',
    points: [
      'Municipal and public-safety teams sit on decades of PDFs they cannot search, and policy often forbids sending them to a cloud model.',
      'I built OCR ingestion into ChromaDB, answers with page-level citations, version diffs and a 3D knowledge graph, all on local models via Ollama.',
      'It runs air-gapped on synthetic data, and is the public concept for an on-prem records system being scoped for a municipal fire department.',
    ],
    stack: ['Python', 'FastAPI', 'ChromaDB', 'PyMuPDF', 'Tesseract', 'Ollama', 'React', 'three.js'],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/civic-records-ai' }],
    palette: ['#9FBDD3', '#9FBDD3'],
    span: 4,
    tags: ['RAG', 'On-prem', 'OCR'],
  },
  {
    slug: 'pdu-configurator',
    name: 'PDU Configurator',
    kicker: 'Built at Electro-Matic',
    role: 'Account manager who wrote the software',
    period: 'Electro-Matic',
    summary: 'A rules-driven configurator so reps can quote power distribution equipment themselves.',
    points: [
      'Quoting panels and PDUs meant hand-checking slot capacity and part nomenclature, then waiting on engineering for a drawing.',
      'I encoded the product rules as code and built guided configuration for 4 product families with live panel drawings and an admin catalog editor.',
      'One form now produces the drawing, a CSV bill of materials and a print-ready PDF quote sheet, and it is in use on the sales desk.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Zod', 'Drizzle', 'Postgres', 'Tailwind v4', 'Vercel'],
    links: [],
    privacy: 'Private repository. Pricing, cost and margin data are never shown.',
    palette: ['#F26B3A', '#E07A5F'],
    cover: '01-pdu-step-power',
    span: 4,
    tags: ['Rules engine', 'CPQ', 'Sales tooling'],
  },
  {
    slug: 'marlow',
    name: 'Marlow',
    kicker: 'Open source',
    role: 'Solo build',
    period: 'Jul 2026',
    summary: 'An AI outbound agent that researches and drafts, and cannot send without your approval.',
    points: [
      'Outbound tools either spray generic email or need hours of research per lead, and nobody wants a model on the send button.',
      'I built a chat brief that becomes a campaign profile, lead finding through Apollo’s MCP server, per-lead research, and drafts into a review queue.',
      'Sending requires an explicit hash-checked approval, so nothing goes out on its own, over Gmail and Microsoft with 7-day follow-up detection.',
    ],
    stack: ['TypeScript', 'Turborepo', 'Next.js', 'Supabase', 'OpenAI', 'MCP client', 'Zod', 'Railway'],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/Marlow' }],
    palette: ['#E8B97A', '#F26B3A'],
    span: 4,
    tags: ['Agents', 'MCP client', 'Approval gates'],
  },
  {
    slug: 'meminios',
    name: 'MeminiOS',
    kicker: 'Open source',
    role: 'Solo build',
    period: '2026',
    summary: 'A permissions-aware company brain with cited answers and governed skills for AI agents.',
    points: [
      'Company knowledge is scattered across tools, and most chat-with-your-docs products ignore who is allowed to see what.',
      'I built cited answers filtered by the asker’s permissions, proactive signals with an entity map, and ingest workers behind a model router.',
      'Governed skills such as brain_search and brain_answer are exposed over REST and as MCP tools, served by Hono on Cloudflare Workers at the edge.',
    ],
    stack: ['TypeScript', 'Turborepo', 'Hono', 'Cloudflare Workers', 'Next.js', 'Postgres', 'Drizzle', 'MCP'],
    links: [{ label: 'GitHub', href: 'https://github.com/pixelate-solutions/MeminiOS' }],
    palette: ['#B8B3D6', '#F26B3A'],
    span: 4,
    tags: ['RAG', 'Permissions', 'MCP'],
  },
  {
    slug: 'northstar',
    name: 'Northstar',
    kicker: 'Live product',
    role: 'Solo build',
    period: 'Live',
    summary: 'A free AI trip planner: every day on one map, and an assistant that edits the plan.',
    points: [
      'Trip planning lives in tabs, notes and group chats, and most AI planners hand you an itinerary you cannot really edit.',
      'I built the web app with drag-and-drop days on one map, an AI assistant that edits through tool calls, and a SwiftUI iPhone app on the same API.',
      'Every AI edit is a reversible operation with undo, and the product is live at northstartravelguide.com with web and native iOS on one JSON API.',
    ],
    stack: ['Next.js 16', 'TypeScript', 'Drizzle', 'Neon Postgres', 'Clerk', 'OpenAI', 'SwiftUI', 'MapKit'],
    links: [
      { label: 'Live site', href: 'https://northstartravelguide.com' },
      { label: 'GitHub', href: 'https://github.com/pixelate-solutions/northstar-web' },
    ],
    palette: ['#9FBDD3', '#E8B97A'],
    cover: '02-trip-map',
    span: 4,
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
