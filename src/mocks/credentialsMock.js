import { ROTATION_STALE_DAYS } from '@/constants/credentialConfig'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const DAY = 86400000
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString()

// Ids match clientsListMock (1–5).
const CLIENTS = [
  { id: 1, name: 'Lumina Health' },
  { id: 2, name: 'Acme Corp' },
  { id: 3, name: 'Nexus Fintech' },
  { id: 4, name: 'HyperScale AI' },
  { id: 5, name: 'OmniRetail Group' },
]
const client = (id) => ({ ...CLIENTS.find((c) => c.id === id) })
const PEOPLE = ['Elena Vance', 'Marcus Sterling', 'DevOps Pipeline', 'Siddharth R.', 'Avery C.']

// Mirrors the backend rule: secrets live ONLY in a separate store and are never part of a list row.
const SECRETS = new Map()
const ACCESS = { today: 19, sessions: 8 }

const VAULT = {
  version: 'v4.19-SEC',
  encryptionLabel: '256-BIT AES ZERO-KNOWLEDGE', // MOCK copy from the design — see note in the PR/chat
  encryptionNote: 'Active Encryption • Immutable Log Engine',
  securityMessage:
    'Credential access is strictly logged with IP, user identity, and timestamp in the Immutable Audit Log. Passwords remain masked until explicit audited authorization.',
  complianceLabel: 'ISO/IEC 27001', // MOCK — a compliance claim must come from the real backend/legal
}

// The first five rows mirror the approved design.
const SEED = [
  { name: 'AWS Production NYC-01', category: 'hosting_cloud', client: client(2), environment: 'production',
    identifier: 'iam_role: arn:aws:iam::884192:deployer', rotatedDaysAgo: 2, by: 'Elena Vance', accessTier: 'ops_lead' },
  { name: 'Stripe Live Secret Key', category: 'payment_gateway', client: client(3), environment: 'production',
    identifier: 'sk_live_...93c2', rotatedDaysAgo: 18, by: 'Marcus Sterling', accessTier: 'restricted' },
  { name: 'Cloudflare DNS Registrar', category: 'registrar_dns', client: client(1), environment: 'infrastructure',
    identifier: 'Zone Token: lumina-health.io', rotatedDaysAgo: 45, by: 'DevOps Pipeline', accessTier: 'team' },
  { name: 'PostgreSQL Primary Cluster', category: 'database', client: client(2), environment: 'production',
    identifier: 'pg://admin@db-cluster.acme.internal:5432', rotatedDaysAgo: 94, by: null, accessTier: 'ops_lead' },
  { name: 'HubSpot OAuth Client Secret', category: 'cms_app', client: client(1), environment: 'staging',
    identifier: 'App ID: 2984102', rotatedDaysAgo: 12, by: 'Elena Vance', accessTier: 'team' },
]

// 43 generated rows → 48 total, matching the design. Exactly 3 stale in total (1 seed + 2 below).
const TEMPLATES = [
  ['AWS Staging Cluster', 'hosting_cloud', 'iam_role: arn:aws:iam::{n}:deployer'],
  ['Domain Registrar Login', 'registrar_dns', 'Account: ops@{c}.example.com'],
  ['MySQL Replica', 'database', 'mysql://app@replica.{c}.internal:3306'],
  ['Payment Gateway Webhook Secret', 'payment_gateway', 'whsec_...{n}'],
  ['WordPress Admin', 'cms_app', 'Site ID: {n}'],
  ['Third-party API Key', 'api_key', 'key-prefix: ak_{n}'],
]
const ENVS = ['production', 'staging', 'infrastructure', 'production']
const TIERS = ['team', 'ops_lead', 'team', 'restricted']
const STALE_IDX = new Set([11, 29])

