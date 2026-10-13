import { AlertTriangle, BadgeDollarSign, Landmark, Timer } from 'lucide-react'
import Card from '@/components/common/Card'
import { cn } from '@/utils'

const STAT_CARDS = [
  {
    label: 'Total Invoiced', value: '$284,500', detail: '+14.2%', description: 'across 18 active contracts', icon: Landmark,
    progress: 'w-[84%]', progressTone: 'bg-primary-600', iconTone: 'text-primary-600', iconWrap: 'bg-indigo-50', accent: 'bg-indigo-50',
  },
  {
    label: 'Collected / Settled', value: '$221,450', detail: '77.8%', description: 'overall recovery rate', icon: BadgeDollarSign,
    progress: 'w-[78%]', progressTone: 'bg-primary-600', iconTone: 'text-neutral-600', iconWrap: 'bg-indigo-50', accent: 'bg-blue-50',
  },
  {
    label: 'Pending Payment', value: '$48,200', detail: '7 milestones', description: 'scheduled within 14d', icon: Timer,
    progress: 'w-[44%]', progressTone: 'bg-indigo-300', iconTone: 'text-primary-600', iconWrap: 'bg-indigo-50', accent: 'bg-violet-50',
  },
  {
    label: 'Overdue Balance', value: '$14,850', detail: '3 Client Accounts', description: 'Action required', icon: AlertTriangle,
    progress: 'w-full', progressTone: 'bg-orange-500', iconTone: 'text-orange-600', iconWrap: 'bg-orange-100', overdue: true,
  },
]

function CurrencyValue({ value, overdue }) {
  return (
    <p className={cn('absolute left-4 top-[62px] text-[30px] font-extrabold leading-none tracking-tight text-neutral-900', overdue && 'text-orange-500')}>
      {value}<span className={cn('text-base font-medium text-neutral-500', overdue && 'text-orange-700')}>.00</span>
    </p>
  )
}

export default function InvoiceStatCards() {
  return (
    <section className="grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 xl:grid-cols-4 xl:gap-4" aria-label="Invoice financial summary">
      {STAT_CARDS.map(({ label, value, detail, description, icon: Icon, progress, progressTone, iconTone, iconWrap, accent, overdue }) => (
        <Card
          key={label}
          padding="p-4"
          className={cn('relative h-[156px] overflow-hidden border-neutral-100 shadow-none', overdue && 'border-r-[8px] border-r-orange-500')}
        >
          {!overdue && <span className={cn('absolute -bottom-10 -right-9 h-[110px] w-[110px] rounded-full', accent)} aria-hidden="true" />}
          <div className="relative flex items-start justify-between gap-3">
            <p className={cn('pt-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500', overdue && 'text-orange-700')}>
              {label}
            </p>
            <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconWrap)}>
              <Icon size={16} className={iconTone} />
            </span>
          </div>
          <CurrencyValue value={value} overdue={overdue} />
          <p className={cn('absolute left-4 top-[99px] text-xs text-neutral-500', overdue && 'text-orange-700')}>
            <span className={cn('font-semibold', overdue ? 'rounded bg-orange-100 px-1.5 py-0.5 text-orange-700' : 'text-primary-700')}>
              {detail}
            </span>{' '}
            <span className={overdue ? 'font-medium' : ''}>{description}</span>
          </p>
          <div className={cn('absolute inset-x-4 bottom-[18px] h-1.5 overflow-hidden rounded-full bg-indigo-100', overdue && 'bg-orange-50')}>
            <span className={cn('block h-full rounded-full', progress, progressTone)} />
          </div>
        </Card>
      ))}
    </section>
  )
}
