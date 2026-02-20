import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCrisisHotlines } from '../api/crisis.api'

const staticResources = [
    { name: 'iCall', number: '9152987821', availability: 'Mon–Sat 8am–10pm', desc: 'Professional counseling service' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', availability: '24/7', desc: 'Mental health helpline' },
    { name: 'iMind', number: '4066-2222', availability: '24/7', desc: 'Emotional support helpline' },
    { name: 'NIMHANS', number: '080-46110007', availability: '24/7', desc: 'National mental health helpline' },
]

export default function Resources() {
    const [hotlines, setHotlines] = useState([])

    useEffect(() => {
        getCrisisHotlines()
            .then(r => setHotlines(r.data?.hotlines || r.data || []))
            .catch(() => { })
    }, [])

    const allResources = [...staticResources, ...hotlines]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 py-6"
        >
            {/* Banner */}
            <div className="bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-8 text-white text-center mb-8">
                <span className="text-4xl block mb-3">💙</span>
                <h1 className="text-2xl font-bold mb-2">You're not alone. Help is always available.</h1>
                <p className="text-purple-200 text-sm">If you or someone you know is in crisis, reach out immediately.</p>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {allResources.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-semibold text-text-dark mb-1">{r.name}</h3>
                        <p className="text-text-gray text-xs mb-3">{r.desc || r.availability}</p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">📞</span>
                            <span className="text-primary font-bold">{r.number}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                {r.availability}
                            </span>
                            <a
                                href={`tel:${r.number.replace(/[^0-9+]/g, '')}`}
                                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-md"
                            >
                                Call Now
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center">
                <p className="text-text-gray text-sm mb-4">Need someone to talk to right now?</p>
                <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-purple-700 text-white rounded-xl font-semibold hover:from-primary-dark hover:to-purple-800 transition shadow-lg shadow-primary/25"
                >
                    💬 Talk to MindMate AI
                </Link>
            </div>
        </motion.div>
    )
}
