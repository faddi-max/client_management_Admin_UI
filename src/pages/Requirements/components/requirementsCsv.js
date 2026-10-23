const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const COLUMNS = [
  ['ID', (r) => r.code],
  ['Title', (r) => r.title],
  ['Description', (r) => r.description],
  ['Client Name', (r) => r.clientName],
  ['Company Name', (r) => r.companyName],
  ['Project Name', (r) => r.projectName],
  ['Salesperson', (r) => r.salesperson],
  ['Attachments', (r) => (r.attachments ?? []).map((a) => a.name).join('; ')],
  ['Updated At', (r) => r.updatedAt],
]

export function downloadRequirementsCsv(rows, filename = 'requirements.csv') {
  const lines = [COLUMNS.map(([h]) => h).join(',')].concat(
    rows.map((r) => COLUMNS.map(([, get]) => esc(get(r))).join(','))
  )
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}