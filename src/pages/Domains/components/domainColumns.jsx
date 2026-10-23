import { RefreshCw, MoreVertical } from 'lucide-react'
import IconAction from '@/components/common/IconAction'
import { cn } from '@/utils'
// TODO: hoist ClientLogo to components/common once a third page needs it
import { ClientLogo } from '@/pages/Clients/components/clientColumns'
import { PROTECTION, typeTone, providerTone, renewalInfo, assetStatus, costInfo } from './domainsUi'

const PILL = 'inline-block rounded-md px-2.5 py-1 text-xs font-medium leading-snug'

/** @param {{ onQuickAction }} handlers - receives (type, asset) */
export function getDomainColumns({ onQuickAction }) {
  // Row click opens the side panel, so action buttons must not bubble up
  const act = (type, a) => (e) => {
    e.stopPropagation()
    onQuickAction(type, a)
  }

  return [
    {
      key: 'asset',
      header: 'Asset / Hostname',
      className: 'min-w-[250px]',
      render: (a) => {
        const status = assetStatus(a)
        const P = PROTECTION[a.protection]
        return (
          <div className="flex items-center gap-3">
            <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', status.dot)} title={status.label} aria-label={status.label} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[15px] font-semibold text-neutral-900">{a.hostname}</p>
                {P && <P.icon size={13} className="shrink-0 text-neutral-400" aria-label={P.label} />}
              </div>
              <p className="mt-0.5 truncate font-mono text-[11px] text-neutral-500">
                IP: {a.ip} • {a.role}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type & Tier',
      render: (a) => <span className={cn(PILL, 'max-w-[110px]', typeTone(a.kind))}>{a.typeLabel}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      render: (a) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <ClientLogo initials={a.client.initials} color={a.client.logoColor} size={28} />
          <span className="text-sm text-neutral-800">{a.client.name}</span>
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (a) => <span className={cn(PILL, 'max-w-[110px]', providerTone(a.provider))}>{a.provider}</span>,
    },
    {
      key: 'renewal',
      header: 'Renewal',
      render: (a) => {
        const r = renewalInfo(a)
        return (
          <div className="whitespace-nowrap">
            <p className={cn('text-sm', r.dateTone)}>{r.date}</p>
            <p className={cn('mt-0.5 font-mono text-[11px]', r.noteTone)}>{r.note}</p>
          </div>
        )
      },
    },
    {
      key: 'cost',
      header: 'Cost vs Billed',
      render: (a) => {
        const c = costInfo(a)
        return (
          <div className="whitespace-nowrap">
            <p className="text-sm font-bold text-neutral-900">
              {c.cost} <span className="font-normal text-neutral-400">→ {c.billed}</span>
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-semibold text-teal-700">{c.margin}</p>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'pr-5',
      headerClassName: 'pr-5',
      render: (a) => (
        <div className="flex items-center justify-end gap-0.5">
          <IconAction icon={RefreshCw} label="Renew" onClick={act('renew', a)} />
          <IconAction icon={MoreVertical} label="More actions" onClick={act('more', a)} />
        </div>
      ),
    },
  ]
}