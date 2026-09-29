import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export function getPageItems(current, total) {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '…', total]
  if (current >= total - 2) return [1, '…', total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export default function Pagination({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50],
  itemLabel = 'items',
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = total === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  const arrow =
    'flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:text-neutral-300'

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-neutral-600">
        <p>
          Showing <span className="font-semibold text-neutral-900">{start}–{end}</span> of{' '}
          <span className="font-semibold text-neutral-900">{total}</span> {itemLabel}
        </p>
        <label className="flex items-center gap-2">
          Per page:
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="h-8 cursor-pointer rounded-md bg-indigo-50 px-2 text-[13px] font-semibold text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={arrow}>
          <ChevronLeft size={16} />
        </button>

        {getPageItems(page, totalPages).map((item, i) =>
          item === '…' ? (
            <span key={`gap-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-neutral-400">…</span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                item === page ? 'bg-primary-600 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {item}
            </button>
          )
        )}

        <button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={arrow}>
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}