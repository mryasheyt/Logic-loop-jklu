import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useMoodHistory, useLogMood } from '../hooks/useMood'
import MoodSlider from '../components/MoodSlider'
import EmotionTagSelector from '../components/EmotionTagSelector'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
    const user = useAuthStore(s => s.user)
    const [moodScore, setMoodScore] = useState(5)
    const [emotions, setEmotions] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const { data: moodData } = useMoodHistory(7)
    const logMood = useLogMood()

    const getGreeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    const burnout = user?.burnoutScore || 0
    const riskLevel = user?.burnoutRiskLevel || 'low'
    const isHighRisk = riskLevel === 'high' || riskLevel === 'critical'

    const getBurnoutColor = (s) => {
        if (s < 40) return '#059669'
        if (s <= 70) return '#D97706'
        return '#DC2626'
    }

    const burnoutColor = getBurnoutColor(burnout)
    const circumference = 2 * Math.PI * 45
    const offset = circumference - (burnout / 100) * circumference

    const handleMoodSubmit = async () => {
        try {
            await logMood.mutateAsync({ score: moodScore, emotions })
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
            setEmotions([])
        } catch { /* handled by error boundary */ }
    }

    const chartData = (moodData?.moods || moodData || []).map(m => ({
        day: new Date(m.createdAt || m.date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: m.score,
    }))

    const quickActions = [
        { icon: '💬', label: 'Talk to MindMate', desc: 'Start a conversation', path: '/chat', color: 'from-purple-500 to-purple-700' },
        { icon: '📊', label: 'My Mood', desc: 'Track your journey', path: '/mood', color: 'from-teal-500 to-teal-700' },
        { icon: '🤝', label: 'Peer Feed', desc: "You're not alone", path: '/peer-feed', color: 'from-blue-500 to-blue-700' },
        { icon: '📓', label: 'Journal', desc: 'Write your thoughts', path: '/journal', color: 'from-amber-500 to-amber-700' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 py-6"
        >
            {/* Crisis Banner */}
            {isHighRisk && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 mb-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💙</span>
                        <p className="font-medium">You seem overwhelmed today. Let's talk.</p>
                    </div>
                    <Link to="/chat" className="px-5 py-2 bg-white text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition">
                        Talk Now
                    </Link>
                </motion.div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-dark">{getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'} 👋</h1>
                <p className="text-text-gray text-sm mt-1">{today}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Mood Log Widget */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                        <h2 className="text-lg font-semibold text-text-dark mb-4">How are you feeling?</h2>
                        <MoodSlider value={moodScore} onChange={setMoodScore} />
                        <div className="mt-4">
                            <p className="text-sm font-medium text-text-gray mb-2">What emotions describe you right now?</p>
                            <EmotionTagSelector selected={emotions} onChange={setEmotions} />
                        </div>
                        <div className="mt-5 flex items-center gap-3">
                            <button
                                onClick={handleMoodSubmit}
                                disabled={logMood.isPending}
                                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center gap-2"
                            >
                                {logMood.isPending && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                )}
                                Log Mood
                            </button>
                            {showSuccess && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm text-green-600 font-medium"
                                >
                                    ✓ Mood logged!
                                </motion.span>
                            )}
                        </div>
                    </div>

                    {/* 7-Day Mood Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                        <h2 className="text-lg font-semibold text-text-dark mb-4">Last 7 Days</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[1, 10]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(v) => [v, 'Mood Score']}
                                    />
                                    <Line type="monotone" dataKey="score" stroke="#6B46C1" strokeWidth={3} dot={{ fill: '#6B46C1', r: 5 }} activeDot={{ r: 7, fill: '#6B46C1' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[220px] flex items-center justify-center text-text-gray text-sm">
                                <div className="text-center">
                                    <span className="text-4xl block mb-2">📊</span>
                                    <p>Start logging your mood to see trends</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Burnout Ring */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-text-dark mb-4">Burnout Score</h2>
                        <svg width="140" height="140" className="mb-2">
                            <circle cx="70" cy="70" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                            <circle
                                cx="70" cy="70" r="45" fill="none"
                                stroke={burnoutColor}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                transform="rotate(-90 70 70)"
                                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                            />
                            <text x="70" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill={burnoutColor}>{burnout}</text>
                            <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#6B7280">/ 100</text>
                        </svg>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                                riskLevel === 'moderate' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                            }`}>
                            {riskLevel} risk
                        </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map(a => (
                            <Link
                                key={a.path}
                                to={a.path}
                                className={`bg-gradient-to-br ${a.color} rounded-2xl p-4 text-white hover:scale-[1.03] transition-transform duration-200 shadow-lg`}
                            >
                                <span className="text-2xl block mb-2">{a.icon}</span>
                                <p className="font-semibold text-sm">{a.label}</p>
                                <p className="text-xs opacity-80 mt-0.5">{a.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
