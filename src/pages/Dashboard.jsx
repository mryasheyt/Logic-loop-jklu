import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDarkMode } from '../hooks/useDarkMode';
import BurnoutGauge from '../components/BurnoutGauge';
import MoodSlider from '../components/MoodSlider';
import {
    MessageSquare, BarChart3, Users, BookText, Bell,
    CheckCircle2, Sun, Moon, Sparkles,
    Star, Trophy, Wind, Brain, Zap, LineChart as LucideLineChart
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [isDark, toggleDark] = useDarkMode();
    const navigate = useNavigate();
    const [mood, setMood] = useState(7);
    const [isMoodLogged, setIsMoodLogged] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        console.log("Dashboard Mounted. User:", user);
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning ☀️');
        else if (hour < 18) setGreeting('Good afternoon 🌤️');
        else setGreeting('Good evening 🌙');
    }, [user]);

    const moodData = [
        { day: 'Mon', score: 6 },
        { day: 'Tue', score: 4 },
        { day: 'Wed', score: 7 },
        { day: 'Thu', score: 8 },
        { day: 'Fri', score: 5 },
        { day: 'Sat', score: 9 },
        { day: 'Sun', score: 7 },
    ];

    const actions = [
        { icon: <MessageSquare className="w-6 h-6 text-primary" />, title: "Talk to MindMate", subtitle: "24/7 AI Support", path: "/chat", color: "bg-primary-light" },
        { icon: <Wind className="w-6 h-6 text-secondary" />, title: "Breathing", subtitle: "Instant Calm", path: "/breathing", color: "bg-secondary-light" },
        { icon: <Users className="w-6 h-6 text-primary" />, title: "Peer Feed", subtitle: "Stay Connected", path: "/peer-feed", color: "bg-primary-light" },
        { icon: <BookText className="w-6 h-6 text-secondary" />, title: "Journal", subtitle: "Safe Space", path: "/journal", color: "bg-secondary-light" },
    ];

    const handleMoodSubmit = () => {
        setIsMoodLogged(true);
    };

    return (
        <div className="min-h-screen bg-transparent pb-20 selection:bg-primary/20 transition-colors duration-500">
            {/* Nav */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        className="text-2xl"
                    >🧠</motion.div>
                    <span className="text-xl font-black text-primary tracking-tight">MindMate</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDark}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all"
                    >
                        {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-text-secondary" />}
                    </button>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all relative">
                        <Bell className="w-5 h-5 text-text-secondary" />
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-card" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center font-bold text-white shadow-lg overflow-hidden cursor-pointer">
                        {user?.name?.[0] || 'S'}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Stats & Actions (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-text-primary dark:text-white tracking-tight capitalize">{greeting}, {user?.name || 'Aalap'}</h1>
                            <p className="text-text-secondary mt-1 font-medium italic">"Small progress is still progress."</p>
                        </motion.div>
                        <div className="flex gap-4">
                            <div className="bg-white dark:bg-card px-4 py-2 rounded-2xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-warning fill-warning" />
                                <span className="font-bold text-text-primary dark:text-white text-sm">7 Day Streak</span>
                            </div>
                            <div className="bg-white dark:bg-card px-4 py-2 rounded-2xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary fill-primary/10" />
                                <span className="font-bold text-text-primary dark:text-white text-sm">Level 4</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Row: Burnout & Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-card p-8 rounded-[32px] shadow-custom border border-white/20 dark:border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Brain className="w-24 h-24 dark:text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Wellness Score
                            </h3>
                            <BurnoutGauge score={35} />
                            <p className="mt-6 text-xs text-text-secondary max-w-[200px] leading-relaxed font-medium">
                                Your cognitive load is optimal. You're in the perfect state for deep work!
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {actions.map((action, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ translateY: -4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate(action.path)}
                                    className="bg-white dark:bg-card p-6 rounded-[32px] shadow-sm cursor-pointer border border-gray-50 dark:border-white/5 flex flex-col items-center justify-center text-center gap-4 transition-all"
                                >
                                    <div className={`p-4 rounded-2xl ${action.color} dark:bg-white/5`}>{action.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-sm text-text-primary dark:text-white">{action.title}</h4>
                                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">{action.subtitle}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights Page Section (New) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group"
                    >
                        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit">
                                    <Sparkles className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest italic">AI Powered Insights</span>
                                </div>
                                <h3 className="text-2xl font-bold">Your mood is remarkably stable this week.</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    MindMate detected you've been most productive around 10 AM. Your journal entries mention "progress" more frequently today.
                                </p>
                                <button className="px-6 py-2.5 bg-white text-primary rounded-xl text-xs font-black shadow-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors uppercase tracking-widest">
                                    Analyze Journal
                                </button>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <motion.div
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5 }}
                                    className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner"
                                >
                                    <Brain className="w-16 h-16 opacity-80" />
                                </motion.div>
                            </div>
                        </div>
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                    </motion.div>

                    {/* Mood Chart Wrapper */}
                    <div className="bg-white dark:bg-card p-10 rounded-[48px] shadow-custom border border-white/20 dark:border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-text-primary dark:text-white tracking-tight">Emotional Velocity</h3>
                                <p className="text-sm text-text-secondary font-medium">Monitoring your flow over 7 days</p>
                            </div>
                            <button className="p-3 bg-background dark:bg-white/5 rounded-2xl hover:text-primary dark:text-white transition-all">
                                <LucideLineChart className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={moodData}>
                                    <defs>
                                        <linearGradient id="colorMoodFull" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6B46C1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis hide domain={[0, 10]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                                        itemStyle={{ color: '#6B46C1', fontWeight: 800 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#6B46C1"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#colorMoodFull)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Side: Challenges & Logger (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Mood Logger Card (Improved UI) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-card p-8 rounded-[40px] shadow-custom border border-white/20 dark:border-white/5 relative overflow-hidden"
                    >
                        {!isMoodLogged ? (
                            <>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Check-in</h3>
                                <p className="text-sm text-text-secondary mb-8">How's the energy today?</p>

                                <MoodSlider value={mood} onChange={setMood} />

                                <div className="mt-10 space-y-4">
                                    <p className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em]">Emotional Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Focus', 'Inspired', 'Tired', 'Anxious', 'Chill'].map(tag => (
                                            <button
                                                key={tag}
                                                className="px-4 py-2 rounded-2xl text-[11px] font-bold border border-gray-100 dark:border-white/5 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all uppercase tracking-widest dark:text-white"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleMoodSubmit}
                                    className="w-full mt-10 py-5 bg-text-primary dark:bg-white dark:text-black text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl shadow-black/10 uppercase tracking-widest text-xs"
                                >
                                    Record Pulse
                                </button>
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    className="w-24 h-24 bg-success-light dark:bg-success/20 rounded-full flex items-center justify-center mb-8"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-success" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Caught!</h3>
                                <p className="text-text-secondary text-sm px-6 leading-relaxed font-medium">
                                    Your mood pulse has been added to your timeline.
                                </p>
                            </div>
                        )}
                        <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                    </motion.div>

                    {/* Daily Quests Card (New Option) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-card p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-white/10"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                                <Star className="w-5 h-5 text-warning fill-warning" />
                                Daily Quests
                            </h3>
                            <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">2/3 DONE</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Box Breathing', reward: '50 XP', done: true },
                                { title: 'Log 3 Gratitudes', reward: '30 XP', done: true },
                                { title: 'Chat with MindMate', reward: '100 XP', done: false }
                            ].map((quest, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-background dark:bg-white/5 rounded-2xl group cursor-pointer hover:bg-gray-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-1.5 rounded-lg border-2 ${quest.done ? 'bg-success border-success text-white' : 'border-gray-200 dark:border-white/10'}`}>
                                            {quest.done && <CheckCircle2 className="w-3 h-3" />}
                                        </div>
                                        <span className={`text-sm font-bold ${quest.done ? 'text-text-secondary dark:text-white/40 line-through opacity-50' : 'text-text-primary dark:text-white'}`}>
                                            {quest.title}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-text-secondary dark:text-white/30 opacity-50 uppercase tracking-widest">{quest.reward}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Daily Affirmation Card (Refined) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-secondary p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform"
                    >
                        <div className="relative z-10">
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full" />)}
                            </div>
                            <p className="text-2xl font-bold leading-[1.4] mb-4">
                                "The only way out is through."
                            </p>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Robert Frost</span>
                        </div>
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LucideLineChart className="w-20 h-20" />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;


