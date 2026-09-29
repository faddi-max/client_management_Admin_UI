const DETAILS = {
  1: {
    legalName: 'Lumina Health, Inc.',
    clientCode: 'CLI-9042',
    segmentLabel: 'HealthTech Enterprise',
    paymentTerms: 'Net 30 terms',
    renewalDate: 'Nov 15, 2024',
    leadTitle: 'Ops Director',
    project: {
      name: 'HIPAA Compliance Portal Phase 2', sprint: 'SPRINT 8', progress: 82,
      summary: 'End-to-end patient consent architecture with audit logging.',
      budgetBurn: '$42,800 / $52k', targetRelease: 'Nov 28, 2024', deliverables: '14 / 17 Closed',
    },
    assets: [
      { id: 'a1', icon: 'server', title: 'luminahealth.io (Cloudflare Enterprise)', meta: 'Nameservers: dora.cloudflare.com, jim.cloudflare.com', action: 'copy' },
      { id: 'a2', icon: 'terminal', title: 'AWS Production Cluster (EKS)', meta: 'Role: arn:aws:iam::049219412:role/KineticDeploy', action: 'locked' },
      { id: 'a3', icon: 'code', title: 'GitHub Org Repo (lumina-core)', meta: 'Deploy Key: SHA256:v1zE93...', action: 'reveal' },
    ],
    forecast: {
      title: 'Q1 2025 Annual SLA Expansion',
      description: 'Client requested adding 40 monthly engineering hours. New proposal drafted for $32,000/mo.',
      proposalLabel: 'Review Proposal #PROP-481', contactLabel: 'Contact Dr. Vance',
    },
  },
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
export async function mockFetchClientDetail(id) { await delay(150); return DETAILS[id] ?? null }