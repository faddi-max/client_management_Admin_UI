import { Eye, ListChecks, FileText } from 'lucide-react'
import Badge from '@/components/common/Badge'
import AvatarStack from '@/components/common/AvatarStack'
import { cn } from '@/utils'
import {
  STATUS_META, projectIcon, milestoneProgress, deadlineInfo, invoicingNote, money,
} from './projectsUi'

// Local copy of the icon button used in clientColumns / ClientCard (not exported there).
// Candidate to hoist into components/common once a third page needs it.
function RowAction({ icon: Icon, label, onClick }) {
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

/**
 * @param {{ onView, onQuickAction, canSeeFinance? }} opts - handlers receive the project row.
 *   canSeeFinance hides the Value & Invoicing column (PRD: Developer / Viewer roles have
 *   no finance access). Wire it to real permissions once the role model is decided.
 */
export function getProjectColumns({ onView, onQuickAction, canSeeFinance = true }) {
  const columns = [
    {
      key: 'project',
      header: 'Project Name & Client',
      className: 'min-w-[260px]',
      render: (p) => {
        const meta = STATUS_META[p.status] ?? STATUS_META.in_progress
        const Icon = projectIcon(p.icon)
        return (
          <div className="flex items-center gap-3">
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
        )
      },
    },
    {
      key: 'milestones',
      header: 'Milestones & Burn',
      className: 'min-w-[190px]',
      render: (p) => {
        const m = milestoneProgress(p)
        return (
          <div>
            <div className="flex items-baseline justify-between gap-3 whitespace-nowrap font-mono text-xs">
              <span className="text-neutral-500">{m.total > 0 ? `${m.done} of ${m.total} milestones` : 'No milestones'}</span>
              <span className={cn('font-bold', m.text)}>
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
        )
      },
    },
    {
      key: 'status',
      header: 'Delivery Status',
      render: (p) => {
        const meta = STATUS_META[p.status] ?? STATUS_META.in_progress
        return <Badge variant={meta.variant} dot>{meta.label}</Badge>
      },
    },
    {
      key: 'team',
      header: 'Assigned Team',
      render: (p) =>
        p.team?.length ? <AvatarStack people={p.team} /> : <span className="text-xs text-neutral-400">Unassigned</span>,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (p) => {
        const d = deadlineInfo(p)
        return (
          <div className="whitespace-nowrap">
            <p className={cn('text-sm font-semibold', d.primaryTone)}>{d.primary}</p>
            <p className={cn('mt-0.5 text-[10px] font-bold tracking-wide', d.noteTone)}>{d.note}</p>
          </div>
        )
      },
    },
  ]

  if (canSeeFinance) {
    columns.push({
      key: 'value',
      header: 'Value & Invoicing',
      render: (p) => {
        const note = invoicingNote(p)
        return (
          <div className="whitespace-nowrap">
            <p className="font-mono text-[15px] font-bold text-neutral-900">{money(p.value)}</p>
            <p className={cn('mt-0.5 text-xs', note.tone)}>{note.text}</p>
          </div>
        )
      },
    })
  }

  columns.push({
    key: 'actions',
    header: 'Quick Actions',
    align: 'right',
    className: 'pr-5',
    headerClassName: 'pr-5',
    render: (p) => (
      <div className="flex items-center justify-end gap-0.5">
        <RowAction icon={Eye} label="View project" onClick={() => onView(p)} />
        <RowAction icon={ListChecks} label="View milestones" onClick={() => onQuickAction('milestones', p)} />
        <RowAction icon={FileText} label="Project documents" onClick={() => onQuickAction('documents', p)} />
      </div>
    ),
  })

  return columns
}
