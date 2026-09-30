import { RefreshCw, CheckCircle2, CircleEllipsis, Clock } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import { cn, getInitials } from '@/utils'
import { handoverLabel } from './projectsUi'

// Icon for stages that have not started yet (falls back to Clock)
const UPCOMING_ICONS = { testing: CircleEllipsis, deployment: Clock }

const TILE = {
  done:     { wrap: 'bg-indigo-50/70', label: 'text-teal-700',    text: 'text-neutral-800',           track: 'bg-white',       bar: 'bg-emerald-500' },
  active:   { wrap: 'bg-primary-700 shadow-sm', label: 'text-white', text: 'font-semibold text-white', track: 'bg-white/25',    bar: 'bg-orange-500' },
  upcoming: { wrap: 'bg-indigo-50/50', label: 'text-neutral-400', text: 'text-neutral-400',           track: 'bg-neutral-100', bar: 'bg-neutral-300' },
}

function SprintRing({ current, total }) {
  const r = 6
  const c = 2 * Math.PI * r
  const filled = total > 0 ? Math.min(1, current / total) * c : 0
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="-rotate-90">
      <circle cx="8" cy="8" r={r} fill="none" strokeWidth="2" className="stroke-indigo-100" />
      <circle
        cx="8" cy="8" r={r} fill="none" strokeWidth="2" strokeLinecap="round"
        strokeDasharray={`${filled} ${c}`} className="stroke-primary-600"
      />
    </svg>
  )
}

function StageTile({ index, stage, state, progress }) {
  const t = TILE[state]
  const Icon =
    state === 'done' ? CheckCircle2 : state === 'active' ? RefreshCw : UPCOMING_ICONS[stage.key] ?? Clock
  const iconTone =
    state === 'done' ? 'text-teal-600' : state === 'active' ? 'text-orange-400' : 'text-neutral-400'
  const percent = state === 'done' ? 100 : state === 'active' ? progress : 0

  return (
    <li className={cn('rounded-lg px-3.5 pb-3 pt-2.5', t.wrap)} aria-current={state === 'active' ? 'step' : undefined}>
      <div className="flex items-center justify-between gap-2">
        <p className={cn('truncate text-[11px] font-bold uppercase tracking-wide', t.label)}>
          {index + 1}. {stage.label}
        </p>
        <Icon size={14} className={cn('shrink-0', iconTone)} />
      </div>
      <p className={cn('mt-1.5 truncate text-sm', t.text)}>
        {stage.milestone}
        {state === 'active' && ` (${progress}%)`}
      </p>
      <div
        role="progressbar"
        aria-label={`${stage.label} progress`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('mt-2.5 h-1.5 w-full overflow-hidden rounded-full', t.track)}
      >
        <div className={cn('h-full rounded-full', t.bar)} style={{ width: `${percent}%` }} />
      </div>
    </li>
  )
}

/**
 * project = FeaturedProject (see projectsService). The UI derives which stage is
 * done / active / upcoming from `activeStage`.
 */
export default function FeaturedProjectCard({ project, loading = false, onSprintBoard }) {
  if (loading && !project) return <Card className="h-[172px] animate-pulse" />
  if (!project) return null // non-critical widget: hide quietly on error

  const activeIdx = project.stages.findIndex((s) => s.key === project.activeStage)

  return (
    <Card>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
            {getInitials(project.client.name)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-900">{project.name}</h2>
              <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600">
                {project.client.name}
              </span>
              {project.critical && <Badge variant="warning" className="!text-[10px]">Critical Path</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              Target Handover: {handoverLabel(project.targetHandover)} • Lead Engineer: {project.lead.name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <SprintRing current={project.sprint.current} total={project.sprint.total} />
            Sprint {project.sprint.current} of {project.sprint.total}
          </span>
          <button
            type="button"
            onClick={onSprintBoard}
            className="rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Sprint Board &rarr;
          </button>
        </div>
      </div>

      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {project.stages.map((s, i) => (
          <StageTile
            key={s.key}
            index={i}
            stage={s}
            progress={project.activeProgress}
            state={i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'upcoming'}
          />
        ))}
      </ol>
    </Card>
  )
}