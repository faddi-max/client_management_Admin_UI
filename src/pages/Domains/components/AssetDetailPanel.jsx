import { Info, X } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import IconAction from '@/components/common/IconAction'
import { cn } from '@/utils'

const LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-500'
const TYPE_CHIP = 'w-14 shrink-0 rounded bg-indigo-100 py-0.5 text-center font-mono text-[11px] font-bold text-primary-700'

function Section({ title, right, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={LABEL}>{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}

/** Display rules per record type: the API sends facts (name, value, proxied…). */
function recordView(r) {
  if (r.type === 'MX') return { text: r.value, mono: `p:${r.priority}` }
  if (r.type === 'TXT') return { text: r.value, mono: r.check }
  return { text: `${r.name} → ${r.value}`, proxied: r.proxied }
}

/**
 * asset = list row (shown immediately). detail = optional payload from fetchDomainAssetDetail
 * (sections without data are simply not rendered).
 */
export default function AssetDetailPanel({ asset, detail, loading = false, error = false, onClose, onInfo, className }) {
  if (!asset) return null

  return (
    <Card padding="p-0" className={cn('overflow-hidden', className)}>
      <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-neutral-900">{asset.hostname}</h2>
            {detail && (
              <Badge variant={detail.zone === 'active' ? 'success' : 'warningSoft'}>
                {detail.zone === 'active' ? 'Active Zone' : 'Inactive Zone'}
              </Badge>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-neutral-500">
            {detail ? `${detail.registrar} • ${detail.environment}` : asset.provider}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconAction icon={Info} label="Asset info" onClick={onInfo} />
          <IconAction icon={X} label="Close panel" onClick={onClose} />
        </div>
      </header>

      <div className="space-y-6 p-5">
        {loading && <p className="text-xs text-neutral-400">Loading asset details…</p>}
        {error && <p className="text-xs text-red-500">Could not load asset details.</p>}

        {detail?.nameservers?.length > 0 && (
          <Section title="Authoritative Nameservers">
            <ul className="space-y-2 rounded-xl bg-indigo-50 p-3">
              {detail.nameservers.map((ns) => (
                <li key={ns.host} className="flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="flex min-w-0 items-center gap-2 text-neutral-800">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span className="truncate">{ns.host}</span>
                  </span>
                  <span className="shrink-0 text-neutral-500">{ns.ip}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {detail?.records?.length > 0 && (
          <Section
            title="DNS Record Mapping"
            right={<span className="text-xs font-semibold text-primary-600">{detail.records.length} Active Records</span>}
          >
            <ul className="space-y-2">
              {detail.records.map((r) => {
                const v = recordView(r)
                return (
                  <li key={r.id} className="flex items-center gap-3 rounded-lg bg-indigo-50/60 px-3 py-2.5">
                    <span className={TYPE_CHIP}>{r.type}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-neutral-800">{v.text}</span>
                    {v.proxied && (
                      <span className="shrink-0 rounded-md bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700">Proxied</span>
                    )}
                    {v.mono && <span className="shrink-0 font-mono text-[11px] text-neutral-500">{v.mono}</span>}
                  </li>
                )
              })}
            </ul>
          </Section>
        )}
      </div>
    </Card>
  )
}