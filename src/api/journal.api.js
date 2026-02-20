import api from './axios'

export const createJournalEntry = (data) => api.post('/journal/entry', data)
export const getJournalEntries = () => api.get('/journal/entries')
export const updateJournalEntry = (id, data) => api.put(`/journal/${id}`, data)
export const deleteJournalEntry = (id) => api.delete(`/journal/${id}`)
