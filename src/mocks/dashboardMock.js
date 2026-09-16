export const dashboardMock = {
  stats: {
    totalClients: { value: 42, trendLabel: '+3 this month', note: '38 active, 4 onboarding' },
    activeProjects: { value: 19, trendLabel: '14 on track', note: '3 client review, 2 blocked' },
    pendingPayments: { value: '$48,200', note: '7 milestones pending', subNote: 'Awaiting PO sign-off' },
    overdueInvoices: { value: '$14,850', badgeCount: 3, note: 'Action req.' },
    upcomingRenewals: { value: 11, note: 'Within 14 days', subNote: '6 dom, 3 host, 2 maint' },
    outstandingBalance: { value: '$86,400', note: 'Unbilled active pipeline', subNote: 'Across all active tracks' },
  },

  funnel: {
    pipelineVersion: 'SOP v4.2 Pipeline',
    activeStepId: 'project-create',
    steps: [
      { id: 'client-add', label: 'Client Add' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'price-calculate', label: 'Price Calculate' },
      { id: 'proposal', label: 'Proposal' },
      { id: 'project-create', label: 'Project Create', count: 19 },
      { id: 'payment-track', label: 'Payment Track' },
      { id: 'invoice', label: 'Invoice' },
      { id: 'credentials-domain-hosting', label: 'Credentials/Domain/Hosting' },
      { id: 'renewal-reminder', label: 'Renewal Reminder' },
    ],
  },

  cashflow: {
    subtitle: 'Real-time breakdown of billed accounts for Q2 rolling cycle',
    gross: 247050,
    segments: [
      { label: 'Paid', value: 184000, percent: 74.4, color: '#4f46e5' },
      { label: 'Pending', value: 48200, percent: 19.5, color: '#ddd6fe' },
      { label: 'Overdue', value: 14850, percent: 6.1, color: '#f97316' },
    ],
    trend: {
      changePercent: 18.4,
      dsoAverage: 17.2,
      data: [12, 14, 13, 16, 18, 20, 19, 22, 24, 23, 26],
    },
  },

  attentionCenter: {
    requiredCount: 4,
    description: 'Immediate escalations requiring operational leadership sign-off.',
    alerts: [
      {
        id: 'overdue-invoices',
        icon: 'AlertTriangle',
        iconColor: 'text-orange-500',
        title: '3 Overdue Invoices ($14,850)',
        badge: { label: 'High Priority', variant: 'danger' },
        description: 'Overdue past 7-day grace period. Requires 2nd reminder dispatch.',
        actions: [
          { label: 'Send WhatsApp/Email', variant: 'primary' },
          { label: 'Details', variant: 'secondary' },
        ],
      },
      {
        id: 'client-proposals',
        icon: 'FileText',
        iconColor: 'text-primary-500',
        title: '2 Client Proposals',
        badge: { label: 'Review', variant: 'neutral' },
        description: 'Awaiting executive sign-off for HyperScale AI ($72k) & OmniRetail ($44k).',
        actions: [{ label: 'Review Proposals', variant: 'primary' }],
      },
      {
        id: 'domains-ssl',
        icon: 'ShieldAlert',
        iconColor: 'text-amber-500',
        title: '4 Domains & SSL Expiring',
        badge: { label: 'Within 7d', variant: 'warning' },
        description: 'Registrar authentication required for nameserver reconfiguration.',
        actions: [],
      },
    ],
  },

  renewals: {
    totalCount: 48,
    dueWithinDays: 14,
    criticalCount: 11,
    rows: [
      {
        id: 1,
        asset: 'checkout.luminahe...',
        client: 'Lumina Health',
        type: 'SSL Wildcard',
        renewalDate: 'Feb 12',
        dueToday: true,
        annualCost: '$240.00',
      },
    ],
  },
}