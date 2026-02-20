import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from '../api/journal.api'

export default function Journal() {
    const [entries, setEntries] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [isNew, setIsNew] = useState(false)
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        loadEntries()
    }, [])

    const loadEntries = async () => {
        try {
            const { data } = await getJournalEntries()
            setEntries(data.entries || data || [])
        } catch { /* handled */ }
        setLoading(false)
    }

    const selected = entries.find(e => e._id === selectedId)

    const handleNew = () => {
        setIsNew(true)
        setSelectedId(null)
        setContent('')
    }

    const handleSelect = (entry) => {
        setIsNew(false)
        setSelectedId(entry._id)
        setContent(entry.content || '')
    }

    const handleSave = async () => {
        if (!content.trim()) return
        setSaving(true)
        try {
            if (isNew) {
                await createJournalEntry({ content })
                setIsNew(false)
            } else if (selectedId) {
                await updateJournalEntry(selectedId, { content })
            }
            await loadEntries()
        } catch { /* handled */ }
        setSaving(false)
    }

    const handleDelete = async () => {
        if (!selectedId) return
        try {
            await deleteJournalEntry(selectedId)
            setSelectedId(null)
            setContent('')
            setConfirmDelete(false)
            await loadEntries()
        } catch { /* handled */ }
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 py-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">Journal 📓</h1>
                    <p className="text-text-gray text-sm mt-0.5">Your private space to reflect</p>
                </div>
                <button
                    onClick={handleNew}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25"
                >
                    + New Entry
                </button>
            </div>

            <div className="flex gap-6 h-[calc(100vh-220px)]">
                {/* Left Panel — Entry List */}
                <div className="w-full lg:w-[35%] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <span className="text-5xl mb-3">📝</span>
                            <p className="text-text-gray text-sm">Your journal is private. Start writing.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {entries.map(entry => (
                                <button
                                    key={entry._id}
                                    onClick={() => handleSelect(entry)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${selectedId === entry._id ? 'bg-primary-light border-l-4 border-primary' : ''
                                        }`}
                                >
                                    <p className="text-xs text-text-gray mb-1">
                                        {new Date(entry.createdAt || entry.date).toLocaleDateString('en-US', {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-text-dark line-clamp-2">
                                        {(entry.content || '').slice(0, 100)}...
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel — Editor */}
                <div className="hidden lg:flex flex-1 flex-col bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
                    {isNew || selectedId ? (
                        <>
                            <div className="flex items-center justify-between p-4 border-b border-gray-50">
                                <p className="text-sm text-text-gray">
                                    {isNew ? 'New Entry' : new Date(selected?.createdAt || selected?.date).toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                                <div className="flex items-center gap-2">
                                    {!isNew && (
                                        <button
                                            onClick={() => setConfirmDelete(true)}
                                            className="px-3 py-1.5 text-xs font-medium text-danger bg-red-50 rounded-lg hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !content.trim()}
                                        className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition disabled:opacity-60 flex items-center gap-1"
                                    >
                                        {saving && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                        Save
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Write your thoughts here..."
                                className="flex-1 p-6 text-sm text-text-dark leading-relaxed resize-none focus:outline-none"
                            />
                            <div className="px-6 py-2 border-t border-gray-50 text-xs text-text-gray text-right">
                                {wordCount} words
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <span className="text-5xl mb-3">📓</span>
                            <p className="text-text-gray text-sm">Select an entry or create a new one</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
                        >
                            <h3 className="text-lg font-semibold text-text-dark mb-2">Delete Entry?</h3>
                            <p className="text-sm text-text-gray mb-5">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-medium hover:bg-red-700 transition">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
