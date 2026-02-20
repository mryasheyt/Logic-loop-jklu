import api from './axios'

export const submitBurnoutCheckin = (data) => api.post('/burnout/checkin', data)
export const getBurnoutScore = () => api.get('/burnout/score')
export const getBurnoutTrend = () => api.get('/burnout/trend')
