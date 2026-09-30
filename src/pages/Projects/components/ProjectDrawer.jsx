import { ExternalLink, ListChecks, Users, Banknote, CheckCircle2, Circle } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Avatar from '@/components/common/Avatar'
import { cn } from '@/utils'
import { STAGES } from '@/constants/projectConfig'
import { STATUS_META, projectIcon, milestoneProgress, deadlineInfo, invoicingNote, money } from './projectsUi'

const LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-500'

function Section({ icon: Icon, title, right, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
          <Icon size={14} className="text-primary-600" /> {title}
        </h3>
        {right}
      </div>
      {children}
    </section>
  )
}

function Stat({ label, value, valueClass = 'text-neutral-900', sub, subClass = 'text-neutral-500' }) {
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      <p className={cn('mt-1.5 truncate text-sm font-bold', valueClass)}>{value}</p>
      {sub && <p className={cn('mt-0.5 text-[10px] font-bold tracking-wide', subClass)}>{sub}</p>}
    </div>
  )
}

function Bar({ label, percent, tone = 'bg-primary-600', right }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-500">{label}</span>
        <span className="font-mono font-semibold text-neutral-900">{right}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
      >
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

/**
 * project = list row. detail = optional extra payload from fetchProjectDetail
 * (sections without data are simply not rendered).
 * canSeeFinance hides all money (PRD: Developer / Viewer have no finance access).
 */
export default function ProjectDrawer({
  project, detail, detailLoading = false, detailError = false,
  open, onClose, onAction, canSeeFinance = true,
}) {
  if (!project) return null

  const meta = STATUS_META[project.status] ?? STATUS_META.in_progress
  const Icon = projectIcon(project.icon)
  const m = milestoneProgress(project)
  const d = deadlineInfo(project)
  const stage = STAGES.find((s) => s.value === project.stage)?.label ?? '—'
  const note = invoicingNote(project)
  const pct = (n) => (project.value > 0 ? Math.min(100, Math.round((n / project.value) * 100)) : 0)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      headerActions={
        <button aria-label="Open full project page" onClick={() => onAction('open-page')} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
          <ExternalLink size={17} />
        </button>
      }
      header={
        <div className="flex items-center gap-3">
          <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', meta.iconWrap)}>
            <Icon size={20} className={meta.iconTone} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold text-neutral-900">{project.name}</h2>
              <Badge variant={meta.variant} dot className="shrink-0 !text-[10px]">{meta.label}</Badge>
            </div>
            <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">
              {detail?.code && <>{detail.code} • </>}
              {project.client.name}
              {project.client.segment && ` • ${project.client.segment}`}
            </p>
          </div>
        </div>
      }
      footer={
        <>
          <button type="button" onClick={() => onAction('milestones')} className="text-sm font-medium text-primary-600 hover:underline">
            View milestones board
          </button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="lg" onClick={onClose}>Close</Button>
            <Button size="lg" onClick={() => onAction('workspace')}>Open Workspace</Button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-indigo-50 p-4">
        <Stat label="Lifecycle Stage" value={stage} />
        <Stat label="Deadline" value={d.primary} valueClass={d.primaryTone} sub={d.note} subClass={d.noteTone} />
        <Stat label="Delivery Lead" value={detail?.lead?.name ?? '—'} sub={detail?.lead?.title} subClass="font-normal tracking-normal" />
      </div>

      {detail?.description && <p className="text-sm text-neutral-600">{detail.description}</p>}
      {detailLoading && <p className="text-xs text-neutral-400">Loading project details…</p>}
      {detailError && <p className="text-xs text-red-500">Could not load project details.</p>}

      <Section
        icon={ListChecks}
        title="Milestones & Burn"
        right={<span className={cn('font-mono text-xs font-bold', m.text)}>{m.total > 0 ? `${m.percent}%` : '—'}{m.halted && ' (Halted)'}</span>}
      >
        <div className="rounded-xl border border-neutral-200 p-4">
          <Bar
            label={m.total > 0 ? `${m.done} of ${m.total} milestones` : 'No milestones'}
            percent={m.percent}
            tone={m.bar}
            right={m.total > 0 ? `${m.percent}%` : '—'}
          />
          {detail?.milestones?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {detail.milestones.map((ms) => (
                <li key={ms.id} className="flex items-center gap-2.5 text-sm">
                  {ms.done
                    ? <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                    : <Circle size={16} className="shrink-0 text-neutral-300" />}
                  <span className={ms.done ? 'text-neutral-500' : 'font-medium text-neutral-900'}>{ms.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section icon={Users} title="Assigned Team" right={<span className="text-xs font-semibold text-neutral-500">{project.team?.length ?? 0} members</span>}>
        {project.team?.length ? (
          <ul className="space-y-2">
            {project.team.map((person) => (
              <li key={person.id} className="flex items-center gap-3 rounded-lg bg-indigo-50/60 px-3 py-2.5">
                <Avatar name={person.name} src={person.avatarUrl} size={28} />
                <span className="text-sm font-medium text-neutral-900">{person.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-400">Unassigned</p>
        )}
      </Section>

      {canSeeFinance && (
        <Section icon={Banknote} title="Value & Invoicing" right={<span className={cn('text-xs', note.tone)}>{note.text}</span>}>
          <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Contract Value" value={<span className="font-mono">{money(project.value)}</span>} />
              <Stat label="Invoiced" value={<span className="font-mono">{money(project.invoiced)}</span>} />
              <Stat label="Outstanding" value={<span className="font-mono">{money(Math.max(0, project.value - project.paid))}</span>} />
            </div>
            <Bar label="Invoiced" percent={pct(project.invoiced)} right={`${pct(project.invoiced)}%`} />
            <Bar label="Paid" percent={pct(project.paid)} tone="bg-green-500" right={`${pct(project.paid)}%`} />
          </div>
        </Section>
      )}
    </Drawer>
  )
}