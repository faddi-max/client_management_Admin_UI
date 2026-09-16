import { Mail } from 'lucide-react'
import Card from '@/components/common/Card'
import DataTable from '@/components/common/DataTable'
import Badge from '@/components/common/Badge'

const columns = [
  { key: 'asset', label: 'Asset / Domain' },
  { key: 'client', label: 'Client' },
  { key: 'type', label: 'Type', render: (row) => <Badge variant="primary">{row.type}</Badge> },
  {
    key: 'renewalDate',
    label: 'Renewal Date',
    render: (row) => (row.dueToday ? <Badge variant="warning">Due Today</Badge> : row.renewalDate),
  },
  { key: 'annualCost', label: 'Annual Cost' },
]

export default function RenewalsTable({ totalCount, dueWithinDays, rows = [], onViewAll }) {
  return (
    <Card padding="p-0">
      <div className="flex items-center justify-between p-5 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-primary-600" />
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Upcoming Renewals Tracker</h2>
            <p className="text-xs text-neutral-400">
              {totalCount} critical infrastructure accounts due within {dueWithinDays} days
            </p>
          </div>
        </div>
        <button type="button" onClick={onViewAll} className="text-xs font-semibold text-primary-600 hover:underline active:opacity-70 cursor-pointer">
          View all {totalCount} &rarr;
        </button>
      </div>
      <DataTable columns={columns} rows={rows} />
    </Card>
  )
}