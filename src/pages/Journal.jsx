import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Plus, Search, BookOpen, Save,
    Trash2, Clock, Calendar as CalendarIcon,
    Sparkles, AlignLeft, Hash, Edit3, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const Journal = () => {
    const navigate = useNavigate();
    const [isDark] = useDarkMode();
    const [entries, setEntries] = useState([
        { id: 1, date: 'Feb 20, 2026', title: 'A quiet morning', content: 'Woke up early and had some tea. Feeling peaceful for the first time in weeks...', mood: 'Calm', color: 'bg-primary' },
        { id: 2, date: 'Feb 18, 2026', title: 'Exam stress', content: 'The pressure is mounting. I need to remember to breathe and take small steps.', mood: 'Stressed', color: 'bg-danger' },
        { id: 3, date: 'Feb 15, 2026', title: 'Small wins', content: 'Finished the project on time! Celebrating small victories today.', mood: 'Productive', color: 'bg-success' },
    ]);
    const [activeID, setActiveID] = useState(1);
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const activeEntry = entries.find(e => e.id === activeID) || entries[0];

    const handleNewEntry = () => {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: '',
            content: '',
            mood: 'Neutral',
            color: 'bg-primary'
        };
        setEntries([newEntry, ...entries]);
        setActiveID(newEntry.id);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    };

    return (
        <div className="flex h-screen bg-transparent transition-colors duration-500 overflow-hidden selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="w-[380px] bg-white dark:bg-card border-r border-gray-100 dark:border-white/5 flex flex-col hidden lg:flex relative z-20">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/dashboard')} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all active:scale-95 group">
                                <ArrowLeft className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                            </button>
                            <h1 className="text-2xl font-black text-text-primary dark:text-white tracking-tighter">Journal</h1>
                        </div>
                        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                            <MoreVertical className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>

                    <button
                        onClick={handleNewEntry}
                        className="w-full py-5 bg-text-primary dark:bg-white dark:text-black text-white font-black rounded-[32px] shadow-2xl shadow-black/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        New Reflection
                    </button>

                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a memory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full py-4 pl-14 pr-6 bg-background dark:bg-white/5 border-none rounded-[28px] text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all text-text-primary dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3 no-scrollbar">
                    {entries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())).map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setActiveID(entry.id)}
                            className={`p-6 rounded-[32px] cursor-pointer transition-all relative overflow-hidden group ${activeID === entry.id
                                ? 'bg-primary-light dark:bg-primary/20 ring-2 ring-primary/20 shadow-xl shadow-primary/5'
                                : 'hover:bg-gray-50 dark:hover:bg-white/2 border-transparent border'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeID === entry.id ? 'text-primary' : 'text-text-secondary dark:text-white/30'}`}>
                                    {entry.date}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${entry.color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                            </div>
                            <h3 className={`font-black text-base mb-2 line-clamp-1 tracking-tight ${activeID === entry.id ? 'text-text-primary dark:text-white' : 'text-text-primary dark:text-white/80'}`}>
                                {entry.title || 'Untitled Thought'}
                            </h3>
                            <p className="text-xs text-text-secondary dark:text-white/40 line-clamp-2 leading-relaxed font-medium">
                                {entry.content || 'Your story starts here...'}
                            </p>
                            {activeID === entry.id && (
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </aside>

            {/* Editor Area */}
            <main className="flex-1 flex flex-col bg-white dark:bg-[#0F0F1A] overflow-hidden relative shadow-inner">
                <header className="px-10 py-6 flex items-center justify-between border-b border-gray-50 dark:border-white/5 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-background dark:bg-white/5 rounded-2xl text-text-secondary dark:text-white/40">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isSaving ? 'Saving...' : 'Cloud Synced'}</span>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-primary/10 border-2 border-white dark:border-card scale-90" />)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3.5 text-text-secondary dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all">
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3.5 bg-text-primary dark:bg-white dark:text-black text-white text-xs font-black rounded-2xl shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest"
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Recording' : 'Finalize'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 md:p-24 selection:bg-primary/20 relative">
                    <div className="max-w-3xl mx-auto space-y-16">
                        <motion.div
                            key={activeID + 'header'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center gap-2">
                                    <Edit3 className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Self Reflection</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary dark:text-white/40 text-[10px] font-black uppercase tracking-widest">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    {activeEntry?.date}
                                </div>
                            </div>
                            <input
                                type="text"
                                value={activeEntry?.title}
                                onChange={(e) => {
                                    const newEntries = entries.map(ent => ent.id === activeID ? { ...ent, title: e.target.value } : ent);
                                    setEntries(newEntries);
                                }}
                                className="w-full text-6xl md:text-8xl font-black border-none focus:ring-0 text-text-primary dark:text-white bg-transparent p-0 tracking-tighter placeholder:text-gray-100 dark:placeholder:text-white/5 leading-[0.9]"
                                placeholder="Core Theme"
                            />
                        </motion.div>

                        <motion.div
                            key={activeID + 'content'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <textarea
                                value={activeEntry?.content}
                                onChange={(e) => {
                                    const newEntries = entries.map(ent => ent.id === activeID ? { ...ent, content: e.target.value } : ent);
                                    setEntries(newEntries);
                                }}
                                className="w-full h-[60vh] border-none focus:ring-0 text-xl md:text-2xl leading-relaxed text-text-primary/70 dark:text-white/60 bg-transparent resize-none p-0 placeholder:text-gray-100 dark:placeholder:text-white/5 font-medium scroll-smooth focus:placeholder:opacity-0 transition-opacity"
                                placeholder="The space for your thoughts is infinite. Begin where it hurts, or where it heals..."
                            />
                        </motion.div>
                    </div>
                    {/* Background Noise Effect */}
                    <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
                </div>

                {/* Status Bar */}
                <footer className="px-10 py-6 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#0F0F1A] gap-6">
                    <div className="flex items-center gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em]">Words</p>
                            <p className="text-xl font-black dark:text-white leading-none">
                                {activeEntry?.content.split(/\s+/).filter(x => x).length}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-white/5" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em]">Read Time</p>
                            <p className="text-xl font-black dark:text-white leading-none">
                                {Math.max(1, Math.ceil(activeEntry?.content.split(/\s+/).length / 200))}m
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {['Anxious', 'Chill', 'Productive', 'Sad'].map(m => (
                            <button key={m} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeEntry?.mood === m ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background dark:bg-white/5 text-text-secondary dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                                {m}
                            </button>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Journal;

