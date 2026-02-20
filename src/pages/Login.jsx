import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const affirmations = [
        "Your potential is endless.",
        "It's okay to not be okay.",
        "You are worthy of all the good things.",
        "Small steps lead to big changes.",
        "You've survived 100% of your bad days."
    ];

    const [quote, setQuote] = useState(affirmations[0]);

    useEffect(() => {
        setQuote(affirmations[Math.floor(Math.random() * affirmations.length)]);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Welcome back to your safe space! 💙');
        setAuth({ name: 'Aalap Goswami', email: formData.email }, 'mock-token');
        navigate('/dashboard');
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="flex min-h-screen bg-transparent transition-colors duration-500 overflow-hidden">
            {/* Left Side - Hero Brand (Made glassy) */}
            <div className="hidden lg:flex w-5/12 bg-black/20 backdrop-blur-3xl p-16 flex-col justify-between relative overflow-hidden border-r border-white/5">

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white mb-16 cursor-pointer group" onClick={() => navigate('/')}>
                        <motion.div whileHover={{ rotate: 15 }} className="text-3xl">🧠</motion.div>
                        <span className="text-2xl font-black tracking-tighter">MindMate<span className="text-primary-light">.ai</span></span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-black text-white leading-[0.95] tracking-tighter mb-8">
                            Continuity<br />over <span className="text-secondary-light italic">perfection.</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-sm">
                            Ready to pick up where you left off? Your journey is uniquely yours.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 relative z-10 group hover:bg-white/10 transition-all duration-700 shadow-2xl"
                >
                    <Sparkles className="w-8 h-8 text-secondary mb-6 animate-pulse" />
                    <p className="text-2xl font-bold text-white mb-4 leading-relaxed italic">
                        "{quote}"
                    </p>
                    <p className="text-white/30 uppercase tracking-[0.2em] text-[10px] font-black">Mindful Message</p>
                </motion.div>

                {/* Abstract Background Elements */}
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 relative bg-transparent">
                <div className="absolute inset-0 bg-primary/5 dark:bg-transparent pointer-events-none" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="lg:hidden flex items-center gap-2 text-primary mb-12">
                        <span className="text-3xl">🧠</span>
                        <span className="text-2xl font-black tracking-tighter text-white">MindMate</span>
                    </div>


                    <motion.div variants={fadeInUp} className="mb-12">
                        <h2 className="text-5xl font-black text-text-primary tracking-tighter mb-3 leading-none">Hello again.</h2>
                        <p className="text-text-secondary font-medium">Your progress is safely waiting for you.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">University Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full py-5 pl-14 pr-6 bg-card border border-gray-100 dark:border-white/5 rounded-[28px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm text-text-primary"
                                    placeholder="yourname@uni.edu"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em]">Secret Key</label>
                                <Link to="/forgot" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full py-5 pl-14 pr-6 bg-card border border-gray-100 dark:border-white/5 rounded-[28px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm text-text-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            variants={fadeInUp}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 bg-text-primary dark:bg-white dark:text-black text-white font-black rounded-[28px] hover:shadow-2xl transition-all shadow-xl shadow-black/10 mt-6 flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
                        >
                            Sign In to Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    <motion.div variants={fadeInUp} className="mt-12 text-center">
                        <p className="text-sm text-text-secondary dark:text-white/40 font-medium">
                            First time here? <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">Create an Identity</Link>
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="mt-16 p-6 bg-primary/5 dark:bg-white/5 rounded-[32px] border border-dashed border-primary/20 dark:border-white/10 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                            <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[10px] text-text-secondary dark:text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                            Secure encrypted login powered by <span className="text-text-primary dark:text-white">MindMate Security</span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

