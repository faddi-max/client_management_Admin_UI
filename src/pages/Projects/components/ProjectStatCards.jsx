import { FolderOpen, ShieldCheck, MessageSquareText, AlertCircle, Banknote } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import { formatCurrency } from '@/utils'

const money = (n) => formatCurrency(n).replace(/\.00$/, '')
const compactK = (n) => `$${Math.round(n / 1000)}k`

const GRID = 'grid grid-cols-1 min-[560px]:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4'

function StatsSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 5 }, (_, i) => (
        <Card key={i} padding="p-3.5 sm:p-4" className="h-[120px] animate-pulse">
          <div className="h-2.5 w-24 rounded bg-neutral-100" />
          <div className="mt-4 h-7 w-16 rounded bg-neutral-100" />
          <div className="mt-3 h-2.5 w-32 rounded bg-neutral-100" />
        </Card>
      ))}
    </div>
  )
}

export default function ProjectStatCards({ stats, loading, error, onRetry }) {
  if (loading && !stats) return <StatsSkeleton />

  if (error || !stats) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-red-500">Could not load project stats.</p>
        <button type="button" onClick={onRetry} className="mt-2 text-xs font-semibold text-primary-600 hover:underline">
          Try again
        </button>
      </Card>
    )
  }

  const { activeTracks, onTrack, clientReview, blocked, pipeline } = stats

  return (
    <div className={GRID}>
      <StatCard
        icon={FolderOpen}
        iconClassName="text-primary-600"
        iconWrapperClassName="bg-indigo-50"
        label="Active Tracks"
        glow="indigo"
        value={activeTracks.value}
      >
        <p className="text-xs text-neutral-500">
          <span className="font-semibold text-primary-600">{activeTracks.accounts} accounts</span> in production
        </p>
      </StatCard>

      <StatCard
        icon={ShieldCheck}
        iconClassName="text-teal-600"
        iconWrapperClassName="bg-teal-50"
        label="On Track"
        value={onTrack.value}
      >
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="rounded-md bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-teal-700">
            {onTrack.velocityPercent}%
          </span>
          velocity steady
        </p>
      </StatCard>

      <StatCard
        icon={MessageSquareText}
        iconClassName="text-orange-500"
        iconWrapperClassName="bg-orange-50"
        label="Client Review"
        value={clientReview.value}
      >
        <p className="text-xs text-neutral-500">
          <span className="font-semibold text-orange-500">Avg {clientReview.avgResponseDays} days</span> response time
        </p>
      </StatCard>

      <StatCard
        icon={AlertCircle}
        iconClassName="text-red-600"
        iconWrapperClassName="bg-red-50"
        label="Blocked / Overdue"
        value={
          <span className="flex items-center gap-2">
            <span className="text-red-600">{blocked.value}</span>
            {blocked.urgent && <Badge variant="warning" className="!text-[10px]">Urgent Action</Badge>}
          </span>
        }
      >
        <p className="text-xs text-neutral-500">Requires PM escalation</p>
      </StatCard>

      <StatCard
        icon={Banknote}
        iconClassName="text-primary-600"
        iconWrapperClassName="bg-indigo-50"
        label="Pipeline Value"
        value={money(pipeline.value)}
      >
        <p className="text-xs text-neutral-500">
          <span className="font-mono">{compactK(pipeline.billed)} billed</span>{' '}
          <span className="font-semibold text-primary-600">({pipeline.billedPercent}%)</span>
        </p>
      </StatCard>
    </div>
  )
}