import { ASSET_KINDS, RENEWAL_WARN_DAYS } from '@/constants/domainConfig'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const pad = (n) => String(n).padStart(2, '0')

// Renewal dates are generated relative to today so "in 18 days" stays realistic.
const inDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const parseLocal = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const daysLeft = (a) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((parseLocal(a.renewalDate) - today) / 86400000)
}
// "AWS us-east-1" → "aws". This is the value the Provider filter sends.
const providerSlug = (a) => a.provider.split(' ')[0].toLowerCase()

// Ids match clientsListMock (1–5).
const CLIENTS = [
  { id: 1, name: 'Lumina Health', initials: 'LH', logoColor: 'indigo' },
  { id: 2, name: 'Acme Corp', initials: 'AC', logoColor: 'orange' },
  { id: 3, name: 'Nexus Fintech', initials: 'NF', logoColor: 'sky' },
  { id: 4, name: 'HyperScale AI', initials: 'HA', logoColor: 'fuchsia' },
  { id: 5, name: 'OmniRetail Group', initials: 'OR', logoColor: 'amber' },
]
const client = (id) => ({ ...CLIENTS.find((c) => c.id === id) })

// The first three rows mirror the approved design.
const SEED = [
  {
    id: 1, hostname: 'luminahealth.io', ip: '76.76.21.21', role: 'Edge Apex', kind: 'domain',
    typeLabel: 'Apex Domain (TLD)', client: client(1), provider: 'Cloudflare', protection: 'locked', health: 'healthy',
    renewalDate: inDays(18), cost: 14.5, billed: 120, period: 'yr', marginPercent: 88,
  },
  {
    id: 2, hostname: 'api.hyperscale.ai', ip: '35.180.201.12', role: 'Cluster Ingress', kind: 'hosting',
    typeLabel: 'AWS EKS Cluster', client: client(4), provider: 'AWS us-east-1', protection: 'verified', health: 'healthy',
    renewalDate: inDays(87), cost: 450, billed: 750, period: 'mo', marginPercent: 66,
  },
  {
    id: 3, hostname: 'checkout.nexusfintech.com', ip: '167.99.144.20', role: 'Dedicated Proxy', kind: 'dns',
    typeLabel: 'Cloudflare Pro DNS', client: client(3), provider: 'DigitalOcean', protection: 'locked', health: 'healthy',
    renewalDate: inDays(135), cost: 96, billed: 240, period: 'yr', marginPercent: 150,
  },
]

const TEMPLATES = [
  { kind: 'domain', typeLabel: 'Apex Domain (TLD)', provider: 'Cloudflare', role: 'Edge Apex', protection: 'locked', period: 'yr' },
  { kind: 'hosting', typeLabel: 'Managed VPS Cluster', provider: 'AWS us-east-1', role: 'App Server', protection: 'verified', period: 'mo' },
  { kind: 'dns', typeLabel: 'Cloudflare Pro DNS', provider: 'DigitalOcean', role: 'Dedicated Proxy', protection: 'locked', period: 'yr' },
  { kind: 'ssl', typeLabel: 'SSL Wildcard', provider: 'Cloudflare', role: 'Edge Certificate', protection: 'verified', period: 'yr' },
]

const GENERATED = Array.from({ length: 28 }, (_, i) => {
  const c = CLIENTS[i % CLIENTS.length]
  const t = TEMPLATES[i % TEMPLATES.length]
  const slug = c.name.toLowerCase().replace(/[^a-z]/g, '')
  const hostname =
    t.kind === 'domain' ? `${slug}${i % 8 === 0 ? '' : '-labs'}.com`
    : t.kind === 'hosting' ? `app${i}.${slug}.io`
    : t.kind === 'dns' ? `cdn${i}.${slug}.com`
    : `*.${slug}.com`
  const cost = 40 + ((i * 37) % 400)
  const billed = Math.round(cost * 1.8)
  return {
    id: 4 + i, hostname, ip: `10.${i}.${(i * 7) % 250}.${(i * 13) % 250}`, role: t.role, kind: t.kind,
    typeLabel: t.typeLabel, client: { ...c },
    provider: t.kind === 'domain' && Math.floor(i / 4) % 2 ? 'Namecheap' : t.provider,
    protection: t.protection,
    health: i === 9 ? 'critical' : 'healthy',
    renewalDate: inDays(5 + ((i * 17) % 300)),
    cost, billed, period: t.period, marginPercent: Math.round(((billed - cost) / billed) * 100),
  }
})

