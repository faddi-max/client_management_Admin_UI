import { ExternalLink, Rocket, KeyRound, AlarmClock, Bell, Archive, Server, Terminal, Code, Copy, Lock, Eye } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { ClientLogo } from './clientColumns'
import { STATUS_META, money } from './clientsUi'

const ASSET_ICONS = { server: Server, terminal: Terminal, code: Code }
const ACTION_ICONS = { copy: Copy, locked: Lock, reveal: Eye }
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

function Stat({ label, value, valueClass = 'text-neutral-900', sub }) {
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      <p className={`mt-1.5 text-sm font-bold ${valueClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>}
    </div>
  )
}

/**
 * client = list row. detail = optional extra payload from fetchClientDetail
 * (sections without data are simply not rendered).
 * NOTE: no secret values ever enter this component; asset actions are callbacks only.
 */
export default function ClientDrawer({ client, detail, open, onClose, onAssetAction, onAction }) {
  if (!client) return null
  const meta = STATUS_META[client.status] ?? STATUS_META.prospect
  const p = detail?.project
  const f = detail?.forecast

  return (
    <Drawer
      open={open}
      onClose={onClose}
      headerActions={
        <button aria-label="Open full client page" onClick={() => onAction('open-page')} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
          <ExternalLink size={17} />
        </button>
      }
      header={
        <div className="flex items-center gap-3">
          <ClientLogo initials={client.initials} color={client.logoColor} sizeClass="h-11 w-11" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold text-neutral-900">{detail?.legalName ?? client.name}</h2>
              <Badge variant="success" className="!normal-case !tracking-normal !text-xs !font-semibold">{meta.label}</Badge>
            </div>
            <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">
              {detail?.clientCode && <>Client ID: {detail.clientCode} • </>}{detail?.segmentLabel ?? client.industry}
            </p>
          </div>
        </div>
      }
      footer={
        <>
          <button type="button" onClick={() => onAction('archive')} className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline">
            <Archive size={15} /> Archive Client
          </button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="lg" onClick={onClose}>Close</Button>
            <Button size="lg" onClick={() => onAction('workspace')}>Open Workspace</Button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-indigo-50 p-4">
        <Stat label="Retainer Volume" value={`${money(client.billing.mrr)}/mo`} sub={detail?.paymentTerms} />
        <Stat
          label="Contract Renewal"
          value={client.renewalInDays != null ? `${client.renewalInDays} Days Left` : '—'}
          valueClass="text-orange-500"
          sub={detail?.renewalDate}
        />
        <Stat label="Primary Lead" value={client.lead.name} sub={detail?.leadTitle} />
      </div>

      {p && (
        <Section icon={Rocket} title="Active Operational Project" right={<button onClick={() => onAction('sprint')} className="text-xs font-semibold text-primary-600 hover:underline">View Sprint</button>}>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                <Badge variant="primary" className="font-mono">{p.sprint}</Badge>
              </div>
              <span className="text-xs font-semibold text-neutral-600">{p.progress}%</span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">{p.summary}</p>
            <div role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-primary-600" style={{ width: `${p.progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div><p className="text-neutral-500">Budget Burn</p><p className="mt-0.5 font-mono font-semibold text-neutral-900">{p.budgetBurn}</p></div>
              <div><p className="text-neutral-500">Target Release</p><p className="mt-0.5 font-mono font-semibold text-neutral-900">{p.targetRelease}</p></div>
              <div><p className="text-neutral-500">Deliverables</p><p className="mt-0.5 font-mono font-semibold text-neutral-900">{p.deliverables}</p></div>
            </div>
          </div>
        </Section>
      )}

      {detail?.assets?.length > 0 && (
        <Section icon={KeyRound} title="Connected Assets & Vault Credentials" right={<span className="font-mono text-xs font-semibold text-green-600">● {detail.assets.length} Active</span>}>
          <ul className="space-y-2">
            {detail.assets.map((a) => {
              const Icon = ASSET_ICONS[a.icon] ?? Server
              const Action = ACTION_ICONS[a.action] ?? Lock
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-lg bg-indigo-50/60 px-3 py-2.5">
                  <Icon size={16} className="shrink-0 text-primary-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{a.title}</p>
                    <p className="truncate font-mono text-[11px] text-neutral-500">{a.meta}</p>
                  </div>
                  <button type="button" aria-label={`${a.action} — ${a.title}`} onClick={() => onAssetAction(a)} className="rounded-md p-1.5 text-neutral-500 hover:bg-white">
                    <Action size={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      {f && (
        <Section icon={AlarmClock} title="Renewal & Billing Forecast">
          <div className="rounded-xl bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <Bell size={16} className="mt-0.5 shrink-0 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">{f.title}</p>
                <p className="mt-1 text-xs text-neutral-600">{f.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => onAction('review-proposal')} className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">{f.proposalLabel}</button>
                  <button type="button" onClick={() => onAction('contact')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">{f.contactLabel}</button>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}
    </Drawer>
  )
}