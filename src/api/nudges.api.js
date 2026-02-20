import api from './axios'

export const getPendingNudges = () => api.get('/nudges/pending')
export const dismissNudge = (id) => api.post('/nudges/dismiss', { nudgeId: id })
export const updateNudgePreferences = (data) => api.put('/nudges/preferences', data)
