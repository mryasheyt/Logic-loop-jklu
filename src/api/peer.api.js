import api from './axios'

export const createPeerPost = (data) => api.post('/peer/post', data)
export const getPeerFeed = (category) => {
    const params = category && category !== 'all' ? `?category=${category}` : ''
    return api.get(`/peer/feed${params}`)
}
export const reactToPost = (id, reactionType) => api.post(`/peer/${id}/react`, { reactionType })
export const flagPost = (id) => api.post(`/peer/${id}/flag`)
