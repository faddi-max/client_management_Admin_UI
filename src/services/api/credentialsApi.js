import axiosInstance from './axiosInstance'

const ENDPOINT = '/credentials'

// NOTE for the backend:
//  - register /credentials/overview and /credentials/facets BEFORE /credentials/:id
//  - list / getById / create responses must NEVER contain the secret value
//  - reveal and copy are POST (never cached, never in URLs/query strings) and each writes an audit_log row
export const credentialsApi = {
  getAll:      (params) => axiosInstance.get(ENDPOINT, { params }),
  getOverview: () =>       axiosInstance.get(`${ENDPOINT}/overview`),
  getFacets:   () =>       axiosInstance.get(`${ENDPOINT}/facets`),
  create:      (data) =>   axiosInstance.post(ENDPOINT, data),
  reveal:      (id) =>     axiosInstance.post(`${ENDPOINT}/${id}/reveal`),
  copy:        (id) =>     axiosInstance.post(`${ENDPOINT}/${id}/copy`),
}