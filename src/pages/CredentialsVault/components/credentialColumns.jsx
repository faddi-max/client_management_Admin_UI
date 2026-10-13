import { RefreshCcw, Pencil, ScrollText } from 'lucide-react'
import IconAction from '@/components/common/IconAction'
import { cn, getInitials } from '@/utils'
import SecretCell from './SecretCell'
import { categoryMeta, envMeta, tierMeta, rotationInfo } from './credentialsUi'

/**
 * @param {{ onReveal, onCopy, onQuickAction, canRevealSecrets? }} opts
 *   canRevealSecrets hides reveal/copy. PRD: Developer sees only "authorized technical assets",
 *   Finance/Sales/Viewer have no credential access. Wire to real permissions (TODO(auth)).
 */
export function getCredentialColumns({ onReveal, onCopy, onQuickAction, canRevealSecrets = true }) {
  return [
    {
      key: 'service',
      header: 'Service / Asset',
      className: 'min-w-[280px]',
      render: (c) => {
        const meta = categoryMeta(c.category)
        const Icon = meta.icon
        return (
          <div className="flex items-center gap-3">
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', meta.iconWrap)}>
              <Icon size={17} className={meta.iconTone} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{c.name}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">{c.identifier ?? '—'}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'client',
      header: 'Client',
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-600">
            {getInitials(c.client.name)}
          </span>
          <span className="text-sm text-neutral-900">{c.client.name}</span>
        </div>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (c) => {
        const e = envMeta(c.environment)
        return (
          <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium', e.pill)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', e.dot)} />
            {e.label}
          </span>
        )
      },
    },
    {
      key: 'secret',
      header: 'Secret Payload',
      render: (c) => <SecretCell credential={c} canReveal={canRevealSecrets} onReveal={onReveal} onCopy={onCopy} />,
    },
    {
      key: 'rotation',
      header: 'Last Rotated',
      render: (c) => {
        const r = rotationInfo(c)
        return (
          <div className="whitespace-nowrap">
            <p className={cn('text-sm', r.primaryTone)}>{r.primary}</p>
            <p className={cn('mt-0.5 font-mono text-xs', r.secondaryTone)}>{r.secondary}</p>
          </div>
        )
      },
    },
    {
      key: 'tier',
      header: 'Access Tier',
      render: (c) => {
        const t = tierMeta(c.accessTier)
        return (
          <span className={cn('inline-block max-w-[96px] rounded px-2 py-0.5 font-mono text-[11px] font-semibold leading-tight', t.tone)}>
            {t.label}
          </span>
        )
      },
    },
    {
      key: 'audit',
      header: '',
      render: (c) => (
        <button
          type="button"
          onClick={() => onQuickAction('audit history', c)}
          className="flex items-center gap-2 text-left text-xs font-semibold text-primary-700 hover:underline"
        >
          <ScrollText size={15} className="shrink-0 text-primary-600" />
          <span className="w-14 leading-tight">Audit History</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'pr-5',
      headerClassName: 'pr-5',
      render: (c) => {
        const stale = rotationInfo(c).stale
        return (
          <div className="flex items-center justify-end gap-0.5">
            {stale ? (
              <button
                type="button"
                aria-label="Rotation required — rotate now"
                title="Rotation required"
                onClick={() => onQuickAction('rotate', c)}
                className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-base font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                !
              </button>
            ) : (
              <IconAction icon={RefreshCcw} label="Rotate credential" onClick={() => onQuickAction('rotate', c)} />
            )}
            <IconAction icon={Pencil} label="Edit credential" onClick={() => onQuickAction('edit', c)} />
          </div>
        )
      },
    },
  ]
}