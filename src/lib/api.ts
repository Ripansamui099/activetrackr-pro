import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Generic CRUD operations
  create: async (endpoint: string, data: any) => {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data;
  },
  
  getAll: async (endpoint: string) => {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data;
  },
  
  getById: async (endpoint: string, id: string) => {
    const response = await axios.get(`${API_URL}/${endpoint}/${id}`);
    return response.data;
  },
  
  update: async (endpoint: string, id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${endpoint}/${id}`, data);
    return response.data;
  },
  
  delete: async (endpoint: string, id: string) => {
    const response = await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return response.data;
  },
  
  search: async (endpoint: string, query: string) => {
    const response = await axios.get(`${API_URL}/${endpoint}/search/${query}`);
    return response.data;
  },
};
