import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMoodHistory, useMoodVelocity } from '../hooks/useMood'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

const moodColors = (score) => {
    if (score >= 7) return 'bg-green-500'
    if (score >= 4) return 'bg-amber-500'
    return 'bg-red-500'
}

export default function Mood() {
    const [days] = useState(30)
    const { data: moodData, isLoading } = useMoodHistory(days)
    const { data: velocity } = useMoodVelocity()

    const moods = moodData?.moods || moodData || []
    const chartData = moods.map(m => ({
        day: new Date(m.createdAt || m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: m.score,
        context: m.context?.academicWeekType || 'regular',
    }))

    // Calendar heatmap
    const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (29 - i))
        const dateStr = d.toISOString().split('T')[0]
        const mood = moods.find(m => (m.createdAt || m.date)?.startsWith?.(dateStr))
        return { date: d, score: mood?.score || null, dateStr }
    })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-4 py-6"
        >
            <h1 className="text-2xl font-bold text-text-dark mb-1">My Mood Journey 📊</h1>
            <p className="text-text-gray text-sm mb-6">Track your emotional wellbeing over time</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                    <h2 className="text-lg font-semibold text-text-dark mb-4">30-Day Trend</h2>
                    {isLoading ? (
                        <div className="h-[280px] flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="greenZone" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#059669" stopOpacity={0.08} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                <YAxis domain={[1, 10]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                <ReferenceLine y={7} stroke="#059669" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <ReferenceLine y={4} stroke="#D97706" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(v, _, props) => [
                                        <span key="v">{v}/10 — <span className="text-text-gray">{props.payload.context}</span></span>,
                                        'Mood'
                                    ]}
                                />
                                <Line type="monotone" dataKey="score" stroke="#6B46C1" strokeWidth={2.5} dot={{ fill: '#6B46C1', r: 3 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-text-gray text-sm">
                            <div className="text-center">
                                <span className="text-4xl block mb-2">📊</span>
                                <p>No mood entries yet. Start logging from your dashboard.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Velocity Card */}
                <div className="space-y-4">
                    <div className={`rounded-2xl p-5 border ${velocity?.velocityDelta < 0
                            ? velocity?.isAnomalous ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                            : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{velocity?.velocityDelta < 0 ? '📉' : '📈'}</span>
                            <h3 className="font-semibold text-text-dark">Emotional Velocity</h3>
                        </div>
                        {velocity ? (
                            <>
                                <p className="text-sm text-text-dark leading-relaxed">
                                    {velocity.message || (velocity.velocityDelta < 0
                                        ? `Your mood dropped ${Math.abs(velocity.velocityDelta)} points in the last 3 days`
                                        : `Your mood improved ${velocity.velocityDelta} points. Keep going! 🌱`)}
                                </p>
                                {velocity.isAnomalous && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-red-600 font-medium">
                                        <span>⚠️</span> We've sent you a check-in
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-text-gray">Log your mood for at least 2 days to see velocity data.</p>
                        )}
                    </div>

                    {/* Calendar Heatmap */}
                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                        <h3 className="font-semibold text-text-dark mb-3">30-Day Heatmap</h3>
                        <div className="grid grid-cols-7 gap-1.5">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-[10px] text-text-gray font-medium pb-1">{d}</div>
                            ))}
                            {/* Offset for starting day */}
                            {Array.from({ length: last30[0]?.date.getDay() || 0 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {last30.map((d, i) => (
                                <div
                                    key={i}
                                    title={`${d.dateStr}: ${d.score ? d.score + '/10' : 'No entry'}`}
                                    className={`aspect-square rounded-md ${d.score ? moodColors(d.score) : 'bg-gray-100'} ${d.score ? 'opacity-80' : ''}`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[10px] text-text-gray">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Low</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> Medium</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> High</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100" /> No data</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Entries */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Recent Entries</h2>
                {moods.length > 0 ? (
                    <div className="space-y-3">
                        {moods.slice(0, 10).map((m, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${moodColors(m.score)}`}>
                                    {m.score}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text-dark font-medium">
                                        {new Date(m.createdAt || m.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                        {(m.emotions || []).map(e => (
                                            <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">{e}</span>
                                        ))}
                                    </div>
                                </div>
                                {m.context?.academicWeekType && m.context.academicWeekType !== 'regular' && (
                                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium hidden sm:inline">
                                        {m.context.academicWeekType}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-gray text-sm py-8 text-center">No mood entries yet. Start logging from your dashboard. 📝</p>
                )}
            </div>
        </motion.div>
    )
}
