import Checkbox from './Checkbox'
import { cn } from '@/utils'

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' }

const VARIANTS = {
  default: {
    headRow: 'border-b border-neutral-200 bg-neutral-50',
    th: 'px-4 py-3 text-xs tracking-wide text-neutral-500',
    row: 'border-b border-neutral-100 hover:bg-neutral-50 transition-colors',
    td: 'px-4 py-3 text-neutral-700',
  },
  soft: {
    headRow: 'bg-indigo-50',
    th: 'px-4 py-3.5 text-[11px] tracking-wider text-neutral-500 whitespace-nowrap',
    row: 'border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors',
    td: 'px-4 py-3.5 text-neutral-700',
  },
}

/**
 * columns: [{ key, header, render?, align?: 'left'|'center'|'right', className?, headerClassName? }]
 * selectable + selectedIds + onSelectionChange(ids) enable row checkboxes.
 * rowClassName: string | (row) => string — extra classes per row (e.g. tint a blocked row).
 *   Every row also carries `group`, so cells can use group-hover:* styles.
 */
export default function Table({
  columns = [],
  rows = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No records found.',
  variant = 'default',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  rowKey = 'id',
  rowClassName,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.default
  const colSpan = columns.length + (selectable ? 1 : 0)
  const ids = rows.map((r) => r[rowKey])
  const allSelected = ids.length > 0 && ids.every((id) => selectedIds.includes(id))
  const someSelected = !allSelected && ids.some((id) => selectedIds.includes(id))

  const toggleAll = () =>
    onSelectionChange?.(
      allSelected ? selectedIds.filter((id) => !ids.includes(id)) : [...new Set([...selectedIds, ...ids])]
    )
  const toggleOne = (id) =>
    onSelectionChange?.(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])

  const initialLoading = loading && rows.length === 0
  const refreshing = loading && rows.length > 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={v.headRow}>
            {selectable && (
              <th className="w-14 py-3.5 pl-5 pr-0">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'font-semibold uppercase',
                  v.th,
                  ALIGN[col.align] ?? ALIGN.left,
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn(refreshing && 'opacity-60 transition-opacity')}>
          {initialLoading ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center text-neutral-400">
                <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center">
                <p className="text-sm text-red-500">Something went wrong while loading data.</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                  >
                    Try again
                  </button>
                )}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center text-neutral-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => {
              const id = row[rowKey] ?? rowIdx
              const selected = selectedIds.includes(id)
              return (
                <tr
                  key={id}
                  className={cn(
                    v.row,
                    'group',
                    selected && 'bg-indigo-50/40',
                    typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
                  )}
                >
                  {selectable && (
                    <td className="w-14 py-3.5 pl-5 pr-0">
                      <Checkbox checked={selected} onChange={() => toggleOne(id)} aria-label="Select row" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(v.td, 'align-middle', ALIGN[col.align] ?? ALIGN.left, col.className)}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}