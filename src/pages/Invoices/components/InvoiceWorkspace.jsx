import { useEffect, useMemo, useRef, useState } from 'react'
import { BellRing, CalendarDays, ChevronDown, ExternalLink, FileText, MoreVertical, Printer, Search, Send, Share2, SlidersHorizontal, X } from 'lucide-react'
import Card from '@/components/common/Card'
import Checkbox from '@/components/common/Checkbox'
import useResourceList from '@/hooks/useResourceList'
import { cn } from '@/utils'
import { fetchInvoiceFacets, fetchInvoices } from '@/services/api/invoicesService'

const statusMeta = {
  overdue: { label: 'Overdue', tone: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  pending: { label: 'Sent', tone: 'bg-indigo-100 text-primary-700', dot: 'bg-primary-600' },
  paid: { label: 'Paid', tone: 'bg-indigo-50 text-neutral-700', dot: 'bg-neutral-500' },
  draft: { label: 'Draft', tone: 'bg-indigo-50 text-neutral-600', dot: 'bg-neutral-400' },
}

const tabs = [
  { value: 'all', label: 'All' }, { value: 'overdue', label: 'Overdue' }, { value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }, { value: 'draft', label: 'Draft' },
]

const INITIAL_FACETS = {
  total: 42, overdue: 3, pending: 7, paid: 31, draft: 1,
  clients: [],
  dateRanges: [{ value: 'all', label: 'All dates' }, { value: 'oct_2024', label: 'Oct 1 – Oct 31, 2024' }],
}

const money = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

function StatusBadge({ status }) {
  const meta = statusMeta[status]
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', meta.tone)}><span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />{meta.label}</span>
}

function InvoiceTable({ list, selectedId, onSelect }) {
  const { items, loading, error, refetch, meta } = list
  const [checked, setChecked] = useState([])
  const allChecked = items.length > 0 && items.every((invoice) => checked.includes(invoice.id))
  const toggleAll = () => setChecked(allChecked ? [] : items.map((invoice) => invoice.id))
  const toggle = (id) => setChecked((ids) => ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id])
  const pages = Math.max(1, Math.ceil(meta.total / meta.perPage))

  return (
    <Card padding="p-0" className="min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Checkbox checked={allChecked} onChange={toggleAll} aria-label="Select all invoices" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Invoices ({items.length} of {meta.total} shown)</span>
        </div>
        <span className="text-xs text-neutral-500">Sorted by: <span className="font-medium text-neutral-700">Due Date (Asc)</span></span>
      </div>
      <div className="min-h-[390px] overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-indigo-50">
            <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              <th className="w-10 px-4 py-3" />
              <th className="px-2 py-3">Invoice #</th><th className="px-4 py-3">Client &amp; Project</th><th className="px-4 py-3">Issue / Due</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className={cn(loading && items.length > 0 && 'opacity-60 transition-opacity duration-150')}>
            {loading && items.length === 0 && <tr><td colSpan="7" className="py-16 text-center"><span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /></td></tr>}
            {error && <tr><td colSpan="7" className="py-12 text-center text-sm text-red-500">Could not load invoices. <button type="button" onClick={refetch} className="font-semibold text-primary-600 hover:underline">Retry</button></td></tr>}
            {!error && items.map((invoice) => {
              const selected = invoice.id === selectedId
              return <tr key={invoice.id} onClick={() => onSelect(invoice.id)} className={cn('cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50', selected && 'bg-indigo-50/80')}>
                <td className="px-4 py-3"><Checkbox checked={checked.includes(invoice.id)} onChange={() => toggle(invoice.id)} onClick={(event) => event.stopPropagation()} aria-label={`Select ${invoice.number}`} /></td>
                <td className="px-2 py-3"><div className="flex items-start gap-1.5"><span className={cn('mt-1.5 h-2 w-2 rounded-full', statusMeta[invoice.status].dot)} /><div><p className="font-mono text-xs font-bold text-primary-700">{invoice.number}</p>{invoice.status === 'overdue' && <p className="text-[11px] text-orange-600">overdue {invoice.daysOverdue}d</p>}</div></div></td>
                <td className="px-4 py-3"><p className="font-semibold text-neutral-900">{invoice.client.name}</p><p className="mt-0.5 text-xs text-neutral-500">{invoice.project}</p></td>
                <td className="px-4 py-3"><p className="text-xs font-medium text-neutral-800">{invoice.issueDate}</p><p className={cn('mt-0.5 font-mono text-[11px]', invoice.status === 'overdue' ? 'text-orange-600' : 'text-neutral-500')}>{invoice.dueDate}</p></td>
                <td className="px-4 py-3 text-right"><p className="font-bold text-neutral-900">{money(invoice.amount)}</p><p className="mt-0.5 text-[11px] text-neutral-500">{invoice.paymentMethod}</p></td>
                <td className="px-4 py-3"><StatusBadge status={invoice.status} /></td>
                <td className="px-4 py-3"><div className="flex items-center justify-center gap-2 text-primary-600">{invoice.status === 'overdue' && <BellRing size={16} />}<button type="button" onClick={(event) => { event.stopPropagation(); onSelect(invoice.id) }} className="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-neutral-100 hover:bg-indigo-50" aria-label={`Open ${invoice.number}`}><ExternalLink size={15} /></button>{invoice.status !== 'overdue' && <MoreVertical size={16} />}</div></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-neutral-500">
        <p>Showing <span className="font-semibold text-neutral-900">{(meta.page - 1) * meta.perPage + 1}–{Math.min(meta.page * meta.perPage, meta.total)}</span> of {meta.total} invoices <span className="text-neutral-300">•</span> Selection balance: <span className="font-bold text-neutral-900">$9,800.00</span></p>
        <nav className="flex items-center gap-1" aria-label="Invoice pagination"><button type="button" onClick={() => list.setPage(meta.page - 1)} disabled={meta.page === 1} className="rounded bg-indigo-50 px-2 py-1.5 disabled:opacity-40">Previous</button>{Array.from({ length: Math.min(pages, 3) }, (_, index) => index + 1).map((page) => <button type="button" key={page} onClick={() => list.setPage(page)} className={cn('h-7 w-7 rounded', page === meta.page ? 'bg-primary-600 font-bold text-white' : 'text-primary-700 hover:bg-indigo-50')}>{page}</button>)}<span className="px-1">…</span><button type="button" onClick={() => list.setPage(meta.page + 1)} disabled={meta.page === pages} className="rounded bg-indigo-50 px-2 py-1.5 disabled:opacity-40">Next</button></nav>
      </div>
    </Card>
  )
}

function InvoiceDetail({ invoice, onClose, showToast }) {
  if (!invoice) return null
  const overdue = invoice.status === 'overdue'
  return <Card padding="p-0" className="min-w-0 overflow-hidden">
    <header className="flex items-start justify-between gap-3 bg-indigo-50 px-5 py-3.5"><div><h2 className="font-mono text-lg font-bold text-neutral-900">{invoice.number} {overdue && <span className="ml-1 rounded-full bg-orange-500 px-2 py-1 align-middle font-sans text-[10px] font-bold text-white">OVERDUE {invoice.daysOverdue} DAYS</span>}</h2><p className="mt-0.5 text-xs text-neutral-500">Created {invoice.createdAt ?? invoice.issueDate}</p></div><div className="flex items-center gap-3 text-neutral-500"><button type="button" onClick={() => showToast('Print is not wired yet')} aria-label="Print invoice"><Printer size={16} /></button><button type="button" onClick={() => showToast('Share is not wired yet')} aria-label="Share invoice"><Share2 size={16} /></button><button type="button" onClick={() => showToast('Invoice export is not wired yet')} aria-label="Export invoice"><FileText size={16} /></button><button type="button" onClick={onClose} aria-label="Close invoice detail"><X size={17} /></button></div></header>
    {overdue && <div className="bg-orange-100/80 px-5 py-4"><p className="font-semibold text-orange-950">✉ Payment past due ({money(invoice.amount)})</p><p className="mt-0.5 text-xs text-orange-900">Client {invoice.client.contact} opened the invoice 2 days ago.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => showToast('Payment reminder queued')} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white"><Send size={14} /> Send WhatsApp / Email Reminder</button><button type="button" onClick={() => showToast('Record payment is not wired yet')} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm">Record Payment</button></div></div>}
    <div className="space-y-6 p-5"><div className="grid grid-cols-2 gap-8"><div><p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">From (Issuer)</p><p className="mt-1 flex items-center gap-2 font-bold text-neutral-900"><span className="flex h-6 w-6 items-center justify-center rounded bg-primary-600 text-xs text-white">K</span>Kinetic Studios NY</p><p className="mt-1 text-xs leading-5 text-neutral-500">EIN: 12-8941092<br />billing@kineticops.io<br />447 Broadway, 2nd Fl, New York, NY 10013</p></div><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Billed To (Client)</p><p className="mt-2 font-bold text-neutral-900">{invoice.client.name} Inc.</p><p className="mt-1 text-xs leading-5 text-neutral-500">Attn: {invoice.client.contact}, VP Engineering<br />{invoice.client.email}<br />100 Wall Street, 14th Fl, New York, NY</p></div></div><div className="grid grid-cols-4 gap-3 rounded-xl bg-indigo-50 p-3 text-xs"><div><p className="text-[9px] font-bold uppercase text-neutral-500">Issue Date</p><p className="mt-1 font-medium">{invoice.issueDate}</p></div><div><p className="text-[9px] font-bold uppercase text-neutral-500">Due Date</p><p className={cn('mt-1 font-medium', overdue && 'text-orange-600')}>{invoice.dueDate}</p></div><div><p className="text-[9px] font-bold uppercase text-neutral-500">Contract Ref</p><p className="mt-1 font-mono">CTR-NEX-084</p></div><div><p className="text-[9px] font-bold uppercase text-neutral-500">Payment Terms</p><p className="mt-1 font-medium">{invoice.paymentMethod}</p></div></div><div><p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Itemized Milestone Deliverables</p><div className="mt-3 rounded-lg border border-neutral-100 p-3 text-sm"><div className="flex justify-between gap-4"><span>{invoice.project}</span><span className="font-semibold">{money(invoice.amount)}</span></div></div></div></div>
  </Card>
}

export default function InvoiceWorkspace({ showToast, refreshKey = 0 }) {
  const list = useResourceList(fetchInvoices, { perPage: 5, initialParams: { status: 'all' } })
  const handledRefreshKey = useRef(refreshKey)
  const [selectedId, setSelectedId] = useState('inv-089')
  const [detailOpen, setDetailOpen] = useState(true)
  const [invoiceFacets, setInvoiceFacets] = useState(INITIAL_FACETS)
  useEffect(() => {
    let cancelled = false
    fetchInvoiceFacets().then((data) => {
      if (!cancelled) setInvoiceFacets({
        total: data.total,
        ...Object.fromEntries(data.statuses.map(({ value, count }) => [value, count])),
        clients: data.clients ?? [],
        dateRanges: data.dateRanges ?? INITIAL_FACETS.dateRanges,
      })
    }).catch(() => {})
    return () => { cancelled = true }
  }, [refreshKey])
  useEffect(() => {
    if (refreshKey === handledRefreshKey.current) return
    handledRefreshKey.current = refreshKey
    const timer = setTimeout(() => list.refetch(), 0)
    return () => clearTimeout(timer)
  }, [refreshKey, list.refetch])
  const selected = useMemo(() => list.items.find((invoice) => invoice.id === selectedId) ?? list.items[0] ?? null, [list.items, selectedId])
  const workspaceStyle = {
    '--invoice-detail-width': detailOpen ? 'min(40%, 560px)' : '0px',
    '--invoice-detail-gap': detailOpen ? '1rem' : '0px',
  }

  return (
    <section className="space-y-6">
      <Card padding="p-3" className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full max-w-[512px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input value={list.searchInput} onChange={(event) => list.setSearchInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') list.setSearchInput('') }} placeholder="Search invoices, clients, or projects" className="h-8 w-full rounded-lg bg-indigo-50 py-1.5 pl-9 pr-10 text-xs font-medium text-primary-900 outline-none ring-1 ring-transparent transition focus:ring-primary-300" />
          {list.searchInput ? <button type="button" onClick={() => list.setSearchInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-primary-700 hover:bg-indigo-100" aria-label="Clear invoice search"><X size={13} /></button> : <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-indigo-100 px-1.5 py-1 font-mono text-[10px] text-primary-700">Esc</kbd>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-indigo-50 p-0.5">{tabs.map((tab) => <button type="button" key={tab.value} onClick={() => list.setFilter('status', tab.value)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors', list.params.status === tab.value && 'bg-white font-semibold text-primary-800 shadow-sm')}>{tab.label} <span className="ml-0.5">({invoiceFacets[tab.value] ?? invoiceFacets.total})</span></button>)}</div>
          <label className="relative inline-flex items-center rounded-lg bg-indigo-50 text-xs font-medium text-neutral-800"><SlidersHorizontal size={14} className="pointer-events-none ml-3" /><select value={list.params.client ?? 'all'} onChange={(event) => list.setFilter('client', event.target.value)} className="h-8 cursor-pointer appearance-none bg-transparent py-1.5 pl-2 pr-8 outline-none"><option value="all">All Clients</option>{invoiceFacets.clients.map((client) => <option key={client.value} value={client.value}>{client.label}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2" /></label>
          <label className="relative inline-flex items-center rounded-lg bg-indigo-50 text-xs font-medium text-neutral-800"><CalendarDays size={14} className="pointer-events-none ml-3" /><select value={list.params.dateRange ?? 'all'} onChange={(event) => list.setFilter('dateRange', event.target.value)} className="h-8 cursor-pointer appearance-none bg-transparent py-1.5 pl-2 pr-8 outline-none">{invoiceFacets.dateRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2" /></label>
        </div>
      </Card>

      <div className="flex min-w-0 flex-col gap-y-4 transition-[column-gap] duration-[360ms] ease-out xl:flex-row xl:[column-gap:var(--invoice-detail-gap)]" style={workspaceStyle}>
        <div className="min-w-0 flex-1">
          <InvoiceTable list={list} selectedId={selected?.id} onSelect={(id) => { setSelectedId(id); setDetailOpen(true) }} />
        </div>
        <div className={cn('w-full min-w-0 overflow-hidden transition-[width,max-height,opacity,transform] duration-[360ms] ease-out xl:w-[var(--invoice-detail-width)]', detailOpen ? 'max-h-[1200px] translate-x-0 opacity-100' : 'pointer-events-none max-h-0 translate-x-4 opacity-0')}>
          <div className="w-full xl:w-[560px]">
            <InvoiceDetail invoice={selected} onClose={() => setDetailOpen(false)} showToast={showToast} />
          </div>
        </div>
      </div>
    </section>
  )
}
