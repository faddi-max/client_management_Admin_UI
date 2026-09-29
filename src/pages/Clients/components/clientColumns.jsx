import { BadgeCheck, Zap, Mail, Eye, MoreVertical } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Avatar from '@/components/common/Avatar'
import { cn, formatRelativeTime } from '@/utils'
import { STATUS_META, billingNote, quickActionFor, money } from './clientsUi'

const LOGO_GRADIENTS = {
  indigo: 'from-indigo-500 to-indigo-700',
  orange: 'from-orange-400 to-orange-600',
  sky: 'from-sky-400 to-blue-600',
  fuchsia: 'from-fuchsia-500 to-pink-600',
  amber: 'from-amber-600 to-amber-800',
}

function ClientLogo({ initials, color }) {
  return (
    <span
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white',
        LOGO_GRADIENTS[color] ?? LOGO_GRADIENTS.indigo
      )}
    >
      {initials}
    </span>
  )
}

const PILL = '!normal-case !tracking-normal !text-xs !font-semibold px-2.5 py-1'

function RowAction({ icon: Icon, label, className, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn('rounded-md p-1.5 transition-colors', className ?? 'text-neutral-500 hover:bg-neutral-100')}
    >
      <Icon size={16} />
    </button>
  )
}

/** @param {{ onView, onQuickAction, onMore }} handlers - each receives the client row */
export function getClientColumns({ onView, onQuickAction, onMore }) {
  return [
    {
      key: 'client',
      header: 'Client & Company',
      className: 'min-w-[250px]',
      render: (c) => (
        <div className="flex items-center gap-3">
          <ClientLogo initials={c.initials} color={c.logoColor} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[15px] font-semibold text-neutral-900">{c.name}</p>
              {c.badge === 'verified' && <BadgeCheck size={15} className="shrink-0 text-primary-500" aria-label="Verified" />}
              {c.badge === 'premium' && <Zap size={14} className="shrink-0 fill-current text-violet-500" aria-label="Premium" />}
            </div>
            <p className="mt-0.5 truncate text-xs text-neutral-500">
              <span className="font-mono text-[11px]">{c.domain}</span> • {c.industry}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Primary Contact',
      className: 'min-w-[210px]',
      render: (c) => (
        <div>
          <p className="text-sm font-medium text-neutral-900">{c.contact.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-neutral-500">
            <Mail size={12} className={c.contact.emailVerified ? 'text-green-600' : 'text-neutral-400'} />
            {c.contact.email}
          </p>
          <p className="text-xs text-neutral-500">{c.contact.phone}</p>
        </div>
      ),
    },
    {
      key: 'projects',
      header: 'Active Projects',
      align: 'center',
      render: (c) =>
        c.projects.active > 0 ? (
          <Badge variant="primary" className={PILL}>{c.projects.active} Active</Badge>
        ) : (
          <Badge variant="neutral" className={PILL}>{c.projects.paused} Paused</Badge>
        ),
    },
    {
      key: 'balance',
      header: 'Balance / MRR',
      render: (c) => {
        const note = billingNote(c.billing)
        return (
          <div className="whitespace-nowrap">
            <p className="text-[15px] font-bold text-neutral-900">
              {money(c.billing.mrr)}
              <span className="text-sm font-normal text-neutral-400">/mo</span>
            </p>
            <p className={cn('mt-0.5 flex items-center gap-1.5 font-mono text-[11px]', note.tone)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {note.text}
            </p>
          </div>
        )
      },
    },
    {
      key: 'lead',
      header: 'Account Lead',
      render: (c) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={c.lead.name} src={c.lead.avatarUrl} size={26} />
          <span className="text-sm text-neutral-800">{c.lead.short}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Health & Status',
      render: (c) => {
        const meta = STATUS_META[c.status] ?? STATUS_META.prospect
        return (
          <div>
            <Badge variant={meta.variant} dot className={PILL}>{meta.label}</Badge>
            {c.renewalInDays != null && (
              <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-orange-500">
                Renewal in {c.renewalInDays} days
              </p>
            )}
          </div>
        )
      },
    },
    {
      key: 'activity',
      header: 'Last Activity',
      render: (c) => (
        <div className="max-w-[150px]">
          <p className="font-mono text-xs text-neutral-500">{formatRelativeTime(c.lastActivity.at)}</p>
          <p className="mt-0.5 truncate text-xs text-neutral-800">{c.lastActivity.text}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'pr-5',
      headerClassName: 'pr-5',
      render: (c) => {
        const q = quickActionFor(c)
        return (
          <div className="flex items-center justify-end gap-0.5">
            <RowAction icon={Eye} label="View client" onClick={() => onView(c)} />
            <RowAction icon={q.icon} label={q.label} className={q.tone} onClick={() => onQuickAction(q.type, c)} />
            <RowAction icon={MoreVertical} label="More actions" onClick={() => onMore(c)} />
          </div>
        )
      },
    },
  ]
}