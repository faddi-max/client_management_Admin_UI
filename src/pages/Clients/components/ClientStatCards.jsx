import { Building2, BadgeCheck, Banknote, TrendingUp } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import { formatCurrency } from '@/utils'

const money = (n) => formatCurrency(n).replace(/\.00$/, '')

// Module-level so it isn't re-created on every render
function OrangeDot({ className }) {
  return <span className={`block h-2.5 w-2.5 rounded-full bg-orange-400 ${className ?? ''}`} />
}

export default function ClientStatCards({ stats, activeKey, onSelect }) {
  const { totalDirectory, activeRetainers, mrrBurn, attention } = stats

  return (
    <div className="grid grid-cols-1 min-[560px]:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={Building2}
        iconClassName="text-primary-500"
        label="Total Directory"
        glow="indigo"
        active={activeKey === 'directory'}
        onClick={() => onSelect('directory')}
        value={
          <span className="flex items-center gap-2">
            {totalDirectory.value}
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
              <TrendingUp size={11} /> {totalDirectory.trendLabel}
            </span>
          </span>
        }
      >
        <p className="text-xs text-neutral-500">{totalDirectory.note}</p>
      </StatCard>

      <StatCard
        icon={BadgeCheck}
        iconClassName="text-green-500"
        label="Active Retainers"
        glow="green"
        active={activeKey === 'retainers'}
        onClick={() => onSelect('retainers')}
        value={
          <span className="flex items-baseline gap-2">
            {activeRetainers.value}
            <span className="font-mono text-xs font-medium text-neutral-500">
              {activeRetainers.slaPercent}% SLA
            </span>
          </span>
        }
      >
        <div
          role="progressbar"
          aria-valuenow={activeRetainers.slaPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
        >
          <div
            className="h-full rounded-full bg-primary-600"
            style={{ width: `${activeRetainers.slaPercent}%` }}
          />
        </div>
      </StatCard>

      <StatCard
        icon={Banknote}
        iconClassName="text-primary-500"
        label="Monthly MRR Burn"
        glow="indigo"
        active={activeKey === 'mrr'}
        onClick={() => onSelect('mrr')}
        value={
          <span className="flex items-baseline gap-1.5">
            {money(mrrBurn.value)}
            <span className="text-sm font-medium text-neutral-500">/ month</span>
          </span>
        }
      >
        <p className="font-mono text-xs text-neutral-500">{money(mrrBurn.unbilledWip)} unbilled WIP</p>
      </StatCard>

      <StatCard
        icon={OrangeDot}
        label="Attention Required"
        glow="orange"
        active={activeKey === 'attention'}
        onClick={() => onSelect('attention')}
        value={
          <span className="flex items-center gap-2">
            <span className="text-orange-500">{attention.value}</span>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
              Action items pending
            </span>
          </span>
        }
      >
        <p className="text-xs text-neutral-500">{attention.note}</p>
      </StatCard>
    </div>
  )
}