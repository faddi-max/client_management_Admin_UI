import axiosInstance from './axiosInstance'

const ENDPOINT = '/projects'

export const projectsApi = {
  getAll:  (params) =>   axiosInstance.get(ENDPOINT, { params }),
  getById: (id) =>       axiosInstance.get(`${ENDPOINT}/${id}`),
  create:  (data) =>     axiosInstance.post(ENDPOINT, data),
  update:  (id, data) => axiosInstance.put(`${ENDPOINT}/${id}`, data),
  remove:  (id) =>       axiosInstance.delete(`${ENDPOINT}/${id}`),
}