const DB = [...SEED, ...GENERATED]

/** Mirrors what the backend `GET /domains` must do: filter → sort → paginate. */
export async function mockFetchDomainAssets(params = {}) {
  await delay(350)
  const {
    page = 1, perPage = 10, search = '', sort = 'renewal', order = 'asc',
    kind = 'all', client: clientId = 'all',
    provider = 'all',            // comma-separated slugs, e.g. "cloudflare,aws"
    renewalWithin = 'all',       // days
    status = 'all',              // healthy | expiring | critical
  } = params
  const q = search.trim().toLowerCase()
  const providers = provider === 'all' ? null : String(provider).split(',')

  let rows = DB.filter((a) => {
    if (kind !== 'all' && a.kind !== kind) return false
    if (clientId !== 'all' && String(a.client.id) !== String(clientId)) return false
    if (providers && !providers.includes(providerSlug(a))) return false
    if (renewalWithin !== 'all' && daysLeft(a) > Number(renewalWithin)) return false
    if (status === 'critical' && a.health !== 'critical') return false
    if (status === 'expiring' && daysLeft(a) > RENEWAL_WARN_DAYS) return false
    if (status === 'healthy' && (a.health !== 'healthy' || daysLeft(a) <= RENEWAL_WARN_DAYS)) return false
    if (q && ![a.hostname, a.ip, a.client.name, a.provider, a.typeLabel].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })

  const value = {
    renewal: (a) => a.renewalDate,
    name: (a) => a.hostname.toLowerCase(),
    cost: (a) => a.cost,
  }[sort] ?? ((a) => a.renewalDate)
  const dir = order === 'desc' ? -1 : 1
  rows = [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * dir)

  return {
    items: structuredClone(rows.slice((page - 1) * perPage, page * perPage)),
    meta: { total: rows.length, page, perPage },
  }
}

/** Counts are over ALL assets (not the current filters or page). */
export async function mockFetchDomainFacets() {
  await delay(200)
  const clients = new Map(DB.map((a) => [String(a.client.id), a.client.name]))
  const providers = new Map(DB.map((a) => [providerSlug(a), a.provider.split(' ')[0]]))
  return {
    total: DB.length,
    kinds: ASSET_KINDS.map((k) => ({ ...k, count: DB.filter((a) => a.kind === k.value).length })),
    clients: [...clients].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
    providers: [...providers].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
  }
}

// ── Detail (drawn in the side panel) ──────────────────────────────
const LUMINA_DETAIL = {
  zone: 'active',
  registrar: 'Cloudflare Registrar',
  environment: 'Verified Production',
  nameservers: [
    { host: 'dora.ns.cloudflare.com', ip: '173.245.58.118' },
    { host: 'jim.ns.cloudflare.com', ip: '173.245.59.194' },
  ],
  records: [
    { id: 'r1', type: 'A', name: '@', value: '76.76.21.21', proxied: true },
    { id: 'r2', type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', proxied: true },
    { id: 'r3', type: 'MX', name: '@', value: 'mail.protection.outlook.com', priority: 10 },
    { id: 'r4', type: 'TXT', name: '@', value: 'v=spf1 include:spf.protection.outlook.com -all', check: 'SPF Ok' },
  ],
}

function genericDetail(a) {
  const slug = a.provider.toLowerCase().replace(/[^a-z]/g, '')
  return {
    zone: a.health === 'critical' ? 'inactive' : 'active',
    registrar: `${a.provider.split(' ')[0]} Registrar`,
    environment: 'Verified Production',
    nameservers: [
      { host: `ns1.${slug}.net`, ip: '198.51.100.10' },
      { host: `ns2.${slug}.net`, ip: '198.51.100.11' },
    ],
    records: [
      { id: 'r1', type: 'A', name: '@', value: a.ip, proxied: true },
      { id: 'r2', type: 'CNAME', name: 'www', value: a.hostname, proxied: false },
    ],
  }
}

export async function mockFetchDomainAssetDetail(id) {
  await delay(150)
  const a = DB.find((x) => String(x.id) === String(id))
  if (!a) return null
  return structuredClone(a.id === 1 ? LUMINA_DETAIL : genericDetail(a))
}