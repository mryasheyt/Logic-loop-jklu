import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import { socket } from '../socket'
import ChatBubble from '../components/ChatBubble'
import RiskLevelBadge from '../components/RiskLevelBadge'
import CrisisModal from '../components/CrisisModal'

const sessionTypes = [
    { value: 'freeform', label: '💬 Free Chat' },
    { value: 'guided', label: '🧭 Guided' },
    { value: 'checkin', label: '📋 Check-in' },
]

export default function Chat() {
    const { sessionId, messages, riskLevel, loading, sessionLoading, startSession, send } = useChat()
    const [input, setInput] = useState('')
    const [sessionType, setSessionType] = useState('freeform')
    const [crisisOpen, setCrisisOpen] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        startSession(sessionType)
    }, []) // eslint-disable-line

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (riskLevel === 'high') setCrisisOpen(true)
    }, [riskLevel])

    useEffect(() => {
        const handler = () => setCrisisOpen(true)
        socket.on('crisis:escalated', handler)
        return () => socket.off('crisis:escalated', handler)
    }, [])

    const handleSend = async () => {
        if (!input.trim() || loading) return
        const msg = input
        setInput('')
        await send(msg)
        inputRef.current?.focus()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-[calc(100vh-64px)]"
        >
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-xl">🧠</span>
                    <h1 className="font-semibold text-text-dark">MindMate AI</h1>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={sessionType}
                        onChange={e => setSessionType(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-gray focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        {sessionTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <RiskLevelBadge level={riskLevel} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 bg-bg">
                {sessionLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-sm text-text-gray">Starting your session...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-sm">
                            <span className="text-5xl block mb-4">🧠</span>
                            <h2 className="text-xl font-semibold text-text-dark mb-2">Hi there!</h2>
                            <p className="text-text-gray text-sm leading-relaxed">
                                I'm MindMate, your AI mental health companion.
                                Share what's on your mind — I'm here to listen and support you. 💙
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <ChatBubble key={i} role={msg.role} content={msg.content} />
                        ))}
                        {loading && (
                            <div className="flex justify-start mb-3">
                                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2 mt-1">
                                    <span className="text-sm">🧠</span>
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-50">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Share what's on your mind..."
                        rows={1}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="px-5 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-40 shrink-0"
                    >
                        Send
                    </button>
                </div>
            </div>

            <CrisisModal isOpen={crisisOpen} onClose={() => setCrisisOpen(false)} />
        </motion.div>
    )
}