const GENERATED = Array.from({ length: 43 }, (_, i) => {
  const [name, category, ident] = TEMPLATES[i % TEMPLATES.length]
  const c = CLIENTS[i % CLIENTS.length]
  const slug = c.name.toLowerCase().replace(/[^a-z]/g, '')
  const n = String(100000 + i * 7919).slice(0, 6)
  return {
    name, category, client: { ...c }, environment: ENVS[i % ENVS.length],
    identifier: ident.replace('{n}', n).replace('{c}', slug),
    rotatedDaysAgo: STALE_IDX.has(i) ? 95 + i : ((i * 7) % 80) + 1,
    by: PEOPLE[i % PEOPLE.length], accessTier: TIERS[i % TIERS.length],
  }
})

const DB = [...SEED, ...GENERATED].map(({ rotatedDaysAgo, by, ...rest }, i) => {
  const id = i + 1
  SECRETS.set(id, `mock-secret-${id}`) // obviously fake
  return { id, ...rest, lastRotatedAt: daysAgo(rotatedDaysAgo), lastRotatedBy: by }
})

const isStale = (c) => !c.lastRotatedAt || Date.now() - new Date(c.lastRotatedAt).getTime() > ROTATION_STALE_DAYS * DAY

export async function mockFetchCredentials(params = {}) {
  await delay(350)
  const { page = 1, perPage = 10, search = '', sort, order = 'asc', category = 'all', env = 'all', client: clientId = 'all' } = params
  const q = search.trim().toLowerCase()

  let rows = DB.filter((c) => {
    if (category !== 'all' && c.category !== category) return false
    if (env !== 'all' && c.environment !== env) return false
    if (clientId !== 'all' && String(c.client.id) !== String(clientId)) return false
    if (q && ![c.name, c.client.name, c.environment, c.identifier ?? ''].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })

  // No sort requested → keep insertion order (newest first), as in the design
  if (sort === 'name' || sort === 'lastRotated') {
    const value = sort === 'name' ? (c) => c.name.toLowerCase() : (c) => new Date(c.lastRotatedAt).getTime()
    const dir = order === 'desc' ? -1 : 1
    rows = [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * dir)
  }

  return {
    items: structuredClone(rows.slice((page - 1) * perPage, page * perPage)),
    meta: { total: rows.length, page, perPage },
  }
}

export async function mockFetchCredentialsOverview() {
  await delay(250)
  return structuredClone({
    vault: VAULT,
    stats: {
      totalKeys: { value: DB.length, syncedPercent: 100 },
      pendingRotations: { value: DB.filter(isStale).length, staleDays: ROTATION_STALE_DAYS },
      accessAudits: { value: ACCESS.today, sessions: ACCESS.sessions },
      integrity: { percent: 99.4, status: 'optimal' },
    },
  })
}

export async function mockFetchCredentialFacets() {
  await delay(200)
  const clients = new Map(DB.map((c) => [String(c.client.id), c.client.name]))
  return {
    total: DB.length,
    clients: [...clients].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
  }
}

export async function mockCreateCredential(payload) {
  await delay(300)
  const { secret, ...meta } = payload // secret goes to the secret store, never into the row
  const found = CLIENTS.find((c) => String(c.id) === String(meta.clientId))
  const record = {
    id: Date.now(),
    name: meta.name,
    category: meta.category,
    client: { id: found?.id ?? meta.clientId, name: found?.name ?? 'Unknown client' },
    environment: meta.environment,
    identifier: meta.identifier,
    lastRotatedAt: new Date().toISOString(),
    lastRotatedBy: 'Admin User',
    accessTier: 'team', // backend default — tiers are not part of the create form
  }
  SECRETS.set(record.id, secret)
  DB.unshift(record)
  return structuredClone(record)
}

// Mock of the audited access path. The real backend writes an audit_logs row (user, IP, time, action).
function recordAccess(id) {
  const c = DB.find((x) => String(x.id) === String(id))
  if (!c) throw new Error('Credential not found')
  ACCESS.today += 1
  return c
}

export async function mockRevealCredential(id) {
  await delay(250)
  const c = recordAccess(id)
  return { value: SECRETS.get(c.id), expiresInSec: 30 }
}

export async function mockCopyCredential(id) {
  await delay(200)
  const c = recordAccess(id)
  return { value: SECRETS.get(c.id) }
}