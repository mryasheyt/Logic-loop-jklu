import api from './axios'

export const escalateCrisis = () => api.post('/crisis/escalate')
export const getCrisisResources = () => api.get('/crisis/resources')
export const getCrisisHotlines = () => api.get('/crisis/hotlines')
