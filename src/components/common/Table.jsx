import { cn } from '@/utils'

/**
 * Table — generic data table shell.
 *
 * Usage:
 *   <Table columns={[{ key, header, render? }]} rows={data} />
 *
 * @param {Array<{ key: string, header: string, render?: (row) => ReactNode }>} columns
 * @param {Object[]} rows
 * @param {boolean}  loading
 * @param {string}   emptyMessage
 */
export default function Table({ columns = [], rows = [], loading = false, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-neutral-400">
                <span className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-neutral-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className={cn(
                  'border-b border-neutral-100',
                  'hover:bg-neutral-50 transition-colors'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-neutral-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
