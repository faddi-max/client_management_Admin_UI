import { calculateInvoiceTotals } from '@/utils/invoiceTotals'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const clients = [
  { id: 3, name: 'Nexus Fintech', contact: 'Daniel Choi', email: 'd.choi@nexusfin.co' },
  { id: 1, name: 'Lumina Health', contact: 'Dr. Ronald Vance', email: 'r.vance@lumina.io' },
  { id: 4, name: 'HyperScale AI', contact: 'Talia Al-Mansoor', email: 'talia@hyperscale.ai' },
  { id: 2, name: 'Acme Corp', contact: 'Sarah Jenkins', email: 's.jenkins@acmeglobal.com' },
  { id: 5, name: 'OmniRetail Group', contact: 'Lukas Brandt', email: 'l.brandt@omniretail.de' },
]

const seeded = [
  { id: 'inv-089', number: 'INV-2024-089', client: clients[0], project: 'Ledger Module & Security Audit', issueDate: 'Oct 14, 2024', dueDate: 'Oct 21, 2024', amount: 9800, status: 'overdue', daysOverdue: 4, paymentMethod: 'Net 7', createdAt: 'Oct 14, 2024' },
  { id: 'inv-088', number: 'INV-2024-088', client: clients[1], project: 'HIPAA Compliance Portal Phase 2', issueDate: 'Oct 18, 2024', dueDate: 'Nov 02, 2024', amount: 18500, status: 'pending', paymentMethod: 'Net 15' },
  { id: 'inv-087', number: 'INV-2024-087', client: clients[2], project: 'Model Ops Infrastructure – M3', issueDate: 'Oct 10, 2024', dueDate: 'Oct 25, 2024', amount: 32000, status: 'paid', paymentMethod: 'Wire Transfer' },
  { id: 'inv-086', number: 'INV-2024-086', client: clients[3], project: 'API Migration Sprint 1', issueDate: 'Oct 02, 2024', dueDate: 'Oct 16, 2024', amount: 12400, status: 'paid', paymentMethod: 'ACH Auto-Debit' },
  { id: 'inv-085', number: 'INV-2024-085', client: clients[4], project: 'E-Commerce Headless Redesign', issueDate: 'Oct 22, 2024', dueDate: 'Nov 05, 2024', amount: 5050, status: 'draft', paymentMethod: 'Pending Signoff' },
]

const statuses = ['paid', 'paid', 'pending', 'paid', 'paid', 'pending', 'paid', 'paid', 'overdue', 'paid', 'pending', 'paid', 'paid', 'paid', 'pending', 'paid', 'paid', 'paid', 'pending', 'paid', 'paid', 'paid', 'pending', 'paid', 'paid', 'overdue', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid']
const generated = Array.from({ length: 37 }, (_, index) => {
  const n = 84 - index
  const client = clients[index % clients.length]
  const status = statuses[index]
  return {
    id: `inv-${String(n).padStart(3, '0')}`,
    number: `INV-2024-${String(n).padStart(3, '0')}`,
    client,
    project: ['Platform Retainer', 'Growth Site Optimisation', 'Infrastructure Runbook', 'Commerce Operations'][index % 4],
    issueDate: `Oct ${(index % 25) + 1}, 2024`,
    dueDate: `Oct ${(index % 27) + 1}, 2024`,
    amount: 4000 + ((index * 1850) % 28000),
    status,
    daysOverdue: status === 'overdue' ? 2 : 0,
    paymentMethod: status === 'paid' ? 'Wire Transfer' : status === 'pending' ? 'Net 15' : 'Pending Signoff',
  }
})

let DB = [...seeded, ...generated]

export async function mockFetchInvoices(params = {}) {
  await delay(250)
  const { page = 1, perPage = 5, search = '', status = 'all', client = 'all', dateRange = 'all' } = params
  const q = search.trim().toLowerCase()
  const items = DB.filter((invoice) => {
    if (status !== 'all' && invoice.status !== status) return false
    if (client !== 'all' && String(invoice.client.id) !== String(client)) return false
    if (dateRange === 'oct_2024' && !invoice.issueDate.includes('Oct')) return false
    return (
      !q ||
      [invoice.number, invoice.client.name, invoice.client.contact ?? '', invoice.project].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  })
  return { items: structuredClone(items.slice((page - 1) * perPage, page * perPage)), meta: { total: items.length, page, perPage } }
}

export async function mockFetchInvoiceFacets() {
  await delay(140)
  return {
    total: DB.length,
    statuses: ['overdue', 'pending', 'paid', 'draft'].map((value) => ({ value, count: DB.filter((invoice) => invoice.status === value).length })),
    clients: clients.map(({ id, name }) => ({ value: String(id), label: name })),
    dateRanges: [
      { value: 'all', label: 'All dates' },
      { value: 'oct_2024', label: 'Oct 1 – Oct 31, 2024' },
    ],
  }
}

export async function mockFetchInvoiceStats() {
  await delay(140)
  const sum = (rows) => rows.reduce((t, i) => t + i.amount, 0)
  return {
    total: DB.length,
    outstanding: sum(DB.filter((i) => i.status === 'pending' || i.status === 'overdue')),
    paidThisMonth: sum(DB.filter((i) => i.status === 'paid')),
    overdue: DB.filter((i) => i.status === 'overdue').length,
  }
}

export async function mockCreateInvoice(payload) {
  await delay(280)
  const totals = calculateInvoiceTotals(payload)
  const match = clients.find((c) => c.email.toLowerCase() === payload.client.email.toLowerCase())
  const client = {
    id: match?.id ?? null,
    name: payload.client.company || payload.client.name,
    contact: payload.client.name,
    email: payload.client.email,
    address: payload.client.address,
  }
  const number = `INV-2024-${String(90 + DB.length).padStart(3, '0')}`
  const displayDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
  const record = {
    id: `inv-${Date.now()}`,
    number,
    client,
    project: payload.lineItems[0].description, // search still matches on this field
    issueDate: displayDate(payload.issueDate),
    dueDate: displayDate(payload.dueDate),
    amount: totals.total,
    status: payload.status,
    daysOverdue: 0,
    paymentMethod: payload.paymentMethod,
    paymentTerms: payload.paymentTerms,
    lineItems: payload.lineItems,
    discountPercent: payload.discountPercent,
    taxPercent: payload.taxPercent,
    paymentInstructions: payload.paymentInstructions,
    notes: payload.notes,
    createdAt: displayDate(payload.issueDate),
  }
  DB = [record, ...DB]
  return structuredClone(record)
}

export async function mockFetchInvoiceDetail(id) {
  await delay(150)
  const inv = DB.find((i) => i.id === id)
  if (!inv) return null
  const created = Boolean(inv.lineItems)
  // Seeded rows have no line items: show the invoice as a single line
  const lineItems = inv.lineItems ?? [{ description: inv.project, quantity: 1, unitPrice: inv.amount }]
  const totals = created
    ? calculateInvoiceTotals({ lineItems, discountPercent: inv.discountPercent, taxPercent: inv.taxPercent })
    : { subtotal: inv.amount, discount: 0, tax: 0, total: inv.amount }
  return structuredClone({
    lineItems,
    totals,
    address: inv.client.address ?? null,
    paymentMethod: inv.paymentMethod,
    paymentTerms: inv.paymentTerms ?? null,
    instructions: inv.paymentInstructions ?? null,
    notes: inv.notes ?? null,
  })
}