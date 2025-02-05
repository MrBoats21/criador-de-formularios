import api from '../utils/api';

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};