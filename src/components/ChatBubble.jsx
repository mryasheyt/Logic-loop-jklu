import { motion } from 'framer-motion'

export default function ChatBubble({ role, content }) {
    const isUser = role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2 shrink-0 mt-1">
                    <span className="text-sm">🧠</span>
                </div>
            )}
            <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-white text-text-dark shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-bl-md border border-gray-50'
                    }`}
            >
                {content}
            </div>
        </motion.div>
    )
}
