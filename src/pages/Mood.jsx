import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Star, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mood = () => {
    const navigate = useNavigate();

    const data = [
        { date: 'Feb 14', score: 6 },
        { date: 'Feb 15', score: 4 },
        { date: 'Feb 16', score: 7 },
        { date: 'Feb 17', score: 5 },
        { date: 'Feb 18', score: 8 },
        { date: 'Feb 19', score: 9 },
        { date: 'Feb 20', score: 7 },
    ];

    const stats = [
        { label: 'Avg this week', value: '6.5', icon: <Star className="w-5 h-5" />, color: 'bg-primary-light text-primary' },
        { label: 'Best day', value: 'Sat', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-success-light text-success' },
        { label: 'Current Streak', value: '5 days', icon: <Zap className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
        { label: 'Total Entries', value: '24', icon: <CalendarIcon className="w-5 h-5" />, color: 'bg-secondary-light text-secondary' },
    ];

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6 text-text-secondary" />
                </button>
                <h1 className="text-xl font-bold text-text-primary">Mood Analytics</h1>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 text-center"
                        >
                            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-custom"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-bold text-text-primary">Mood Progression</h3>
                            <select className="bg-background border-none rounded-xl px-4 py-2 text-xs font-bold text-text-secondary focus:ring-2 focus:ring-primary/10">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorMoodFull" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8F8F8" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#0D9488"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorMoodFull)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Velocity/Insight Card */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-success-light p-8 rounded-[40px] border border-success/10"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white rounded-2xl text-success shadow-sm">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-success">Positive Trend</h3>
                            </div>
                            <p className="text-success/80 leading-relaxed mb-8">
                                Your mood has been trending upward 🌱 You've been consistently active for the last 5 days. Keep up the great work, Aalap!
                            </p>
                            <button
                                onClick={() => navigate('/journal')}
                                className="w-full py-4 bg-white text-success font-bold rounded-2xl shadow-sm hover:shadow-md transition-all"
                            >
                                Log an insight
                            </button>
                        </motion.div>

                        {/* Heatmap Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-text-primary mb-6">Month Overview</h3>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-lg ${i % 7 === 0 ? 'bg-danger/20' :
                                            i % 5 === 0 ? 'bg-success/60' :
                                                i % 3 === 0 ? 'bg-success/40' : 'bg-gray-100'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-text-secondary mt-6 uppercase tracking-widest font-bold text-center">Consistency is key</p>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Mood;
