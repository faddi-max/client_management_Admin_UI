import { ShieldCheck, ShieldAlert } from 'lucide-react'
import Card from '@/components/common/Card'

/** Top-right "encryption active" card. */
export function VaultStatusCard({ vault }) {
  return (
    <Card padding="p-3.5" className="flex w-full items-center gap-3 lg:w-[368px]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
        <ShieldCheck size={20} className="fill-primary-600 text-white" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-900">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
          {vault.encryptionLabel}
        </p>
        <p className="mt-0.5 font-mono text-xs text-neutral-500">{vault.encryptionNote}</p>
      </div>
    </Card>
  )
}

const DEFAULT_MESSAGE =
  'Credential access is logged with user identity and timestamp. Passwords remain masked until explicit, audited authorization.'

/** "Security Protocol Enforced" strip — white card with an orange left rule. */
export function SecurityNotice({ message = DEFAULT_MESSAGE, complianceLabel }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-l-4 border-orange-500 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
        <ShieldAlert size={20} />
      </span>
      <p className="min-w-0 flex-1 text-sm text-neutral-700">
        <span className="text-[17px] font-semibold text-orange-800">Security Protocol Enforced:</span> {message}
      </p>
      {complianceLabel && (
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-neutral-500">
          <ShieldCheck size={14} className="text-amber-700" />
          {complianceLabel}
        </span>
      )}
    </div>
  )
}