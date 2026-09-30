import axiosInstance from './axiosInstance'

const ENDPOINT = '/projects'

// NOTE for the backend: register /projects/stats and /projects/facets
// BEFORE /projects/:id, otherwise "stats" is treated as an id.
export const projectsApi = {
  getAll:    (params) =>   axiosInstance.get(ENDPOINT, { params }),
  getById:   (id) =>       axiosInstance.get(`${ENDPOINT}/${id}`),
  getStats:  (params) =>   axiosInstance.get(`${ENDPOINT}/stats`, { params }),
  getFacets: () =>         axiosInstance.get(`${ENDPOINT}/facets`),
  create:    (data) =>     axiosInstance.post(ENDPOINT, data),
  update:    (id, data) => axiosInstance.put(`${ENDPOINT}/${id}`, data),
  remove:    (id) =>       axiosInstance.delete(`${ENDPOINT}/${id}`),
}