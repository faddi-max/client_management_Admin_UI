import { Globe, Server, AlertTriangle } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import Card from '@/components/common/Card'
import { formatCurrency } from '@/utils'

const money = (n) => formatCurrency(n).replace(/\.00$/, '')

const GRID = 'grid grid-cols-1 min-[560px]:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'
const FOOT = 'flex items-center justify-between gap-3 text-xs text-neutral-500'
const MONO = 'font-mono text-xs text-neutral-500'

function StatsSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} padding="p-3.5 sm:p-4" className="h-[120px] animate-pulse">
          <div className="h-2.5 w-24 rounded bg-neutral-100" />
          <div className="mt-4 h-7 w-28 rounded bg-neutral-100" />
          <div className="mt-3 h-2.5 w-40 rounded bg-neutral-100" />
        </Card>
      ))}
    </div>
  )
}

function Dot({ className }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${className}`} />
}

export default function DomainStatCards({ stats, loading, error, onRetry }) {
  if (loading && !stats) return <StatsSkeleton />

  // Only replace the cards when there is nothing to show (a failed background refresh keeps old numbers)
  if (!stats) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-red-500">{error ? 'Could not load infrastructure stats.' : 'No infrastructure stats available.'}</p>
        <button type="button" onClick={onRetry} className="mt-2 text-xs font-semibold text-primary-600 hover:underline">
          Try again
        </button>
      </Card>
    )
  }

  const { domains, servers, annualBurn, actionRequired } = stats

  return (
    <div className={GRID}>
      <StatCard
        icon={Globe}
        iconClassName="text-primary-600"
        iconWrapperClassName="bg-indigo-50"
        label="Total Active Domains"
        value={`${domains.value} Domains`}
      >
        <div className={FOOT}>
          <span className="flex items-center gap-1.5">
            <Dot className="bg-green-500" /> {domains.healthy} Healthy &amp; Active
          </span>
          <span className="font-semibold text-orange-500">{domains.expiringSoon} Expiring &lt;30d</span>
        </div>
      </StatCard>

      <StatCard
        icon={Server}
        iconClassName="text-primary-600"
        iconWrapperClassName="bg-indigo-50"
        label="Hosting Instances & Clusters"
        value={`${servers.value} Servers`}
      >
        <div className={FOOT}>
          <span className="flex items-center gap-1.5">
            <Dot className="bg-green-500" /> {servers.uptimePercent}% Aggregate Uptime
          </span>
          <span className={MONO}>{servers.critical} Critical</span>
        </div>
      </StatCard>

      <StatCard
        className="relative"
        label="Annual Infrastructure Burn"
        value={formatCurrency(annualBurn.value)}
      >
        <span className="absolute right-3.5 top-3.5 rounded-md bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-teal-700">
          +{annualBurn.marginPercent}% Margin
        </span>
        <div className={FOOT}>
          <span>
            Billed: <span className="font-bold text-neutral-900">{formatCurrency(annualBurn.billed)}</span>
          </span>
          <span className="font-semibold text-green-600">+{money(annualBurn.profit)} Profit</span>
        </div>
      </StatCard>

      <StatCard
        icon={AlertTriangle}
        iconClassName="text-orange-500"
        iconWrapperClassName="bg-orange-100"
        className="border-t-4 border-t-orange-500"
        label={<span className="text-orange-600">Action Required</span>}
        value={`${actionRequired.expiring} Domains Expiring`}
      >
        <div className={FOOT}>
          <span className="font-semibold text-orange-500">{actionRequired.autoRenewOff} Auto-renew off</span>
          <span className={MONO}>{actionRequired.glueRecordErrors} Glue Rec err</span>
        </div>
      </StatCard>
    </div>
  )
}