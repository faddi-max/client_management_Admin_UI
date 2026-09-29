const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const COLUMNS = [
  ['Company', (c) => c.name],
  ['Domain', (c) => c.domain],
  ['Industry', (c) => c.industry],
  ['Contact', (c) => c.contact?.name],
  ['Email', (c) => c.contact?.email],
  ['Phone', (c) => c.contact?.phone],
  ['MRR', (c) => c.billing?.mrr],
  ['Status', (c) => c.status],
  ['Account Lead', (c) => c.lead?.name],
]

export function downloadClientsCsv(clients, filename = 'clients.csv') {
  const lines = [COLUMNS.map(([h]) => h).join(',')].concat(
    clients.map((c) => COLUMNS.map(([, get]) => esc(get(c))).join(','))
  )
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}