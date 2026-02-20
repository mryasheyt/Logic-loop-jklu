import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Moon, Sun, BatteryLow, Coffee, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BurnoutGauge from '../components/BurnoutGauge';

const Burnout = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState({ rest: 0, motivation: 0, breaks: null });

    const questions = [
        {
            id: 1,
            label: 'How rested do you feel today?',
            icon: <Moon className="w-12 h-12 text-primary" />,
            type: 'rating',
            key: 'rest'
        },
        {
            id: 2,
            label: 'Your motivation level at this moment?',
            icon: <Zap className="w-12 h-12 text-secondary" />,
            type: 'rating',
            key: 'motivation'
        },
        {
            id: 3,
            label: 'Have you taken a break today?',
            icon: <Coffee className="w-12 h-12 text-primary" />,
            type: 'boolean',
            key: 'breaks'
        }
    ];

    const handleNext = () => {
        if (step < questions.length) setStep(step + 1);
        else setShowResult(true);
    };

    const currentQ = questions[step - 1];

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / questions.length) * 100}%` }}
                />
            </div>

            <header className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <ArrowLeft className="w-6 h-6 text-text-secondary" />
                </button>
            </header>

            {!showResult ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-xl text-center space-y-12"
                    >
                        <div className="space-y-4">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-8">
                                {currentQ.icon}
                            </div>
                            <h2 className="text-4xl font-bold text-text-primary leading-tight">{currentQ.label}</h2>
                            <p className="text-text-secondary font-medium uppercase tracking-widest text-sm">Step {step} of 3</p>
                        </div>

                        {currentQ.type === 'rating' ? (
                            <div className="flex justify-center gap-4">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setAnswers({ ...answers, [currentQ.key]: num })}
                                        className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all border-2 ${answers[currentQ.key] === num
                                            ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20'
                                            : 'bg-white border-gray-100 text-text-secondary hover:border-primary/30'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center gap-6">
                                {[
                                    { label: 'Yes', val: true },
                                    { label: 'No', val: false }
                                ].map(opt => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setAnswers({ ...answers, breaks: opt.val })}
                                        className={`px-12 py-6 rounded-3xl text-xl font-bold transition-all border-2 ${answers.breaks === opt.val
                                            ? 'bg-primary border-primary text-white scale-105 shadow-lg shadow-primary/20'
                                            : 'bg-white border-gray-100 text-text-secondary hover:border-primary/30'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="pt-10">
                            <button
                                onClick={handleNext}
                                disabled={currentQ.type === 'rating' ? answers[currentQ.key] === 0 : answers.breaks === null}
                                className="px-12 py-5 bg-text-primary text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl disabled:opacity-20"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center"
                >
                    <div className="bg-white p-12 rounded-[48px] shadow-custom flex flex-col items-center">
                        <h3 className="text-2xl font-bold text-text-primary mb-10 text-center">Your Recovery Status</h3>
                        <BurnoutGauge score={68} />
                        <div className="mt-12 text-center">
                            <span className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest ${68 > 70 ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning'}`}>
                                Moderate Risk
                            </span>
                            <p className="mt-6 text-text-secondary leading-relaxed">
                                You're pushing yourself hard lately. It might be time to schedule some intentional downtime.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-text-primary mb-8 px-4">Recovery Tips for Today</h3>
                        {[
                            { icon: <Moon className="w-5 h-5" />, title: 'Early Lights Out', desc: 'Try to get 8 hours of sleep tonight to reset.' },
                            { icon: <Sun className="w-5 h-5" />, title: 'Nature Walk', desc: 'A quick 15-minute walk without your phone.' },
                            { icon: <Info className="w-5 h-5" />, title: 'Digital Detox', desc: 'Put away all screens 1 hour before bed.' }
                        ].map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-3xl border border-gray-50 flex gap-6 items-center hover:shadow-md transition-all shadow-sm"
                            >
                                <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                                    {tip.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">{tip.title}</h4>
                                    <p className="text-sm text-text-secondary">{tip.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all mt-6"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Burnout;
