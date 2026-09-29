import { clientsApi } from '@/services/api/clientsApi'
import {
  mockFetchClients, mockCreateClient, STATUS_FILTER_OPTIONS, LEAD_FILTER_OPTIONS,
} from '@/mocks/clientsListMock'
import { mockFetchClientDetail } from '@/mocks/clientDetailMock'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

// TODO(api): replace with a filters/facets endpoint
export { STATUS_FILTER_OPTIONS, LEAD_FILTER_OPTIONS }

/**
 * Contract: params → { items, meta: { total, page, perPage } }
 * If the backend's response shape differs, adapt it HERE and nowhere else.
 * Stable module-level function (required by useResourceList).
 */
export async function fetchClients(params) {
  if (USE_MOCK) return mockFetchClients(params)
  const { data } = await clientsApi.getAll(params)
  return { items: data.items, meta: data.meta }
}

export async function createClient(values) {
  if (USE_MOCK) return mockCreateClient(values)
  const { data } = await clientsApi.create(values)
  return data
}


export async function fetchClientDetail(id) {
  if (USE_MOCK) return mockFetchClientDetail(id)
  const { data } = await clientsApi.getById(id)
  return data
}