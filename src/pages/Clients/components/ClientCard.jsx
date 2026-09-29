import { BadgeCheck, Zap, Mail, Eye, MoreVertical } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Avatar from '@/components/common/Avatar'
import { cn, formatRelativeTime } from '@/utils'
import { ClientLogo } from './clientColumns'
import { STATUS_META, billingNote, quickActionFor, money } from './clientsUi'

const PILL = '!normal-case !tracking-normal !text-xs !font-semibold px-2.5 py-1'

function IconAction({ icon: Icon, label, className, onClick }) {
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

export default function ClientCard({ client: c, onView, onQuickAction, onMore }) {
  const meta = STATUS_META[c.status] ?? STATUS_META.prospect
  const note = billingNote(c.billing)
  const q = quickActionFor(c)

  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
        <IconAction icon={MoreVertical} label="More actions" onClick={() => onMore(c)} />
      </div>

      {/* Status */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={meta.variant} dot className={PILL}>{meta.label}</Badge>
        {c.renewalInDays != null && (
          <span className="text-[9px] font-bold uppercase tracking-wide text-orange-500">
            Renewal in {c.renewalInDays} days
          </span>
        )}
      </div>

      {/* Billing + projects */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="whitespace-nowrap">
          <p className="text-xl font-bold text-neutral-900">
            {money(c.billing.mrr)}
            <span className="text-sm font-normal text-neutral-400">/mo</span>
          </p>
          <p className={cn('mt-0.5 flex items-center gap-1.5 font-mono text-[11px]', note.tone)}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {note.text}
          </p>
        </div>
        {c.projects.active > 0 ? (
          <Badge variant="primary" className={PILL}>{c.projects.active} Active</Badge>
        ) : (
          <Badge variant="neutral" className={PILL}>{c.projects.paused} Paused</Badge>
        )}
      </div>

      {/* Contact */}
      <div className="mt-4 rounded-lg bg-indigo-50/60 p-3">
        <p className="text-sm font-medium text-neutral-900">{c.contact.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-xs text-neutral-500">
          <Mail size={12} className={c.contact.emailVerified ? 'text-green-600' : 'text-neutral-400'} />
          <span className="truncate">{c.contact.email}</span>
        </p>
        <p className="text-xs text-neutral-500">{c.contact.phone}</p>
      </div>

      {/* Lead + activity */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={c.lead.name} src={c.lead.avatarUrl} size={26} />
          <span className="text-sm text-neutral-800">{c.lead.short}</span>
        </div>
        <div className="min-w-0 text-right">
          <p className="font-mono text-xs text-neutral-500">{formatRelativeTime(c.lastActivity.at)}</p>
          <p className="truncate text-xs text-neutral-800">{c.lastActivity.text}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-0.5 border-t border-neutral-100 pt-3">
        <IconAction icon={Eye} label="View client" onClick={() => onView(c)} />
        <IconAction icon={q.icon} label={q.label} className={q.tone} onClick={() => onQuickAction(q.type, c)} />
      </div>
    </div>
  )
}