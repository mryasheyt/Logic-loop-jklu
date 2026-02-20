import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Play, Pause, RotateCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Breathing = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timer, setTimer] = useState(4);
    const [settings, setSettings] = useState({ inhale: 4, hold: 4, exhale: 4 });

    useEffect(() => {
        let interval = null;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timer === 0) {
            if (phase === 'Inhale') {
                setPhase('Hold');
                setTimer(settings.hold);
            } else if (phase === 'Hold') {
                setPhase('Exhale');
                setTimer(settings.exhale);
            } else {
                setPhase('Inhale');
                setTimer(settings.inhale);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timer, phase, settings]);

    const toggleSession = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setPhase('Inhale');
            setTimer(settings.inhale);
        }
    };

    const resetSession = () => {
        setIsActive(false);
        setPhase('Inhale');
        setTimer(4);
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Background */}
            <motion.div
                animate={{
                    scale: phase === 'Inhale' && isActive ? 1.5 : 1,
                    opacity: phase === 'Inhale' && isActive ? 0.2 : 0.1
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] bg-primary rounded-full blur-[100px] -z-10"
            />

            <header className="absolute top-8 left-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-3 bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group border border-gray-100 dark:border-white/5"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm hidden sm:block">Back to Dashboard</span>
                </button>
            </header>

            <div className="max-w-md w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-text-primary tracking-tight">Box Breathing</h1>
                    <p className="text-text-secondary font-medium">Calm your nervous system in 2 minutes.</p>
                </div>

                {/* Breathing Circle Container */}
                <div className="relative flex items-center justify-center py-20">
                    {/* Outer Ring */}
                    <div className="absolute w-72 h-72 border-2 border-primary/10 rounded-full" />

                    {/* Breathing Circle */}
                    <motion.div
                        animate={{
                            scale: isActive ? (phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1.2) : 1,
                        }}
                        transition={{
                            duration: phase === 'Inhale' ? settings.inhale : phase === 'Exhale' ? settings.exhale : settings.hold,
                            ease: "easeInOut"
                        }}
                        className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center relative"
                    >
                        <div className="absolute inset-4 border-2 border-white/20 rounded-full" />
                        <div className="text-center text-white z-10">
                            <span className="text-4xl font-black block mb-1">{timer}</span>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">{phase}</span>
                        </div>
                    </motion.div>

                    {/* Particles */}
                    <AnimatePresence>
                        {isActive && phase === 'Inhale' && Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, x: Math.cos(i) * 150, y: Math.sin(i) * 150 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute w-2 h-2 bg-secondary rounded-full blur-sm"
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleSession}
                        className={`px-10 py-5 rounded-[24px] font-bold text-lg flex items-center gap-3 transition-all shadow-xl ${isActive
                            ? 'bg-danger text-white hover:bg-danger/90'
                            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                            }`}
                    >
                        {isActive ? <Pause className="fill-current" /> : <Play className="fill-current" />}
                        {isActive ? 'Pause' : 'Start Ritual'}
                    </button>

                    <button
                        onClick={resetSession}
                        className="p-5 bg-white dark:bg-card rounded-[24px] border border-gray-100 dark:border-white/5 text-text-secondary hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <RotateCcw />
                    </button>
                </div>

                {/* Benefits/Tips */}
                <div className="bg-white/50 dark:bg-card/50 backdrop-blur-md p-6 rounded-[32px] border border-white/20 dark:border-white/5 space-y-4">
                    <div className="flex items-center gap-3 justify-center text-primary">
                        <Wind className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-widest">Grounding Technique</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Inhale deeply through your nose, hold your breath, and exhale slowly through your mouth. Repeat this for 4 cycles to feel immediate relief.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Breathing;
