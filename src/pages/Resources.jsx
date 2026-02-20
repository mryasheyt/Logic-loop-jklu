import { motion } from 'framer-motion';
import { Phone, ExternalLink, Heart, Shield, ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
    const navigate = useNavigate();

    const hotlines = [
        { name: 'iCall', number: '9152987821', avail: 'Mon-Sat, 8am-10pm', desc: 'Psychosocial helpline by TISS.' },
        { name: 'Vandrevala Foundation', number: '18602662345', avail: '24/7', desc: 'Immediate mental health support.' },
        { name: 'iMind', number: '40662222', avail: '24/7', desc: 'Support for various mental health issues.' },
        { name: 'NIMHANS', number: '080-46110007', avail: '24/7', desc: 'National Institute of Mental Health helpline.' },
    ];

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft className="w-6 h-6 text-text-secondary" />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Help Resources</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-primary to-primary-light p-10 rounded-[40px] text-white shadow-xl mb-12 relative overflow-hidden text-center"
                >
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 fill-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Help is always one call away 💙</h2>
                        <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                            If you or someone you know is in immediate danger or needs urgent support, please use these verified hotlines.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Shield className="w-32 h-32" />
                    </div>
                </motion.div>

                <section className="grid md:grid-cols-2 gap-6 mb-12">
                    {hotlines.map((h, i) => (
                        <motion.div
                            key={h.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ translateY: -4 }}
                            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary-light rounded-2xl text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${h.avail === '24/7' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                                    {h.avail}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">{h.name}</h3>
                            <p className="text-sm text-text-secondary mb-8 h-10">{h.desc}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="text-lg font-bold text-primary">{h.number}</span>
                                <button
                                    onClick={() => window.location.href = `tel:${h.number.replace(/[^0-9]/g, '')}`}
                                    className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Call Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Talk to AI CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-8 rounded-[40px] shadow-custom flex flex-col md:flex-row items-center justify-between gap-8 border border-secondary/10"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-secondary-light rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-10 h-10 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Need to talk right now?</h3>
                            <p className="text-text-secondary text-sm">MindMate AI is available 24/7 for support and guidance.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/chat')}
                        className="w-full md:w-auto px-10 py-5 bg-secondary text-white font-bold rounded-[24px] shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
                    >
                        Start Chatting
                    </button>
                </motion.div>

                <p className="text-center text-xs text-text-secondary mt-12 px-10 leading-relaxed font-medium">
                    Disclaimer: MindMate AI is an AI-powered tool designed for support, not a replacement for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </main>
        </div>
    );
};

export default Resources;
