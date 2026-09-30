import { mockFetchClients, LEAD_FILTER_OPTIONS } from '@/mocks/clientsListMock'
import { STAGES, STATUSES } from '@/constants/projectConfig'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const pad = (n) => String(n).padStart(2, '0')

// Deadlines are generated relative to today so "IN 4 DAYS" / "OVERDUE" stay realistic.
const inDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const TEAM = [
  { id: 'u1', name: 'Elena Vance', avatarUrl: null },
  { id: 'u2', name: 'Marcus B.', avatarUrl: null },
  { id: 'u3', name: 'Siddharth R.', avatarUrl: null },
  { id: 'u4', name: 'Avery C.', avatarUrl: null },
  { id: 'u5', name: 'Priya Nair', avatarUrl: null },
  { id: 'u6', name: 'Tomas Keller', avatarUrl: null },
]

// Ids match clientsListMock (1–5). `segment` is a display descriptor (tier / industry).
const CLIENTS = [
  { id: 4, name: 'HyperScale AI', segment: 'Tier 1 Enterprise' },
  { id: 1, name: 'Lumina Health', segment: 'HealthTech' },
  { id: 2, name: 'Acme Corp', segment: 'Legacy Core v3' },
  { id: 3, name: 'Nexus Fintech', segment: 'Banking API' },
  { id: 5, name: 'OmniRetail Group', segment: 'Omnichannel Ecom' },
]
const client = (id) => ({ ...CLIENTS.find((c) => c.id === id) })

const SEED = [
  {
    id: 101, name: 'Model Ops Infrastructure', icon: 'cpu', client: client(4),
    stage: 'development', status: 'in_progress',
    milestones: { done: 4, total: 6 }, team: [TEAM[1], TEAM[0], TEAM[2], TEAM[3], TEAM[4]],
    deadline: inDays(4), value: 120000, invoiced: 96000, paid: 60000,
  },
  {
    id: 102, name: 'HIPAA Compliance Portal', icon: 'shield', client: client(1),
    stage: 'testing', status: 'client_review',
    milestones: { done: 5, total: 5 }, team: [TEAM[0], TEAM[5]],
    deadline: inDays(1), value: 88000, invoiced: 88000, paid: 88000,
  },
  {
    id: 103, name: 'API Migration', icon: 'sync', client: client(2),
    stage: 'development', status: 'blocked',
    milestones: { done: 2, total: 7 }, team: [TEAM[2], TEAM[3]],
    deadline: inDays(-4), value: 54000, invoiced: 18000, paid: 0,
  },
]

// 16 generated rows → 19 total. Distribution matches the design and the stat cards:
//   stage:  planning 3 · design 2 · development 9 · testing 3 · deployment 2
//   status: in_progress 14 · client_review 3 · blocked 2
const NAMES = [
  'Customer Data Platform', 'Mobile Banking App', 'Checkout Redesign', 'Supply Chain Dashboard',
  'Patient Intake Portal', 'Fraud Detection Engine', 'Loyalty Program Rebuild', 'Analytics Warehouse',
  'Partner API Gateway', 'Inventory Sync Service', 'Design System Refresh', 'Subscription Billing Portal',
  'Compliance Reporting Suite', 'Search Relevance Tuning', 'Onboarding Experience', 'Cloud Cost Optimizer',
]
const ICONS = ['cpu', 'shield', 'sync', 'cart', 'code', 'globe']
const STAGE_SEQ = [
  ...Array(3).fill('planning'), ...Array(2).fill('design'), ...Array(7).fill('development'),
  ...Array(2).fill('testing'), ...Array(2).fill('deployment'),
]
const STATUS_SEQ = STAGE_SEQ.map((_, i) => (i === 4 || i === 9 ? 'client_review' : i === 12 ? 'blocked' : 'in_progress'))
const PROGRESS = { planning: 0.1, design: 0.3, development: 0.55, testing: 0.85, deployment: 0.95 }
const INVOICED = { planning: 0.2, design: 0.3, development: 0.5, testing: 0.8, deployment: 0.9 }
const round1k = (n) => Math.round(n / 1000) * 1000

