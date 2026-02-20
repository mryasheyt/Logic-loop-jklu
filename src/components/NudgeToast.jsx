import { AnimatePresence, motion } from 'framer-motion'
import { useNudges } from '../hooks/useNudges'

const typeIcons = {
    breathing: '🫁',
    grounding: '🌍',
    pomodoro: '🎯',
    social: '💬',
    sleep: '😴',
}

export default function NudgeToast() {
    const { nudges, dismiss } = useNudges()
    const nudge = nudges[0] // show one at a time

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <AnimatePresence>
                {nudge && (
                    <motion.div
                        key={nudge._id}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{typeIcons[nudge.type] || '💡'}</span>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-text-dark">
                                    {nudge.content?.title || 'Wellness Nudge'}
                                </h4>
                                <p className="text-xs text-text-gray mt-1 leading-relaxed">
                                    {nudge.content?.message || 'Take a moment for yourself'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={() => dismiss(nudge._id)}
                                className="px-4 py-1.5 text-xs font-semibold text-primary bg-primary-light rounded-lg hover:bg-primary hover:text-white transition"
                            >
                                Got it ✓
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
