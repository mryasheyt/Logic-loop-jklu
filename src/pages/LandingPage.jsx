import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Heart, MessageSquare, BarChart3, Shield, Users,
    Zap, Star, Sparkles, ArrowRight, ShieldCheck,
    Clock, Globe, Brain, Ghost
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent selection:bg-primary/20 overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-[100] px-12 py-10 flex justify-between items-center transition-all duration-500">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <motion.div
                        whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                        className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        🧠
                    </motion.div>
                    <span className="text-3xl font-[900] text-white tracking-[-0.08em]">MindMate<span className="text-secondary-light">.ai</span></span>
                </div>
                <div className="hidden lg:flex gap-14 text-white/30 text-[11px] font-[900] uppercase tracking-[0.4em]">
                    <a href="#features" className="hover:text-white transition-all hover:tracking-[0.6em] duration-300">Features</a>
                    <a href="#safe-space" className="hover:text-white transition-all hover:tracking-[0.6em] duration-300">Safe Space</a>
                    <a href="#community" className="hover:text-white transition-all hover:tracking-[0.6em] duration-300">Community</a>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 backdrop-blur-xl"
                >
                    Login
                </button>
            </nav>


            {/* Hero Section - Set to transparent to show the Spline Robot */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-transparent">
                {/* Subtle Glow Overlays that move with scroll */}
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[70%] h-[70%] bg-secondary/10 rounded-full blur-[160px]" />
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 max-w-5xl"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">AI-Powered Wellbeing for Students</span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-8xl md:text-[10rem] font-black text-white mb-10 leading-[0.8] tracking-[-0.05em]"
                    >
                        Your mind<br />
                        <span className="bg-gradient-to-r from-secondary-light via-primary-light to-secondary-light bg-clip-text text-transparent italic tracking-[-0.02em]">Matters.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-3xl text-white/40 mb-16 max-w-3xl mx-auto font-semibold leading-relaxed tracking-tight"
                    >
                        Meet your new 2 AM companion. Empathetic AI built to help you navigate student life, burnout, and everything in between.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-8 justify-center"
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-14 py-7 bg-white text-black font-black rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-white/20 transition-all flex items-center justify-center gap-4 active:scale-95 text-xl tracking-tight"
                        >
                            Get Started Free
                            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                        </button>
                        <button className="px-14 py-7 bg-white/5 backdrop-blur-3xl text-white border border-white/20 font-black rounded-full hover:bg-white/10 transition-all active:scale-95 text-xl tracking-tight">
                            Watch Demo
                        </button>
                    </motion.div>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Explore</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
                    />
                </motion.div>
            </section>

            {/* Feature Grid Section */}
            <section id="features" className="py-32 px-6 bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-32 space-y-6">
                        <h4 className="text-secondary font-black text-sm uppercase tracking-[0.5em] opacity-50">Industrial Strength</h4>
                        <h2 className="text-6xl md:text-8xl font-[950] text-white tracking-[-0.06em] leading-none">The protocol for<br />mental performance.</h2>
                        <p className="text-xl text-white/30 font-semibold max-w-2xl mx-auto">We combined behavioral science with AI to build the ultimate mental health companion.</p>
                    </div>


                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Brain className="w-8 h-8 text-primary" />,
                                title: "AI Companion",
                                desc: "Empathetic, non-judgmental chat available whenever you need a safe place to vent.",
                                color: "bg-primary/5"
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-secondary" />,
                                title: "Emotional Delta",
                                desc: "Track your mood over time with advanced analytics that identify your stress triggers.",
                                color: "bg-secondary/5"
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-success" />,
                                title: "Protocol Zero",
                                desc: "Enterprise-grade encryption ensures your thoughts remain 100% private and secure.",
                                color: "bg-success/5"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-16 rounded-[80px] bg-white/5 backdrop-blur-[100px] border border-white/10 hover:shadow-2xl hover:shadow-primary/20 hover:bg-white/10 transition-all group lg:min-h-[450px] flex flex-col justify-between"
                            >
                                <div className={`w-16 h-16 ${feature.color} dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 dark:text-white">{feature.title}</h3>
                                <p className="text-text-secondary dark:text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safe Space Callout */}
            <section id="safe-space" className="py-48 px-6 bg-[#6B46C1]/40 backdrop-blur-[140px] relative overflow-hidden border-y border-white/5">
                <div className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] bg-white/10 rounded-full blur-[180px]" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
                            <Shield className="w-4 h-4 text-secondary-light" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Guaranteed Privacy</span>
                        </div>
                        <h2 className="text-7xl md:text-[8rem] font-[950] text-white tracking-[-0.08em] leading-[0.85]">
                            A space just<br />
                            <span className="text-secondary-light italic">for you.</span>
                        </h2>
                        <p className="text-2xl text-white/40 font-semibold max-w-xl leading-relaxed tracking-tight">
                            No tracking. No judgement. Just you and an AI that actually listens.
                        </p>

                        <div className="flex gap-8">
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black text-white">256-bit</h4>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">AES Encryption</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black text-white">Local</h4>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Data Storage</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: [0, 5, 0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 20 }}
                            className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[60px] shadow-2xl space-y-6"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/50">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-black text-white tracking-tight italic">"I finally found a place where I don't have to filter my thoughts."</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-white shadow-xl">
                                    <Ghost className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Anonymous Student</p>
                                    <p className="text-xs text-white/50">BITS Pilani, 2nd Year</p>
                                </div>
                            </div>
                        </motion.div>
                        {/* Static Blur Background */}
                        <div className="absolute -top-10 -left-10 w-full h-full bg-primary/20 -z-10 blur-3xl" />
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community" className="py-32 px-6 bg-transparent relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">A Growing Tribe</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-text-primary dark:text-white tracking-tighter">You are not alone in this.</h2>
                    <p className="text-xl text-text-secondary dark:text-white/40 font-medium leading-relaxed">
                        Join thousands of students who are building their resilience and mastering their mental health together.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-12 py-6 bg-primary text-white font-black rounded-[32px] text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all"
                    >
                        Create Your Free Account
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
                        {[
                            { label: "India-wide", icon: <Globe className="w-5 h-5" /> },
                            { label: "24/7 Support", icon: <Clock className="w-5 h-5" /> },
                            { label: "Expert Vetted", icon: <Star className="w-5 h-5" /> },
                            { label: "Fast & Lite", icon: <Zap className="w-5 h-5" /> }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2 flex flex-col items-center opacity-60">
                                <div className="text-text-primary dark:text-white">{stat.icon}</div>
                                <span className="text-[10px] font-bold uppercase tracking-widest dark:text-white">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="bg-black/30 backdrop-blur-xl border-t border-white/5 py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">🧠</span>
                            <span className="text-2xl font-black dark:text-white tracking-tighter">MindMate<span className="text-primary">.ai</span></span>
                        </div>
                        <p className="text-text-secondary dark:text-white/40 max-w-sm font-medium leading-relaxed">
                            Pioneering accessible mental wellness for the next generation of thinkers, doers, and students.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] dark:text-white/30 text-text-secondary">Explore</h4>
                        <ul className="space-y-4 text-sm font-bold text-text-primary dark:text-white/60">
                            <li><a href="#" className="hover:text-primary transition-colors">Safety Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Student Guide</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Counselor Login</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] dark:text-white/30 text-text-secondary">Mission</h4>
                        <ul className="space-y-4 text-sm font-bold text-text-primary dark:text-white/60">
                            <li><a href="#" className="hover:text-primary transition-colors">Transparency</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Open Source</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary dark:text-white">© 2026 MindMate AI. Built with 💙 for the world.</p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-text-primary dark:bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-text-primary dark:bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-text-primary dark:bg-white/10" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

