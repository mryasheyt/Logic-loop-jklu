import { useState, useCallback } from 'react'
import { createChatSession, sendMessage, getChatHistory } from '../api/chat.api'

export const useChat = () => {
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages] = useState([])
    const [riskLevel, setRiskLevel] = useState('none')
    const [loading, setLoading] = useState(false)
    const [sessionLoading, setSessionLoading] = useState(false)

    const startSession = useCallback(async (type = 'freeform') => {
        setSessionLoading(true)
        try {
            const { data } = await createChatSession(type)
            setSessionId(data.sessionId || data._id)
            setMessages(data.messages || [])
            setRiskLevel(data.riskLevel || 'none')
            return data
        } finally {
            setSessionLoading(false)
        }
    }, [])

    const send = useCallback(async (content) => {
        if (!sessionId || !content.trim()) return
        const userMsg = { role: 'user', content }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)
        try {
            const { data } = await sendMessage(sessionId, content)
            setMessages(prev => [...prev, data.message])
            setRiskLevel(data.riskLevel || 'none')
            return data
        } finally {
            setLoading(false)
        }
    }, [sessionId])

    const loadHistory = useCallback(async () => {
        try {
            const { data } = await getChatHistory()
            return data.sessions || data
        } catch {
            return []
        }
    }, [])

    return { sessionId, messages, riskLevel, loading, sessionLoading, startSession, send, loadHistory }
}
