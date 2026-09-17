import { LayoutDashboard, Users, Diamond, CalendarClock, AlertTriangle, RefreshCw, Landmark, ArrowUpRight, CircleDot, FileText, ShieldAlert, Clock, Download, ShieldCheck } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import PageHeader from '@/components/common/PageHeader'
import Toast from '@/components/common/Toast'
import useToast from '@/hooks/useToast'
import { dashboardMock } from '@/mocks/dashboardMock'
import DeliveryFunnel from '@/components/common/DeliveryFunnel'
import CashflowVelocityCard from './components/CashflowVelocityCard'
import AttentionCenter from './components/AttentionCenter'
import RenewalsTable from './components/RenewalsTable'

const ICONS = { AlertTriangle, FileText, ShieldAlert }

export default function Dashboard() {
  const { stats, funnel, cashflow, attentionCenter, renewals } = dashboardMock
  const { toast, showToast } = useToast()

  const alerts = attentionCenter.alerts.map((a) => ({
    ...a,
    icon: ICONS[a.icon],
    actions: a.actions.map((act) => ({ ...act, onClick: () => showToast(`${act.label} — done`) })),
  }))

  const headerActions = [
    { key: 'generate-runbook', label: 'Generate Runbook', icon: Download, variant: 'neutral', row: 1, onClick: () => showToast('Runbook generated') },
    { key: 'dispatch-incident', label: 'Dispatch Incident', icon: ShieldCheck, variant: 'primary', row: 1, onClick: () => showToast('Incident dispatched') },
    { key: 'timeline-sync', label: 'Timeline Sync', icon: Clock, variant: 'amber', row: 2, onClick: () => showToast('Timeline synced') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader actions={headerActions} />
      <Toast message={toast} />

      <div className="grid grid-cols-1 min-[430px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard icon={Users} iconClassName="text-sky-500" label="Total Clients" value={stats.totalClients.value}>
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={12} /> {stats.totalClients.trendLabel}
          </p>
          <p className="text-xs text-neutral-400">{stats.totalClients.note}</p>
        </StatCard>

        <StatCard icon={Diamond} iconClassName="text-primary-500" label="Active Projects" value={stats.activeProjects.value}>
          <p className="flex items-center gap-1 text-xs font-medium text-primary-600">
            <CircleDot size={10} /> {stats.activeProjects.trendLabel}
          </p>
          <p className="text-xs text-neutral-400">{stats.activeProjects.note}</p>
        </StatCard>

        <StatCard icon={CalendarClock} iconClassName="text-sky-500" label="Pending Payments" value={stats.pendingPayments.value}>
          <p className="text-xs font-medium text-primary-600">{stats.pendingPayments.note}</p>
          <p className="text-xs text-neutral-400">{stats.pendingPayments.subNote}</p>
        </StatCard>

        <StatCard
          icon={AlertTriangle}
          iconClassName="text-orange-500"
          iconWrapperClassName="bg-orange-100"
          label="Overdue Invoices"
          value={stats.overdueInvoices.value}
          valueClassName="text-orange-600"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center gap-1 leading-none px-2 py-1 rounded-lg bg-orange-500 text-white shrink-0">
              <span className="text-xs font-bold">{stats.overdueInvoices.badgeCount}</span>
              <span className="text-[9px] font-bold tracking-wide">OVERDUE</span>
            </span>
            <span className="text-xs font-medium text-primary-600">{stats.overdueInvoices.note}</span>
          </div>
        </StatCard>

        <StatCard icon={RefreshCw} iconClassName="text-primary-500" label="Upcoming Renewals" value={stats.upcomingRenewals.value}>
          <p className="text-xs font-medium text-primary-600">{stats.upcomingRenewals.note}</p>
          <p className="text-xs text-neutral-400">{stats.upcomingRenewals.subNote}</p>
        </StatCard>

        <StatCard icon={Landmark} iconClassName="text-sky-500" label="Outstanding Balance" value={stats.outstandingBalance.value}>
          <p className="text-xs font-medium text-primary-600">{stats.outstandingBalance.note}</p>
          <p className="text-xs text-neutral-400">{stats.outstandingBalance.subNote}</p>
        </StatCard>
      </div>

      <DeliveryFunnel
        pipelineVersion={funnel.pipelineVersion}
        steps={funnel.steps}
        initialActiveStepId={funnel.activeStepId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <CashflowVelocityCard subtitle={cashflow.subtitle} gross={cashflow.gross} segments={cashflow.segments} trend={cashflow.trend} />
          <RenewalsTable
            totalCount={renewals.totalCount}
            dueWithinDays={renewals.dueWithinDays}
            rows={renewals.rows}
            onViewAll={() => showToast('Opening all renewals…')}
          />
        </div>
        <AttentionCenter requiredCount={attentionCenter.requiredCount} description={attentionCenter.description} alerts={alerts} />
      </div>
    </div>
  )
}
