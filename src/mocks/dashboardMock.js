export const dashboardMock = {
  stats: {
    totalClients: { value: 42, trendLabel: '+3 this month', note: '38 active, 4 onboarding' },
    activeProjects: { value: 19, trendLabel: '14 on track', note: '3 client review, 2 blocked' },
    pendingPayments: { value: '$48,200', note: '7 milestones pending', subNote: 'Awaiting PO sign-off' },
    overdueInvoices: { value: '$14,850', badgeCount: 3, note: 'Action req.' },
    upcomingRenewals: { value: 11, note: 'Within 14 days', subNote: '6 dom, 3 host, 2 maint' },
    outstandingBalance: { value: '$86,400', note: 'Unbilled active pipeline', subNote: 'Across all active tracks' },
  },
}