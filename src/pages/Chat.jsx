import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, ArrowLeft, MoreVertical, Shield, Heart,
    Info, X, Sparkles, AlertCircle, Bot, User, Lock, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const Chat = () => {
    const navigate = useNavigate();
    const [isDark] = useDarkMode();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm MindMate. Protocol Zero is active. How are you feeling today?", sender: 'ai', time: '10:00 AM' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                text: "I hear you deeply. Protocol Zero ensures your words are between us. I'm sensing some complex emotions—would you like to explore that further or maybe try a quick breathing ritual?",
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);

            if (input.toLowerCase().match(/help|hurt|kill|die|suicide/)) {
                setShowCrisisModal(true);
            }
        }, 1800);
    };

    return (
        <div className="flex flex-col h-screen bg-transparent transition-colors duration-500 overflow-hidden">
            {/* Chat Header */}
            <header className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#0F0F1A]/80 backdrop-blur-3xl z-30">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all active:scale-95 group">
                        <ArrowLeft className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-4 border-white dark:border-[#0F0F1A] rounded-full" />
                        </div>
                        <div>
                            <h1 className="font-black text-text-primary dark:text-white text-xl tracking-tighter">MindMate AI</h1>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-black">Active Analysis</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Protocol Zero Active</span>
                    </div>
                    <button className="p-3 text-text-secondary dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-10 no-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-100">
                <AnimatePresence initial={false}>
                    {messages.map((m, idx) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-5 max-w-[85%] md:max-w-[70%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${m.sender === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-card border border-gray-100 dark:border-white/5'
                                    }`}>
                                    {m.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="space-y-2">
                                    <div className={`relative p-6 rounded-[28px] ${m.sender === 'user'
                                        ? 'bg-text-primary dark:bg-white text-white dark:text-black rounded-tr-none shadow-2xl shadow-black/10'
                                        : 'bg-white dark:bg-card text-text-primary dark:text-white rounded-tl-none shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5'
                                        }`}>
                                        <p className="text-sm md:text-base leading-relaxed font-medium">{m.text}</p>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest opacity-40 block px-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {m.time}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white dark:bg-card px-6 py-4 rounded-[24px] rounded-tl-none shadow-xl border border-gray-100 dark:border-white/5 flex gap-1.5">
                                {[1, 2, 3].map(i => (
                                    <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-8 bg-white/80 dark:bg-[#0F0F1A]/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 relative z-30">
                <div className="max-w-5xl mx-auto flex gap-6 items-end">
                    <div className="flex-1 relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Pour your thoughts here..."
                            className="w-full bg-background dark:bg-white/5 border-none rounded-[32px] p-6 pr-16 focus:ring-4 focus:ring-primary/5 resize-none max-h-40 text-base font-medium text-text-primary dark:text-white transition-all shadow-inner"
                            rows="1"
                            style={{ height: 'auto', minHeight: '64px' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 rounded-full bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                                {input.length}
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-16 h-16 bg-text-primary dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-2xl shadow-black/20 disabled:opacity-30 disabled:shadow-none transition-all group overflow-hidden relative"
                    >
                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    </motion.button>
                </div>
                <p className="max-w-xl mx-auto text-center text-[10px] text-text-secondary dark:text-white/30 mt-6 uppercase tracking-[0.2em] font-black leading-relaxed">
                    Encryption 256-bit active. <span className="text-primary">MindMate AI</span> is trained for support. Not a replacement for professional clinical care.
                </p>
            </footer>

            {/* Crisis Modal */}
            <AnimatePresence>
                {showCrisisModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-text-primary/60 dark:bg-black/80 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-card w-full max-w-lg rounded-[48px] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                            <div className="flex justify-center mb-10">
                                <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center relative rotate-12">
                                    <Heart className="w-12 h-12 text-primary animate-pulse -rotate-12" />
                                    <div className="absolute -top-2 -right-2 p-2 bg-white dark:bg-card rounded-xl shadow-lg">
                                        <AlertCircle className="w-5 h-5 text-danger" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-text-primary dark:text-white mb-6 tracking-tighter uppercase leading-none">Hold on,<br />we're here.</h2>
                            <p className="text-text-secondary dark:text-white/50 mb-10 text-lg leading-relaxed font-medium">
                                Your feelings are valid, but your life is irreplaceable. We've detected language that concerns us. Please connect with someone who can provide immediate support.
                            </p>

                            <div className="grid gap-4">
                                <button
                                    onClick={() => navigate('/resources')}
                                    className="w-full py-5 bg-text-primary dark:bg-white text-white dark:text-black font-black rounded-[24px] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group transition-all hover:scale-[1.02] uppercase tracking-widest text-xs"
                                >
                                    Emergency Resources
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setShowCrisisModal(false)}
                                    className="w-full py-5 bg-gray-50 dark:bg-white/5 text-text-secondary dark:text-white/40 font-black rounded-[24px] transition-all hover:bg-gray-100 dark:hover:bg-white/10 uppercase tracking-widest text-xs"
                                >
                                    I'm okay, keep talking
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-success" />
                                <span className="text-[10px] font-black text-success uppercase tracking-widest">Confidential Crisis Support</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chat;

