import axiosInstance from './axiosInstance'

const ENDPOINT = '/invoices'

// NOTE for the backend: register /invoices/facets and /invoices/stats
// BEFORE /invoices/:id, otherwise they are treated as an id.
export const invoicesApi = {
  getAll:    (params) =>   axiosInstance.get(ENDPOINT, { params }),
  getFacets: () =>         axiosInstance.get(`${ENDPOINT}/facets`),
  getStats:  () =>         axiosInstance.get(`${ENDPOINT}/stats`),
  getById:   (id) =>       axiosInstance.get(`${ENDPOINT}/${id}`),
  create:    (data) =>     axiosInstance.post(ENDPOINT, data),
  update:    (id, data) => axiosInstance.put(`${ENDPOINT}/${id}`, data),
  remove:    (id) =>       axiosInstance.delete(`${ENDPOINT}/${id}`),
  send:      (id) =>       axiosInstance.post(`${ENDPOINT}/${id}/send`),
}