import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6767/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authors
export const authorsApi = {
  getAll: () => api.get('/authors'),
  getById: (id: number) => api.get(`/authors/${id}`),
  create: (data: { name: string; bio?: string }) => api.post('/authors', data),
  update: (id: number, data: { name?: string; bio?: string }) => api.put(`/authors/${id}`, data),
  delete: (id: number) => api.delete(`/authors/${id}`),
}

// Books
export const booksApi = {
  getAll: () => api.get('/books'),
  getById: (id: number) => api.get(`/books/${id}`),
  create: (data: { title: string; isbn: string; authorId: number; quantity?: number }) => api.post('/books', data),
  update: (id: number, data: Partial<{ title: string; isbn: string; authorId: number; quantity: number }>) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
}

// Members
export const membersApi = {
  getAll: () => api.get('/members'),
  getById: (id: number) => api.get(`/members/${id}`),
  create: (data: { name: string; email: string; phone?: string }) => api.post('/members', data),
  update: (id: number, data: Partial<{ name: string; email: string; phone: string }>) => api.put(`/members/${id}`, data),
  delete: (id: number) => api.delete(`/members/${id}`),
}

// Loans
export const loansApi = {
  getAll: () => api.get('/loans'),
  borrow: (data: { bookId: number; memberId: number }) => api.post('/loans/borrow', data),
  return: (id: number) => api.post(`/loans/return/${id}`),
  getMemberLoans: (memberId: number) => api.get(`/loans/member/${memberId}`),
}

export default api
