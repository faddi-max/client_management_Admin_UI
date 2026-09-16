import { LayoutDashboard, Users, Diamond, CalendarClock, AlertTriangle, RefreshCw, Landmark, ArrowUpRight, CircleDot } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import { dashboardMock } from '@/mocks/dashboardMock'
import PageHeader from '@/components/common/PageHeader'
export default function Dashboard() {
  const { stats } = dashboardMock

  return (
    <div className="space-y-6">
       <PageHeader />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">

        <StatCard
          icon={Users}
          iconClassName="text-sky-500"
          label="Total Clients"
          value={stats.totalClients.value}
        >
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={12} /> {stats.totalClients.trendLabel}
          </p>
          <p className="text-xs text-neutral-400">{stats.totalClients.note}</p>
        </StatCard>

        <StatCard
          icon={Diamond}
          iconClassName="text-primary-500"
          label="Active Projects"
          value={stats.activeProjects.value}
        >
          <p className="flex items-center gap-1 text-xs font-medium text-primary-600">
            <CircleDot size={10} /> {stats.activeProjects.trendLabel}
          </p>
          <p className="text-xs text-neutral-400">{stats.activeProjects.note}</p>
        </StatCard>

        <StatCard
          icon={CalendarClock}
          iconClassName="text-sky-500"
          label="Pending Payments"
          value={stats.pendingPayments.value}
        >
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
            <span className="flex flex-col items-center justify-center leading-none px-2 py-1 rounded-lg bg-orange-500 text-white shrink-0">
              <span className="text-xs font-bold">{stats.overdueInvoices.badgeCount}</span>
              <span className="text-[7px] font-bold tracking-wide">OVERDUE</span>
            </span>
            <span className="text-xs font-medium text-primary-600">{stats.overdueInvoices.note}</span>
          </div>
        </StatCard>

        <StatCard
          icon={RefreshCw}
          iconClassName="text-primary-500"
          label="Upcoming Renewals"
          value={stats.upcomingRenewals.value}
        >
          <p className="text-xs font-medium text-primary-600">{stats.upcomingRenewals.note}</p>
          <p className="text-xs text-neutral-400">{stats.upcomingRenewals.subNote}</p>
        </StatCard>

        <StatCard
          icon={Landmark}
          iconClassName="text-sky-500"
          label="Outstanding Balance"
          value={stats.outstandingBalance.value}
        >
          <p className="text-xs font-medium text-primary-600">{stats.outstandingBalance.note}</p>
          <p className="text-xs text-neutral-400">{stats.outstandingBalance.subNote}</p>
        </StatCard>

      </div>
    </div>
  )
}