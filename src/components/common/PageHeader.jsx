import { Clock, Download, ShieldCheck } from 'lucide-react'

export default function PageHeader({
  liveBadgeLabel = 'HQ LIVE ENGINE',
  clusterBadgeLabel = 'NYC CLUSTER 01',
  greetingName = 'Elena',
  highlights = [
    { text: '38 active client operations' },
    { text: '19 active delivery tracks' },
  ],
  actions = [
    { key: 'generate-runbook', label: 'Generate Runbook', icon: Download, variant: 'neutral', row: 1, onClick: () => {} },
    { key: 'dispatch-incident', label: 'Dispatch Incident', icon: ShieldCheck, variant: 'primary', row: 1, onClick: () => {} },
    { key: 'timeline-sync', label: 'Timeline Sync', icon: Clock, variant: 'amber', row: 2, onClick: () => {} },
  ],
}) {
  const row1 = actions.filter((a) => (a.row ?? 1) === 1)
  const row2 = actions.filter((a) => a.row === 2)

  const renderButton = ({ key, label, icon: Icon, variant, onClick }) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className={
        variant === 'primary'
          ? 'inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700'
          : 'inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-neutral-50 ' +
            (variant === 'amber' ? 'text-amber-600' : 'text-neutral-700')
      }
    >
      <Icon
        size={16}
        className={
          variant === 'primary'
            ? 'text-white'
            : variant === 'amber'
            ? 'text-amber-500'
            : 'text-neutral-500'
        }
      />
      {label}
    </button>
  )

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-600">
            {liveBadgeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {clusterBadgeLabel}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Good morning, {greetingName}
        </h1>

        <p className="mt-1.5 text-sm text-neutral-500 max-w-xl">
          Here&apos;s what needs your attention today across{' '}
          <span className="font-semibold text-neutral-900">{highlights[0]?.text}</span>
          {highlights[1] && (
            <>
              {' '}and{' '}
              <span className="font-semibold text-neutral-900">{highlights[1].text}</span>
            </>
          )}
          .
        </p>
      </div>

      <div className="flex flex-col items-stretch sm:items-end gap-2 sm:gap-3 sm:shrink-0">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          {row1.map(renderButton)}
        </div>
        {row2.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            {row2.map(renderButton)}
          </div>
        )}
      </div>
    </div>
  )
}
