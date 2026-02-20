import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function CrisisModal({ isOpen, onClose }) {
    const navigate = useNavigate()

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                >
                    {/* Overlay — not dismissible */}
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
                    >
                        <div className="text-6xl mb-4">💙</div>
                        <h2 className="text-2xl font-bold text-text-dark mb-3">You're not alone</h2>
                        <p className="text-text-gray mb-6 leading-relaxed">
                            We're here with you. A counselor has been notified and will reach out to you soon.
                            Remember, it's okay to ask for help.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => { onClose(); navigate('/resources'); }}
                                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25"
                            >
                                View Crisis Resources
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 text-text-gray rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Continue Chatting
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
