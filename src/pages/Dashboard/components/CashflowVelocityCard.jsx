import { MoreVertical } from 'lucide-react'
import Card from '@/components/common/Card'
import ProgressBar from '@/components/common/ProgressBar'
import Sparkline from '@/components/common/Sparkline'

export default function CashflowVelocityCard({ subtitle, gross, segments, trend }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">Cashflow &amp; Collection Velocity</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-xs text-neutral-400">Gross</p>
            <p className="text-sm font-bold text-neutral-900">${gross.toLocaleString()}</p>
          </div>
          <MoreVertical size={16} className="text-neutral-300" />
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar segments={segments} />
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-indigo-50 p-3 sm:p-4">
        <div className="shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Trailing 6-Week Realization</p>
          <p className="mt-1 text-xl font-bold text-primary-600">+{trend.changePercent}%</p>
          <p className="text-xs text-neutral-400">vs prior period</p>
        </div>
        <div className="flex-1 min-w-0">
          <Sparkline data={trend.data} />
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">DSO Average</p>
          <p className="mt-1 text-sm font-bold text-neutral-900">{trend.dsoAverage} Days</p>
        </div>
      </div>
    </Card>
  )
}
