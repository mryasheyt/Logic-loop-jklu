import api from './axios'

export const createChatSession = (sessionType = 'freeform') => api.post('/chat/session', { sessionType })
export const sendMessage = (sessionId, content) => api.post(`/chat/session/${sessionId}/message`, { content, role: 'user' })
export const getChatHistory = () => api.get('/chat/history')
