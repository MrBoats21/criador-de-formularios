import { api } from './api';

export const formService = {
  getAll: () => api.get('/forms'),
  getByCompany: (companyId) => api.get(`/forms/company/${companyId}`),
  create: (data) => api.post('/forms', data),
  update: (id, data) => api.put(`/forms/${id}`, data),
  delete: (id) => api.delete(`/forms/${id}`)
};