import axiosInstance from './axiosInstance'

const ENDPOINT = '/requirements'

// create/update send multipart FormData (reference files). The shared axios instance defaults to
// application/json, which would make axios serialise FormData to JSON and drop the files,
// so the multipart header is set explicitly here.
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } }

export const requirementsApi = {
  getAll:  (params) =>   axiosInstance.get(ENDPOINT, { params }),
  getById: (id) =>       axiosInstance.get(`${ENDPOINT}/${id}`),
  create:  (formData) => axiosInstance.post(ENDPOINT, formData, MULTIPART),
  update:  (id, formData) => axiosInstance.put(`${ENDPOINT}/${id}`, formData, MULTIPART),
  remove:  (id) =>       axiosInstance.delete(`${ENDPOINT}/${id}`),
}