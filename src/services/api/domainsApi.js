import axiosInstance from './axiosInstance'

const ENDPOINT = '/domains'

// NOTE for the backend: register /domains/overview and /domains/facets
// BEFORE /domains/:id, otherwise they are treated as an id.
export const domainsApi = {
  getAll:      (params) => axiosInstance.get(ENDPOINT, { params }),
  getOverview: () =>       axiosInstance.get(`${ENDPOINT}/overview`),
  getFacets:   () =>       axiosInstance.get(`${ENDPOINT}/facets`),
  getById:     (id) =>     axiosInstance.get(`${ENDPOINT}/${id}`),
}