const GENERATED = NAMES.map((name, i) => {
  const stage = STAGE_SEQ[i]
  const status = STATUS_SEQ[i]
  const total = 4 + (i % 5)
  const value = (30 + ((i * 13) % 120)) * 1000
  const invoiced = round1k(value * INVOICED[stage])
  return {
    id: 104 + i, name, icon: ICONS[i % ICONS.length], client: { ...CLIENTS[i % CLIENTS.length] },
    stage, status,
    milestones: { done: Math.min(total - 1, Math.floor(total * PROGRESS[stage])), total },
    team: TEAM.slice(i % 3, (i % 3) + 2 + (i % 3)),
    deadline: inDays(status === 'blocked' ? -9 : 2 + ((i * 7) % 45)),
    value, invoiced, paid: round1k(invoiced * 0.6),
  }
})

const DB = [...SEED, ...GENERATED]

const NO_DEADLINE = '9999-12-31' // ISO dates sort lexicographically; projects without one go last

/** Mirrors what the backend `GET /projects` must do: filter → sort → paginate. */
export async function mockFetchProjects(params = {}) {
  await delay(350)
  const {
    page = 1, perPage = 10, search = '', sort = 'deadline', order = 'asc',
    stage = 'all', status = 'all', client: clientId = 'all',
  } = params
  const q = search.trim().toLowerCase()

  let rows = DB.filter((p) => {
    if (stage !== 'all' && p.stage !== stage) return false
    if (status !== 'all' && p.status !== status) return false
    if (clientId !== 'all' && String(p.client.id) !== String(clientId)) return false
    if (q && ![p.name, p.client.name, p.client.segment ?? ''].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })

  const value = {
    deadline: (p) => p.deadline ?? NO_DEADLINE,
    name: (p) => p.name.toLowerCase(),
    value: (p) => p.value,
  }[sort] ?? ((p) => p.deadline ?? NO_DEADLINE)
  const dir = order === 'desc' ? -1 : 1
  rows = [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * dir)

  return {
    items: rows.slice((page - 1) * perPage, page * perPage),
    meta: { total: rows.length, page, perPage },
  }
}

/** Counts are over ALL projects (not the current filters or page). */
export async function mockFetchProjectFacets() {
  await delay(200)
  const count = (key, v) => DB.filter((p) => p[key] === v).length
  const clients = new Map(DB.map((p) => [String(p.client.id), p.client.name]))
  return {
    total: DB.length,
    stages: STAGES.map((s) => ({ ...s, count: count('stage', s.value) })),
    statuses: STATUSES.map((s) => ({ ...s, count: count('status', s.value) })),
    clients: [...clients]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }
}

/** Builds a list row from the create payload (see createProject in projectsService). */
export async function createProjectRecord(payload) {
  const { items } = await mockFetchClients({ page: 1, perPage: 100 })
  const found = items.find((c) => String(c.id) === String(payload.clientId))
  const lead = LEAD_FILTER_OPTIONS.find((l) => l.value === payload.leadId)
  const record = {
    id: Date.now(), name: payload.name, icon: 'code',
    client: { id: found?.id ?? payload.clientId, name: found?.name ?? 'Unknown client', segment: found?.industry ?? '' },
    stage: 'planning', status: 'in_progress',
    milestones: { done: 0, total: payload.milestones.length },
    team: lead ? [{ id: lead.value, name: lead.label, avatarUrl: null }] : [],
    deadline: payload.targetHandoverDate ?? null,
    value: payload.budget ?? 0, invoiced: 0, paid: 0,
  }
  DB.unshift(record)
  return record
}
/** Mock for `GET /projects/featured`. Reuses project 101 so both views stay in sync. */
export async function mockFetchFeaturedProject() {
  await delay(250)
  const p = DB.find((x) => x.id === 101)
  return {
    id: p.id,
    name: p.name,
    client: { id: p.client.id, name: p.client.name },
    critical: true,
    targetHandover: p.deadline,
    lead: { id: 'u2', name: 'Marcus Vance' },
    sprint: { current: 6, total: 8 },
    stages: [
      { key: 'planning', label: 'Planning', milestone: 'Arch Spec Signed' },
      { key: 'requirements', label: 'Requirements', milestone: '32 User Stories Lock' },
      { key: 'development', label: 'Development', milestone: 'Cluster Sync' },
      { key: 'testing', label: 'Testing', milestone: 'QA Stress Test Suite' },
      { key: 'deployment', label: 'Deployment', milestone: 'Multi-region Go-live' },
    ],
    activeStage: 'development',
    activeProgress: 82,
  }
}