import { Eye, ListChecks, FileText } from 'lucide-react'
import Badge from '@/components/common/Badge'
import AvatarStack from '@/components/common/AvatarStack'
import { cn } from '@/utils'
import {
  STATUS_META, projectIcon, milestoneProgress, deadlineInfo, invoicingNote, money,
} from './projectsUi'

// Same icon button as projectColumns / ClientCard (candidate to hoist into components/common)
function IconAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
    >
      <Icon size={16} />
    </button>
  )
}

/** Grid-view counterpart of the table row. Uses the same derived values from projectsUi. */
export default function ProjectCard({ project: p, onView, onQuickAction, canSeeFinance = true }) {
  const meta = STATUS_META[p.status] ?? STATUS_META.in_progress
  const Icon = projectIcon(p.icon)
  const m = milestoneProgress(p)
  const d = deadlineInfo(p)
  const note = invoicingNote(p)

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        p.status === 'blocked' ? 'border-orange-100 bg-orange-50/40' : 'border-neutral-200'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', meta.iconWrap)}>
            <Icon size={17} className={meta.iconTone} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-neutral-900">{p.name}</p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">
              {p.client.name}
              {p.client.segment && ` • ${p.client.segment}`}
            </p>
          </div>
        </div>
        <Badge variant={meta.variant} dot className="!text-[10px] shrink-0">{meta.label}</Badge>
      </div>

      {/* Milestones */}
      <div className="mt-4">
        <div className="flex items-start justify-between gap-2 font-mono text-xs leading-snug">
          <span className="text-neutral-500">
            {m.total > 0 ? `${m.done} of ${m.total} milestones` : 'No milestones'}
          </span>
          <span className={cn('shrink-0 font-bold', m.text)}>
            {m.total > 0 ? `${m.percent}%` : '—'}
            {m.halted && ' (Halted)'}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`${p.name} milestone progress`}
          aria-valuenow={m.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
        >
          <div className={cn('h-full rounded-full', m.bar)} style={{ width: `${m.percent}%` }} />
        </div>
      </div>

      {/* Deadline + value */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="whitespace-nowrap">
          <p className={cn('text-sm font-semibold', d.primaryTone)}>{d.primary}</p>
          <p className={cn('mt-0.5 text-[10px] font-bold tracking-wide', d.noteTone)}>{d.note}</p>
        </div>
        {canSeeFinance && (
          <div className="whitespace-nowrap text-right">
            <p className="font-mono text-[15px] font-bold text-neutral-900">{money(p.value)}</p>
            <p className={cn('mt-0.5 text-xs', note.tone)}>{note.text}</p>
          </div>
        )}
      </div>

      {/* Team + actions */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        {p.team?.length ? (
          <AvatarStack people={p.team} chipClassName="border border-neutral-200 bg-white text-neutral-500" />
        ) : (
          <span className="text-xs text-neutral-400">Unassigned</span>
        )}
        <div className="flex items-center gap-0.5">
          <IconAction icon={Eye} label="View project" onClick={() => onView(p)} />
          <IconAction icon={ListChecks} label="View milestones" onClick={() => onQuickAction('milestones', p)} />
          <IconAction icon={FileText} label="Project documents" onClick={() => onQuickAction('documents', p)} />
        </div>
      </div>
    </div>
  )
}