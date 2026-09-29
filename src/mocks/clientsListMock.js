const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const ago = (mins) => new Date(Date.now() - mins * 60000).toISOString()

const LEADS = {
  elena: { id: 'u1', name: 'Elena Vance', short: 'Elena V.', avatarUrl: null },
  marcus: { id: 'u2', name: 'Marcus B.', short: 'Marcus B.', avatarUrl: null },
  sid: { id: 'u3', name: 'Siddharth R.', short: 'Siddharth R.', avatarUrl: null },
  avery: { id: 'u4', name: 'Avery C.', short: 'Avery C.', avatarUrl: null },
}

const SEED = [
  {
    id: 1, name: 'Lumina Health', initials: 'LH', logoColor: 'indigo', badge: 'verified',
    domain: 'luminahealth.io', industry: 'HealthTech / B2B',
    contact: { name: 'Dr. Ronald Vance', email: 'r.vance@lumina.io', emailVerified: true, phone: '+1 (415) 882-9011' },
    projects: { active: 3, paused: 0 },
    billing: { mrr: 24500, pending: 4200, overdue: 0 },
    lead: LEADS.elena, status: 'active_retainer', renewalInDays: 11,
    lastActivity: { at: ago(14), text: 'Vault access sync' },
  },
  {
    id: 2, name: 'Acme Corp', initials: 'AC', logoColor: 'orange', badge: null,
    domain: 'acmeglobal.com', industry: 'Logistics & Supply',
    contact: { name: 'Sarah Jenkins', email: 's.jenkins@acmeglobal.com', emailVerified: true, phone: '+1 (212) 555-0144' },
    projects: { active: 2, paused: 0 },
    billing: { mrr: 18000, pending: 0, overdue: 0 },
    lead: LEADS.marcus, status: 'active_retainer', renewalInDays: null,
    lastActivity: { at: ago(120), text: 'Sprint review approval' },
  },
  {
    id: 3, name: 'Nexus Fintech', initials: 'NF', logoColor: 'sky', badge: null,
    domain: 'nexusfin.co', industry: 'Banking API',
    contact: { name: 'Daniel Choi', email: 'd.choi@nexusfin.co', emailVerified: true, phone: '+1 (650) 419-7720' },
    projects: { active: 4, paused: 0 },
    billing: { mrr: 31200, pending: 0, overdue: 9800 },
    lead: LEADS.elena, status: 'past_due', renewalInDays: null,
    lastActivity: { at: ago(60 * 24), text: 'Dunning reminder sent' },
  },
  {
    id: 4, name: 'HyperScale AI', initials: 'HA', logoColor: 'fuchsia', badge: 'premium',
    domain: 'hyperscale.ai', industry: 'Machine Learning',
    contact: { name: 'Talia Al-Mansoor', email: 'talia@hyperscale.ai', emailVerified: true, phone: '+44 20 7946 0912' },
    projects: { active: 1, paused: 0 },
    billing: { mrr: 12700, pending: 0, overdue: 0, autoDebit: true },
    lead: LEADS.sid, status: 'active_retainer', renewalInDays: null,
    lastActivity: { at: ago(60 * 24 * 3), text: 'Compute budget buffer' },
  },
  {
    id: 5, name: 'OmniRetail Group', initials: 'OR', logoColor: 'amber', badge: null,
    domain: 'omniretail.de', industry: 'Omnichannel Ecom',
    contact: { name: 'Lukas Brandt', email: 'l.brandt@omniretail.de', emailVerified: false, phone: '+49 30 5683 902' },
    projects: { active: 0, paused: 0 },
    billing: { mrr: 0, pending: 0, overdue: 0, standby: true },
    lead: LEADS.avery, status: 'on_hold', renewalInDays: null,
    lastActivity: { at: '2024-10-12T10:00:00.000Z', text: 'Q4 review meeting' },
  },
]

