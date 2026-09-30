const DETAILS = {
  101: {
    code: 'PRJ-0101',
    description: 'Production model-serving and monitoring infrastructure for HyperScale AI.',
    lead: { name: 'Marcus Vance', title: 'Lead Engineer' },
    milestones: [
      { id: 'm1', name: 'Arch Spec Signed', done: true },
      { id: 'm2', name: '32 User Stories Lock', done: true },
      { id: 'm3', name: 'Cluster Sync', done: true },
      { id: 'm4', name: 'Autoscaling Policies', done: true },
      { id: 'm5', name: 'QA Stress Test Suite', done: false },
      { id: 'm6', name: 'Multi-region Go-live', done: false },
    ],
  },
  102: {
    code: 'PRJ-0102',
    description: 'Patient consent and audit portal, HIPAA-aligned.',
    lead: { name: 'Elena Vance', title: 'Ops Director' },
    milestones: [
      { id: 'm1', name: 'Consent Model', done: true },
      { id: 'm2', name: 'Audit Logging', done: true },
      { id: 'm3', name: 'Access Controls', done: true },
      { id: 'm4', name: 'Pen Test', done: true },
      { id: 'm5', name: 'Client Sign-off', done: true },
    ],
  },
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
export async function mockFetchProjectDetail(id) { await delay(150); return DETAILS[id] ?? null }