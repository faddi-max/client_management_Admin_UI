const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const ago = (mins) => new Date(Date.now() - mins * 60000).toISOString()

let DB = [
  {
    id: 1, code: 'REQ-1792738662482', title: 'Customer Account Management',
    description: 'I want you to manage my customer account.',
    clientName: 'Hasan Mirza', companyName: 'HyperScale AI', projectName: 'Customer Portal v2', salesperson: 'Marcus',
    attachments: [{ id: 'seed-1', name: 'reference.png', size: 184320, type: 'image/png' }],
    updatedAt: ago(60 * 5),
  },
]

const pick = (p) => ({
  title: p.title, description: p.description, clientName: p.clientName, companyName: p.companyName,
  projectName: p.projectName, salesperson: p.salesperson, attachments: p.attachments ?? [],
})

export async function mockFetchRequirements(params = {}) {
  await delay(300)
  const { page = 1, perPage = 10 } = params
  const rows = [...DB].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  return {
    items: structuredClone(rows.slice((page - 1) * perPage, page * perPage)),
    meta: { total: rows.length, page, perPage },
  }
}

export async function mockCreateRequirement(payload) {
  await delay(250)
  const now = Date.now()
  const record = { id: now, code: `REQ-${now}`, ...pick(payload), updatedAt: new Date(now).toISOString() }
  DB = [record, ...DB]
  return structuredClone(record)
}

export async function mockUpdateRequirement(id, payload) {
  await delay(250)
  const i = DB.findIndex((r) => String(r.id) === String(id))
  if (i === -1) throw new Error('Requirement not found')
  DB[i] = { ...DB[i], ...pick(payload), updatedAt: new Date().toISOString() }
  return structuredClone(DB[i])
}

export async function mockDeleteRequirement(id) {
  await delay(200)
  if (!DB.some((r) => String(r.id) === String(id))) throw new Error('Requirement not found')
  DB = DB.filter((r) => String(r.id) !== String(id))
}