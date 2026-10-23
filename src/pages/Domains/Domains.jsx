import { Download, RefreshCw, Plus, ChevronDown } from 'lucide-react'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import useToast from '@/hooks/useToast'
import useDomainsOverview from '@/hooks/useDomainsOverview'
import { formatRelativeTime } from '@/utils'
import DomainStatCards from './components/DomainStatCards'
import DomainWorkspace from './components/DomainWorkspace'
export default function Domains() {
  const { toast, showToast } = useToast()
  const { sync, stats, loading, error, refetch } = useDomainsOverview()

  const handleFlushDns = () => {
    // TODO(api): POST /domains/flush-dns, then refetch
    refetch()
    showToast('Flushing DNS cache… (not wired yet)')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            Operations <span className="font-normal text-neutral-500">/ Domains &amp; Hosting / Fleet &amp; Infrastructure Directory</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Domains &amp; Hosting Management</h1>
            {sync && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-medium uppercase text-primary-700">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                {sync.label} {sync.version}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-xl text-sm text-neutral-500">
            Centralized provisioning, real-time DNS propagation, cloud instance monitoring, registrar burn allocation,
            and SSL lifecycle telemetry across all active client infrastructure.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:shrink-0 lg:items-end">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-neutral-600">
              <RefreshCw size={15} className="shrink-0 text-neutral-500" />
              {sync?.checkedAt ? `Checked ${formatRelativeTime(sync.checkedAt)}` : 'Checking…'}
              <button
                type="button"
                onClick={handleFlushDns}
                className="font-medium text-primary-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                Flush DNS
              </button>
            </div>
            <Button
              variant="secondary"
              size="lg"
              icon={Download}
              onClick={() => showToast('Export manifest (not wired yet)')}
            >
              Export Manifest
            </Button>
          </div>
          <Button size="lg" icon={Plus} onClick={() => showToast('Register / add infrastructure (not wired yet)')}>
            Register / Add Infrastructure
            <ChevronDown size={14} className="shrink-0" />
          </Button>
        </div>
      </div>

      <DomainStatCards stats={stats} loading={loading} error={error} onRetry={refetch} />

      <DomainWorkspace showToast={showToast} />

    

      <Toast message={toast} />
    </div>
  )
}