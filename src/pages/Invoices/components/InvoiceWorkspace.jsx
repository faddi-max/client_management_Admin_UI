import { useCallback, useEffect, useRef, useState } from 'react'
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Table from '@/components/common/DataTable'
import IconAction from '@/components/common/IconAction'
import useResourceList from '@/hooks/useResourceList'
import { cn, formatCurrency, getInitials } from '@/utils'
import { fetchInvoiceFacets, fetchInvoices } from '@/services/api/invoicesService'
import InvoicePdfPreview from './InvoicePdfPreview'
import { STATUS, PILL } from './invoicesUi'

const MENU_ITEMS = ['View PDF', 'Download PDF', 'WhatsApp', 'Gmail']
const CONTROL =
  'h-8 rounded-md border border-neutral-200 bg-white text-xs text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-400'

const DEFAULT_DATE_RANGES = [{ value: 'all', label: 'All dates' }]

/** Fixed-position menu so it is not clipped by the table's overflow container. */
function RowMenu({ invoice, onSelect }) {
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const close = useCallback(() => setPos(null), [])

  useEffect(() => {
    if (!pos) return
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      close()
    }
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [pos, close])

  const toggle = () => {
    if (pos) return close()
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }

  return (
    <>
      <span ref={btnRef} className="inline-flex">
        <IconAction icon={MoreHorizontal} label="More actions" onClick={toggle} />
      </span>
      {pos && (
        <ul
          ref={menuRef}
          role="menu"
          style={{ top: pos.top, right: pos.right }}
          className="fixed z-40 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {MENU_ITEMS.map((label) => (
            <li key={label}>
              <button
                type="button"
                role="menuitem"
                onClick={() => { close(); onSelect(label, invoice) }}
                className="w-full px-4 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function getColumns(act) {
  return [
    {
      key: 'number',
      header: 'Invoice Number',
      render: (i) => <span className="text-xs font-semibold text-primary-600">{i.number}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      render: (i) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
            {getInitials(i.client.contact)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-neutral-900">{i.client.contact}</p>
            <p className="truncate text-[10px] text-neutral-500">{i.client.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'issueDate', header: 'Issue Date', render: (i) => <span className="whitespace-nowrap text-xs text-neutral-600">{i.issueDate}</span> },
    { key: 'dueDate', header: 'Due Date', render: (i) => <span className="whitespace-nowrap text-xs text-neutral-600">{i.dueDate}</span> },
    { key: 'amount', header: 'Total Amount', render: (i) => <span className="text-xs font-semibold text-neutral-900">{formatCurrency(i.amount)}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (i) => {
        const s = STATUS[i.status] ?? STATUS.draft
        return <Badge variant={s.variant} className={PILL}>{s.label}</Badge>
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (i) => (
        <div className="flex items-center gap-0.5">
          <IconAction icon={Eye} label="View PDF" onClick={() => act('View PDF', i)} />
          <IconAction icon={Pencil} label="Edit invoice" onClick={() => act('Edit', i)} />
          <IconAction icon={Trash2} label="Delete invoice" onClick={() => act('Delete', i)} />
          <RowMenu invoice={i} onSelect={act} />
        </div>
      ),
    },
  ]
}

export default function InvoiceWorkspace({ showToast, refreshKey = 0 }) {
  const list = useResourceList(fetchInvoices, { perPage: 10, initialParams: { status: 'all', dateRange: 'all' } })
  const handledRefreshKey = useRef(refreshKey)
  const [facets, setFacets] = useState({ statuses: [], dateRanges: DEFAULT_DATE_RANGES })
  const [pdf, setPdf] = useState(null) // { invoice, print }

  useEffect(() => {
    let cancelled = false
    fetchInvoiceFacets()
      .then((d) => { if (!cancelled) setFacets({ statuses: d.statuses ?? [], dateRanges: d.dateRanges ?? DEFAULT_DATE_RANGES }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [refreshKey])

  useEffect(() => {
    if (refreshKey === handledRefreshKey.current) return
    handledRefreshKey.current = refreshKey
    const timer = setTimeout(() => list.refetch(), 0)
    return () => clearTimeout(timer)
  }, [refreshKey, list.refetch])

  const act = useCallback(
    (type, invoice) => {
      if (type === 'View PDF' || type === 'Download PDF') {
        setPdf({ invoice, print: type === 'Download PDF' })
        return
      }
      showToast(`${type} — ${invoice.number} (not wired yet)`)
    },
    [showToast]
  )
  const columns = getColumns(act)

  const { meta, params } = list
  const pages = Math.max(1, Math.ceil(meta.total / meta.perPage))
  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    ...facets.statuses.map((s) => ({ value: s.value, label: `${STATUS[s.value]?.label ?? s.value} (${s.count})` })),
  ]
  const pagerBtn =
    'rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:text-neutral-300'

  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="space-y-4 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">All invoices</h2>
            <p className="mt-0.5 text-xs text-neutral-500">Review and manage your client billing.</p>
          </div>
          <Badge variant="primary" className="!normal-case !tracking-normal !text-[10px] !font-semibold">
            {meta.total} {meta.total === 1 ? 'record' : 'records'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[190px]">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={list.searchInput}
              onChange={(e) => list.setSearchInput(e.target.value)}
              placeholder="Search invoice, client, company"
              aria-label="Search invoices"
              className={cn(CONTROL, 'w-full pl-8 pr-2 placeholder:text-neutral-400')}
            />
          </div>
          <select
            aria-label="Filter by status"
            value={params.status}
            onChange={(e) => list.setFilter('status', e.target.value)}
            className={cn(CONTROL, 'cursor-pointer px-2.5 font-medium')}
          >
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            aria-label="Filter by date range"
            value={params.dateRange}
            onChange={(e) => list.setFilter('dateRange', e.target.value)}
            className={cn(CONTROL, 'cursor-pointer px-2.5')}
          >
            {facets.dateRanges.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        rows={list.items}
        loading={list.loading}
        error={list.error}
        onRetry={list.refetch}
        emptyMessage="No invoices match your filters."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-3.5 text-xs text-neutral-500">
        <p>Showing {list.items.length} of {meta.total}</p>
        <nav aria-label="Invoice pagination" className="flex items-center gap-2">
          <button type="button" className={pagerBtn} disabled={meta.page <= 1} onClick={() => list.setPage(meta.page - 1)}>Previous</button>
          <button type="button" className={pagerBtn} disabled={meta.page >= pages} onClick={() => list.setPage(meta.page + 1)}>Next</button>
        </nav>
      </div>

      <InvoicePdfPreview
        open={Boolean(pdf)}
        invoice={pdf?.invoice}
        autoPrint={pdf?.print}
        onClose={() => setPdf(null)}
      />
    </Card>
  )
}