export default function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm mx-1">
        <thead>
          <tr className="border-b bg-gray-200  border-neutral-100 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-neutral-700 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
