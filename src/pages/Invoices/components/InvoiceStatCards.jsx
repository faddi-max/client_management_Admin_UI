import Card from '@/components/common/Card'
import { formatCurrency } from '@/utils'

const GRID = 'grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 lg:grid-cols-4'

function StatsSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} padding="p-4" className="h-[96px] animate-pulse rounded-xl">
          <div className="h-2.5 w-20 rounded bg-neutral-100" />
          <div className="mt-3 h-6 w-24 rounded bg-neutral-100" />
          <div className="mt-3 h-2.5 w-28 rounded bg-neutral-100" />
        </Card>
      ))}
    </div>
  )
}

export default function InvoiceStatCards({ stats, loading, error, onRetry }) {
  if (loading && !stats) return <StatsSkeleton />

  if (!stats) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-red-500">{error ? 'Could not load invoice stats.' : 'No invoice stats available.'}</p>
        <button type="button" onClick={onRetry} className="mt-2 text-xs font-semibold text-primary-600 hover:underline">
          Try again
        </button>
      </Card>
    )
  }

  const cards = [
    { label: 'Total invoices', value: stats.total, note: 'This billing period' },
    { label: 'Outstanding', value: formatCurrency(stats.outstanding), note: 'Needs attention' },
    { label: 'Paid this month', value: formatCurrency(stats.paidThisMonth), note: 'On track' },
    { label: 'Overdue', value: stats.overdue, note: 'Follow up required' },
  ]

  return (
    <section className={GRID} aria-label="Invoice summary">
      {cards.map((c) => (
        <Card key={c.label} padding="p-4" className="rounded-xl border-neutral-200 shadow-sm">
          <p className="text-xs font-medium text-neutral-700">{c.label}</p>
          <p className="mt-2 text-xl font-bold leading-tight text-neutral-900">{c.value}</p>
          <p className="mt-1.5 text-[11px] text-neutral-400">{c.note}</p>
        </Card>
      ))}
    </section>
  )
}