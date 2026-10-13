import { KeyRound, Clock, Eye, ShieldCheck } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import Card from '@/components/common/Card'

const GRID = 'grid grid-cols-1 min-[560px]:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'
const CHIP = 'rounded px-2 py-0.5 font-mono text-[11px] font-semibold'
const ROW = 'flex items-end justify-between gap-3'

function StatsSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} padding="p-3.5 sm:p-4" className="h-[104px] animate-pulse">
          <div className="h-2.5 w-24 rounded bg-neutral-100" />
          <div className="mt-4 h-8 w-16 rounded bg-neutral-100" />
        </Card>
      ))}
    </div>
  )
}

export default function CredentialStatCards({ stats, loading, error, onRetry }) {
  if (loading && !stats) return <StatsSkeleton />

  // Only replace the cards when there is nothing to show (a failed background refresh keeps old numbers)
  if (!stats) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-red-500">{error ? 'Could not load vault stats.' : 'No vault stats available.'}</p>
        <button type="button" onClick={onRetry} className="mt-2 text-xs font-semibold text-primary-600 hover:underline">
          Try again
        </button>
      </Card>
    )
  }

  const { totalKeys, pendingRotations, accessAudits, integrity } = stats
  const healthy = integrity.status === 'optimal'

  return (
    <div className={GRID}>
      <StatCard
        icon={KeyRound}
        iconClassName="text-neutral-500"
        label="Total Encrypted Keys"
        valueClassName="text-3xl font-extrabold"
        value={
          <span className={ROW}>
            {totalKeys.value}
            <span className={`${CHIP} bg-green-100 text-green-700`}>{totalKeys.syncedPercent}% Synced</span>
          </span>
        }
      />
      <StatCard
        icon={Clock}
        iconClassName="text-orange-500"
        label="Pending Rotations"
        valueClassName="text-3xl font-extrabold"
        value={
          <span className={ROW}>
            {pendingRotations.value}
            <span className={`${CHIP} bg-orange-100 text-orange-800`}>&gt;{pendingRotations.staleDays} Days Stale</span>
          </span>
        }
      />
      <StatCard
        icon={Eye}
        iconClassName="text-neutral-500"
        label="Access Audits Today"
        valueClassName="text-3xl font-extrabold"
        value={
          <span className={ROW}>
            {accessAudits.value}
            <span className={`${CHIP} bg-indigo-50 text-neutral-500`}>{accessAudits.sessions} Sessions</span>
          </span>
        }
      />
      <StatCard
        icon={ShieldCheck}
        iconClassName="fill-primary-600 text-white"
        label="Vault Integrity Score"
        valueClassName="text-3xl font-extrabold"
        value={
          <span className={ROW}>
            <span className="text-primary-700">{integrity.percent}%</span>
            <span className={`font-mono text-xs font-semibold ${healthy ? 'text-primary-600' : 'text-orange-500'}`}>
              ● {healthy ? 'Optimal' : 'Degraded'}
            </span>
          </span>
        }
      />
    </div>
  )
}