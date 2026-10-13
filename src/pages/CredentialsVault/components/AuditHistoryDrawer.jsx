import { FileDown, KeyRound, RotateCw, ShieldCheck } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import { categoryMeta } from './credentialsUi'

const EVENT_STYLES = {
  revealed: { icon: KeyRound, dot: 'bg-orange-500', iconTone: 'text-orange-600' },
  rotated: { icon: RotateCw, dot: 'bg-primary-600', iconTone: 'text-primary-700' },
  updated: { icon: ShieldCheck, dot: 'bg-neutral-300', iconTone: 'text-neutral-600' },
  created: { icon: ShieldCheck, dot: 'bg-neutral-300', iconTone: 'text-neutral-600' },
}

const eventsFor = (credential) => [
  {
    type: 'revealed', time: '4m ago', title: 'Secret Payload Unmasked',
    detail: `Dev Team accessed ${credential.name} through authorization token prompt.`,
    meta: 'IP: 192.168.1.42  •  Auth: Multi-Factor Validated',
  },
  {
    type: 'rotated', time: '7d ago', title: 'Cryptographic Secret Rotated',
    detail: `${credential.lastRotatedBy ?? 'Operations'} rotated the secret key pair in compliance with quarterly rotation schedule.`,
    meta: `IP: 10.8.12.89  •  Signer: ${credential.lastRotatedBy ?? 'Operations'}`,
  },
  {
    type: 'updated', time: '14d ago', title: 'IAM Role Scopes Updated',
    detail: `Automated sync added policy controls for ${credential.client.name.toLowerCase().replace(/\s+/g, '-')}-backups-bucket.`,
    meta: 'IP: 127.0.0.1 (CLI Pipeline)',
  },
  {
    type: 'created', time: '88d ago', title: 'Initial Credential Vaulted',
    detail: `Initial secret onboarding during ${credential.client.name} infrastructure integration phase.`,
    meta: `Created by: ${credential.lastRotatedBy ?? 'Marcus Sterling'}`,
  },
]

function TimelineEvent({ event, last }) {
  const style = EVENT_STYLES[event.type]
  const Icon = style.icon
  return (
    <li className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-3 last:pb-0">
      {!last && <span className="absolute left-[9px] top-5 h-[calc(100%-7px)] w-px bg-indigo-100" aria-hidden="true" />}
      <span className={`relative z-10 mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-4 border-white ${style.dot}`}>
        <Icon size={9} className={style.iconTone} strokeWidth={3} aria-hidden="true" />
      </span>
      <article className="rounded-xl bg-indigo-50/80 px-3.5 py-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-900">{event.title}</h3>
          <time className="shrink-0 font-mono text-xs text-neutral-500">{event.time}</time>
        </div>
        <p className="mt-1.5 text-[13px] leading-5 text-neutral-700">{event.detail}</p>
        <p className="mt-2 font-mono text-[10px] text-neutral-500">{event.meta}</p>
      </article>
    </li>
  )
}

export default function AuditHistoryDrawer({ credential, onClose, onExport }) {
  const open = Boolean(credential)
  const meta = credential ? categoryMeta(credential.category) : null
  const Icon = meta?.icon ?? KeyRound

  return (
    <Drawer
      open={open}
      onClose={onClose}
      panelClassName="max-w-[512px]"
      backdropClassName="bg-slate-100/55 backdrop-blur-[2px]"
      header={credential && (
        <div className="flex items-center gap-3 pr-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Icon size={17} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-neutral-900">Audit History: {credential.name}</h2>
            <p className="mt-0.5 font-mono text-xs text-neutral-500">Immutable Ledger  •  SHA256 Verified</p>
          </div>
        </div>
      )}
      footer={(
        <>
          <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-indigo-100">
            <FileDown size={14} /> Export CSV Audit
          </button>
          <button type="button" onClick={onClose} className="rounded-md bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
            Dismiss
          </button>
        </>
      )}
    >
      {credential && (
        <ol className="space-y-0">
          {eventsFor(credential).map((event, index, events) => (
            <TimelineEvent key={`${event.title}-${event.time}`} event={event} last={index === events.length - 1} />
          ))}
        </ol>
      )}
    </Drawer>
  )
}
