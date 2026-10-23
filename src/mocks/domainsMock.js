const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const ago = (mins) => new Date(Date.now() - mins * 60000).toISOString()

// Shape = the contract the backend `GET /domains/overview` should return.
const OVERVIEW = {
  sync: { version: 'v4.12', label: 'CLOUD TELEMETRY SYNC', checkedAt: null },
  stats: {
    domains: { value: 64, healthy: 58, expiringSoon: 6 },
    servers: { value: 28, uptimePercent: 99.98, critical: 0 },
    annualBurn: { value: 34820, billed: 58400, marginPercent: 68, profit: 23580 },
    actionRequired: { expiring: 3, autoRenewOff: 2, glueRecordErrors: 1 },
  },
}

export async function mockFetchDomainsOverview() {
  await delay(300)
  const data = structuredClone(OVERVIEW)
  data.sync.checkedAt = ago(3) // mock: "Checked 3 mins ago"
  return data
}