const STATUSES = ['active_retainer', 'active_retainer', 'active_retainer', 'prospect', 'on_hold', 'past_due']
const COLORS = ['indigo', 'orange', 'sky', 'fuchsia', 'amber']
const LEAD_LIST = Object.values(LEADS)

// 37 generated rows → 42 total, matching the design
const GENERATED = Array.from({ length: 37 }, (_, i) => {
  const n = i + 6
  const status = STATUSES[i % STATUSES.length]
  const num = String(n).padStart(2, '0')
  return {
    id: n, name: `Demo Client ${num}`, initials: `D${num.slice(-1)}`, logoColor: COLORS[i % COLORS.length],
    badge: null, domain: `demo${num}.example.com`, industry: ['SaaS', 'Retail', 'EdTech', 'Media'][i % 4],
    contact: { name: `Contact ${num}`, email: `contact@demo${num}.example.com`, emailVerified: i % 3 !== 0, phone: '+1 (555) 010-00' + num },
    projects: { active: status === 'active_retainer' ? (i % 4) + 1 : 0, paused: status === 'on_hold' ? 1 : 0 },
    billing: {
      mrr: status === 'active_retainer' || status === 'past_due' ? (8 + ((i * 7) % 25)) * 1000 : 0,
      pending: i % 7 === 0 && status === 'active_retainer' ? 2500 : 0,
      overdue: status === 'past_due' ? 3000 + i * 100 : 0,
      standby: status === 'on_hold',
      autoDebit: i % 5 === 0,
    },
    lead: LEAD_LIST[i % LEAD_LIST.length], status,
    renewalInDays: i % 9 === 0 ? 10 : null,
    lastActivity: { at: ago(30 + i * 400), text: 'Status update' },
  }
})

const DB = [...SEED, ...GENERATED]

const STATUS_LABELS = {
  active_retainer: 'Active Retainer', past_due: 'Past Due', on_hold: 'On Hold', prospect: 'Prospect',
}

// In the real API these come from a "facets/filters" endpoint.
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value, label, count: DB.filter((c) => c.status === value).length,
  })),
]

export const LEAD_FILTER_OPTIONS = [
  { value: 'all', label: 'All leads' },
  ...LEAD_LIST.map((l) => ({ value: l.id, label: l.name })),
]

export async function mockFetchClients(params = {}) {
  await delay(350)
  const { page = 1, perPage = 10, search = '', sort = 'mrr', order = 'desc', status = 'all', lead = 'all', segment = '' } = params
  const q = search.trim().toLowerCase()

  let rows = DB.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (lead !== 'all' && c.lead.id !== lead) return false
    if (segment === 'retainers' && c.status !== 'active_retainer') return false
    if (segment === 'mrr' && !(c.billing.mrr > 0)) return false
    if (segment === 'attention' && !(c.status === 'past_due' || c.renewalInDays != null)) return false
    if (q && ![c.name, c.domain, c.industry, c.contact.name, c.contact.email].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })

  const value = {
    mrr: (c) => c.billing.mrr,
    name: (c) => c.name.toLowerCase(),
    lastActivity: (c) => new Date(c.lastActivity.at).getTime(),
  }[sort] ?? ((c) => c.billing.mrr)
  const dir = order === 'asc' ? 1 : -1
  rows = [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * dir)

  return {
    items: rows.slice((page - 1) * perPage, page * perPage),
    meta: { total: rows.length, page, perPage },
  }
}

export async function mockCreateClient(values) {
  await delay(200)
  const record = {
    id: Date.now(), name: values.company, initials: values.company.slice(0, 2).toUpperCase(), logoColor: 'indigo', badge: null,
    domain: '—', industry: values.industry || '—',
    contact: { name: values.contactName, email: values.email, emailVerified: false, phone: values.phone || '—' },
    projects: { active: 0, paused: 0 }, billing: { mrr: 0, pending: 0, overdue: 0 },
    lead: LEADS.elena, status: 'prospect', renewalInDays: null,
    lastActivity: { at: new Date().toISOString(), text: 'Client created' },
  }
  DB.unshift(record)
  return record
}