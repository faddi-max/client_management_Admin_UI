import { domainsApi } from '@/services/api/domainsApi'
import { mockFetchDomainsOverview } from '@/mocks/domainsMock'
import { mockFetchDomainAssets, mockFetchDomainAssetDetail, mockFetchDomainFacets } from '@/mocks/domainAssetsMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

// The UI uses 'all' / '' to mean "no filter", so never send those to the API.
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all'))

/**
 * @typedef {Object} DomainsOverview
 * @property {{ version: string, label: string, checkedAt: string|null }} sync   checkedAt = ISO datetime of last DNS/telemetry check
 * @property {{ domains:        { value: number, healthy: number, expiringSoon: number },
 *              servers:        { value: number, uptimePercent: number, critical: number },
 *              annualBurn:     { value: number, billed: number, marginPercent: number, profit: number },
 *              actionRequired: { expiring: number, autoRenewOff: number, glueRecordErrors: number } }} stats
 */

/** Contract: () → DomainsOverview. If the backend differs, adapt it HERE and nowhere else. */
export async function fetchDomainsOverview() {
  if (USE_MOCK) return mockFetchDomainsOverview()
  const { data } = await domainsApi.getOverview()
  return data
}

/**
 * @typedef {Object} DomainAssetRow  — the backend sends FACTS; the UI derives "in 18 days", dot colour, pill tones
 * @property {string|number} id
 * @property {string} hostname
 * @property {string} ip
 * @property {string} role                         "Edge Apex", "Cluster Ingress"…
 * @property {'domain'|'hosting'|'dns'|'ssl'} kind
 * @property {string} typeLabel                    "Apex Domain (TLD)"
 * @property {{ id: string|number, name: string, initials: string, logoColor: string }} client
 * @property {string} provider                     "Cloudflare", "AWS us-east-1"
 * @property {'locked'|'verified'|null} protection
 * @property {'healthy'|'critical'} health
 * @property {string} renewalDate                  'YYYY-MM-DD'
 * @property {number} cost                         what we pay
 * @property {number} billed                       what the client pays
 * @property {'yr'|'mo'} period
 * @property {number} marginPercent
 */

/**
 * Contract: params → { items: DomainAssetRow[], meta: { total, page, perPage } }
 * params: page, perPage, search, sort (renewal|name|cost), order (asc|desc),
 *         kind, client,
 *         provider       comma-separated provider slugs, e.g. "cloudflare,aws"
 *         renewalWithin  number of days, e.g. 30
 *         status         healthy | expiring | critical
 * Stable module-level function (required by useResourceList).
 */
export async function fetchDomainAssets(params) {
  if (USE_MOCK) return mockFetchDomainAssets(params)
  const { data } = await domainsApi.getAll(cleanParams(params))
  return { items: data.items, meta: data.meta }
}

/**
 * @typedef {Object} DomainFacets  — counts over ALL assets, not the current page/filters
 * @property {number} total
 * @property {Array<{ value: string, label: string, count: number }>} kinds
 * @property {Array<{ value: string, label: string }>} clients      clients that have assets
 * @property {Array<{ value: string, label: string }>} providers    value = slug sent back as `provider`
 */

/** Contract: () → DomainFacets. Feeds the tab counts and the Client / Provider filters. */
export async function fetchDomainFacets() {
  if (USE_MOCK) return mockFetchDomainFacets()
  const { data } = await domainsApi.getFacets()
  return data
}

/**
 * @typedef {Object} DomainAssetDetail  — extra payload for the side panel
 * @property {'active'|'inactive'} zone
 * @property {string} registrar
 * @property {string} environment
 * @property {Array<{ host: string, ip: string }>} nameservers
 * @property {Array<{ id: string, type: 'A'|'CNAME'|'MX'|'TXT', name: string, value: string,
 *                    proxied?: boolean, priority?: number, check?: string }>} records
 */

/** Contract: id → DomainAssetDetail | null. Sections without data are simply not rendered. */
export async function fetchDomainAssetDetail(id) {
  if (USE_MOCK) return mockFetchDomainAssetDetail(id)
  const { data } = await domainsApi.getById(id)
  return data
}