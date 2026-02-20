import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Calendar, Sparkles, Shield, ArrowRight, Ghost } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        university: '',
        yearOfStudy: '1'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Your healing journey begins now! 🌈');
        setAuth({ name: formData.fullName, email: formData.email }, 'mock-token');
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
                            Because you<br /><span className="text-secondary-light italic">deserve</span> peace.
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-sm">
                            Join over 5,000+ students reclaiming their mental focus through AI-powered support.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 relative z-10 space-y-6 shadow-2xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary shadow-xl">
                            <Ghost className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg italic">"Protocol Zero changed everything for me."</p>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">IIT Delhi student</p>
                        </div>
                    </div>
                </motion.div>

                {/* Abstract Background Elements */}
                <div className="absolute top-[30%] right-[-20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 relative overflow-y-auto bg-transparent">
                <div className="absolute inset-0 bg-primary/5 dark:bg-transparent pointer-events-none" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="w-full max-w-lg relative z-10 py-10"
                >
                    <div className="lg:hidden flex items-center gap-2 text-primary mb-12">
                        <span className="text-3xl">🧠</span>
                        <span className="text-2xl font-black tracking-tighter text-white">MindMate</span>
                    </div>


                    <motion.div variants={fadeInUp} className="mb-10 text-center lg:text-left">
                        <h2 className="text-5xl font-black text-text-primary dark:text-white tracking-tighter mb-3 leading-none">New Journey.</h2>
                        <p className="text-text-secondary dark:text-white/40 font-medium">Create your anonymous identity in seconds.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">Chosen Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full py-4 pl-14 pr-6 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[24px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm dark:text-white"
                                        placeholder="Anonymous Owl"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">University Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full py-4 pl-14 pr-6 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[24px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm dark:text-white"
                                        placeholder="you@uni.edu"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">University</label>
                                <div className="relative group">
                                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        className="w-full py-4 pl-14 pr-6 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[24px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm dark:text-white"
                                        placeholder="IIT, DU, BITS..."
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">Study Year</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                                    <select
                                        value={formData.yearOfStudy}
                                        onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                                        className="w-full py-4 pl-14 pr-6 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[24px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm dark:text-white appearance-none relative"
                                    >
                                        <option value="1">Freshman (1st Yr)</option>
                                        <option value="2">Sophomore (2nd Yr)</option>
                                        <option value="3">Junior (3rd Yr)</option>
                                        <option value="4">Senior (4th Yr)</option>
                                        <option value="5">Masters / PhD</option>
                                    </select>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary dark:text-white/30 uppercase tracking-[0.2em] ml-1">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full py-4 pl-14 pr-6 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[24px] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium shadow-sm dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex gap-1.5 px-2 mt-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${formData.password.length > i * 2 ? 'bg-primary shadow-[0_0_10px_rgba(107,70,193,0.3)]' : 'bg-gray-100 dark:bg-white/5'}`} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex items-start gap-4 p-5 bg-primary/5 dark:bg-white/2 rounded-[24px] border border-primary/10 dark:border-white/5 mt-6">
                            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-text-secondary dark:text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                Protocol Zero: Your identity is masked. We use university emails only for verification, never for tracking.
                            </p>
                        </motion.div>

                        <motion.button
                            variants={fadeInUp}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 bg-text-primary dark:bg-white dark:text-black text-white font-black rounded-[28px] hover:shadow-2xl transition-all shadow-xl shadow-black/10 mt-8 flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
                        >
                            Begin Journey
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    <motion.div variants={fadeInUp} className="mt-10 text-center">
                        <p className="text-sm text-text-secondary dark:text-white/40 font-medium">
                            Returning student? <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">Sign In</Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;

