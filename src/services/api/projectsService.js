import { projectsApi } from '@/services/api/projectsApi'
import { fetchClients, LEAD_FILTER_OPTIONS } from '@/services/api/clientsService'
import { mockFetchProjectStats, mockCreateProject } from '@/mocks/projectsMock'
import { mockFetchProjects, mockFetchProjectFacets } from '@/mocks/projectsListMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

/**
 * @typedef {Object} ProjectRow  — the backend sends FACTS; the UI derives percentages,
 *                                 "IN 4 DAYS", tones and "Paid in Full" (see projectsUi.js)
 * @property {string|number} id
 * @property {string} name
 * @property {string} [icon]                              cpu | shield | sync | cart | code | globe
 * @property {{ id: string|number, name: string, segment?: string }} client
 * @property {'planning'|'design'|'development'|'testing'|'deployment'} stage
 * @property {'in_progress'|'client_review'|'blocked'|'completed'} status
 * @property {{ done: number, total: number }} milestones
 * @property {Array<{ id: string, name: string, avatarUrl: string|null }>} team
 * @property {string|null} deadline                       'YYYY-MM-DD' (date only, no time zone)
 * @property {number} value                               finance data — permission-gated in the UI
 * @property {number} invoiced
 * @property {number} paid
 */

/**
 * @typedef {Object} ProjectFacets  — counts over ALL projects, not the current page/filters
 * @property {number} total
 * @property {Array<{ value: string, label: string, count: number }>} stages
 * @property {Array<{ value: string, label: string, count: number }>} statuses
 * @property {Array<{ value: string, label: string }>} clients   clients that have projects
 */

// The UI uses 'all' / '' to mean "no filter" — never send those to the API.
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all'))

/**
 * Contract: () → {
 *   activeTracks: { value, accounts },
 *   onTrack:      { value, velocityPercent },
 *   clientReview: { value, avgResponseDays },
 *   blocked:      { value, urgent },
 *   pipeline:     { value, billed, billedPercent },
 * }
 * If the backend response differs, adapt it HERE and nowhere else.
 */
export async function fetchProjectStats() {
  if (USE_MOCK) return mockFetchProjectStats()
  const { data } = await projectsApi.getStats()
  return data
}

/**
 * Contract: params → { items: ProjectRow[], meta: { total, page, perPage } }
 * params: page, perPage, search, sort (deadline|name|value), order (asc|desc),
 *         stage, status, client
 * Stable module-level function (required by useResourceList).
 */
export async function fetchProjects(params) {
  if (USE_MOCK) return mockFetchProjects(params)
  const { data } = await projectsApi.getAll(cleanParams(params))
  return { items: data.items, meta: data.meta }
}

/** Contract: () → ProjectFacets. Feeds the lifecycle tabs and the Status / Client filters. */
export async function fetchProjectFacets() {
  if (USE_MOCK) return mockFetchProjectFacets()
  const { data } = await projectsApi.getFacets()
  return data
}

// Delivery-lead dropdown reuses the Clients account-lead list (minus "All leads").
// TODO(api): replace with a users/team endpoint filtered to delivery roles
export const LEAD_OPTIONS = LEAD_FILTER_OPTIONS.filter((o) => o.value !== 'all')

// Client dropdown reuses the Clients list contract.
// TODO(api): replace with a lightweight `GET /clients/options` (id + name only)
export async function fetchClientOptions() {
  const { items } = await fetchClients({ page: 1, perPage: 100, sort: 'name', order: 'asc' })
  return items.map((c) => ({ value: String(c.id), label: c.name }))
}

/**
 * Form values (from AddProjectModal) → API payload.
 * Milestones are split here so the UI keeps a plain comma-separated string.
 */
export async function createProject(values) {
  const payload = {
    name: values.name.trim(),
    clientId: values.clientId,
    leadId: values.leadId || null,
    budget: values.budget === '' ? null : Number(values.budget),
    targetHandoverDate: values.handoverDate || null,
    milestones: values.milestones.split(',').map((m) => m.trim()).filter(Boolean),
  }
  if (USE_MOCK) return mockCreateProject(payload)
  const { data } = await projectsApi.create(payload)
  return data
}