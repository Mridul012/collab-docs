import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

export const register = (name, email, password) =>
  api.post('/api/auth/register', { name, email, password })

export const loginUser = (email, password) =>
  api.post('/api/auth/login', { email, password })

export const getDocuments = () =>
  api.get('/api/documents')

export const createDocument = () =>
  api.post('/api/documents')

export const updateDocument = (id, data) =>
  api.put(`/api/documents/${id}`, data)

export const deleteDocument = (id) =>
  api.delete(`/api/documents/${id}`)

export const getDocument = (id) =>
  api.get(`/api/documents/${id}`).then(res => res.data)

export const saveVersion = (id, snapshot, label) =>
  api.post(`/api/documents/${id}/versions`, { snapshot, label })
    .then(res => res.data)

export const getVersions = (id) =>
  api.get(`/api/documents/${id}/versions`).then(res => res.data)

export const shareDocument = (id) =>
  api.post(`/api/documents/${id}/share`)

export const getSharedDocument = (token) =>
  api.get(`/api/documents/share/${token}`)

export const getShareStatus = (id) =>
  api.get(`/api/documents/${id}/share-status`)
