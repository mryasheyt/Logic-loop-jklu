import api from './axios'

export const logMood = (data) => api.post('/mood/log', data)
export const getMoodHistory = (days = 7) => api.get(`/mood/history?days=${days}`)
export const getMoodVelocity = () => api.get('/mood/velocity')
export const getMoodInsights = () => api.get('/mood/insights')
