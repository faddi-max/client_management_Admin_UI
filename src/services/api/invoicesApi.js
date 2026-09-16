import axiosInstance from './axiosInstance'

const ENDPOINT = '/invoices'

export const invoicesApi = {
  getAll:  (params) =>   axiosInstance.get(ENDPOINT, { params }),
  getById: (id) =>       axiosInstance.get(`${ENDPOINT}/${id}`),
  create:  (data) =>     axiosInstance.post(ENDPOINT, data),
  update:  (id, data) => axiosInstance.put(`${ENDPOINT}/${id}`, data),
  remove:  (id) =>       axiosInstance.delete(`${ENDPOINT}/${id}`),
  send:    (id) =>       axiosInstance.post(`${ENDPOINT}/${id}/send`),
}
