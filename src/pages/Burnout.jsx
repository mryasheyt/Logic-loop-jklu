import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBurnoutScore, useBurnoutTrend, useBurnoutCheckin } from '../hooks/useBurnout'
import BurnoutGauge from '../components/BurnoutGauge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StarRating({ value, onChange, label }) {
    return (
        <div className="mb-5">
            <p className="text-sm font-medium text-text-dark mb-2">{label}</p>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= value ? 'grayscale-0' : 'grayscale opacity-30'}`}
                    >
                        ⭐
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function Burnout() {
    const { data: scoreData, isLoading: scoreLoading } = useBurnoutScore()
    const { data: trendData } = useBurnoutTrend()
    const checkin = useBurnoutCheckin()

    const [restedScore, setRestedScore] = useState(3)
    const [motivationScore, setMotivationScore] = useState(3)
    const [tookBreaks, setTookBreaks] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const checkedInToday = scoreData?.checkedInToday || submitted
    const score = scoreData?.score ?? 0
    const riskLevel = scoreData?.riskLevel || 'low'

    const handleSubmit = async () => {
        try {
            await checkin.mutateAsync({ restedScore, motivationScore, tookBreaks })
            setSubmitted(true)
        } catch { /* handled */ }
    }

    const trendChartData = (trendData?.trend || trendData || []).map(t => ({
        day: new Date(t.date || t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: t.computedBurnout || t.score,
    }))

    const tips = [
        { icon: '🛌', text: 'Sleep before midnight tonight' },
        { icon: '🚶', text: 'Take a 10-minute walk' },
        { icon: '📵', text: '30 minutes phone-free before bed' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 py-6"
        >
            <h1 className="text-2xl font-bold text-text-dark mb-1">Burnout Tracker 🔥</h1>
            <p className="text-text-gray text-sm mb-6">Monitor your energy and prevent burnout</p>

            {!checkedInToday ? (
                /* Check-in Form */
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 max-w-lg mx-auto"
                >
                    <h2 className="text-lg font-semibold text-text-dark mb-5">Daily Check-in</h2>
                    <StarRating value={restedScore} onChange={setRestedScore} label="How rested do you feel?" />
                    <StarRating value={motivationScore} onChange={setMotivationScore} label="How motivated are you today?" />

                    <div className="mb-6">
                        <p className="text-sm font-medium text-text-dark mb-2">Did you take breaks or move your body?</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setTookBreaks(true)}
                                className={`px-6 py-2.5 rounded-xl font-medium text-sm transition ${tookBreaks ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                                    }`}
                            >
                                ✅ Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setTookBreaks(false)}
                                className={`px-6 py-2.5 rounded-xl font-medium text-sm transition ${!tookBreaks ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                                    }`}
                            >
                                ❌ No
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={checkin.isPending}
                        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {checkin.isPending && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        )}
                        Submit Check-in
                    </button>
                </motion.div>
            ) : (
                /* Results */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gauge */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-text-dark mb-4">Your Burnout Score</h2>
                        {scoreLoading ? (
                            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                        ) : (
                            <BurnoutGauge score={score} size={240} />
                        )}
                    </div>

                    {/* Trend */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                        <h2 className="text-lg font-semibold text-text-dark mb-4">30-Day Trend</h2>
                        {trendChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={trendChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="score" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-text-gray text-sm">
                                Check in daily to see your trend
                            </div>
                        )}
                    </div>

                    {/* Recovery Mode */}
                    {score > 70 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="lg:col-span-2 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🚨</span>
                                <h2 className="text-lg font-semibold text-text-dark">Recovery Mode Activated</h2>
                            </div>
                            <p className="text-sm text-text-gray mb-4">Your burnout score is high. Here are 3 things to prioritize today:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {tips.map((tip, i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
                                        <span className="text-3xl block mb-2">{tip.icon}</span>
                                        <p className="text-sm font-medium text-text-dark">{tip.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
