import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { updateMe, deleteMe } from '../api/auth.api'
import { updateNudgePreferences } from '../api/nudges.api'

const timezones = [
    'Asia/Kolkata', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
]

export default function Profile() {
    const { user, updateUser, logout } = useAuthStore()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: user?.name || '',
        university: user?.university || '',
        year: user?.year || 1,
        timezone: user?.timezone || 'Asia/Kolkata',
    })
    const [nudgesEnabled, setNudgesEnabled] = useState(user?.nudgesEnabled ?? true)
    const [nudgeTime, setNudgeTime] = useState(user?.nudgeTime || '09:00')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateMe(form)
            await updateNudgePreferences({ nudgesEnabled, nudgeTime })
            updateUser({ ...form, nudgesEnabled, nudgeTime })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { /* handled */ }
        setSaving(false)
    }

    const handleDelete = async () => {
        try {
            await deleteMe()
            logout()
            navigate('/login')
        } catch { /* handled */ }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto px-4 py-6"
        >
            <h1 className="text-2xl font-bold text-text-dark mb-6">Profile Settings ⚙️</h1>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 mb-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Personal Info</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">Full Name</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">University</label>
                        <input type="text" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Year</label>
                            <select value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Timezone</label>
                            <select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nudge Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 mb-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Nudge Preferences</h2>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-text-dark">Enable Nudges</p>
                        <p className="text-xs text-text-gray">Receive wellness nudges and reminders</p>
                    </div>
                    <button
                        onClick={() => setNudgesEnabled(!nudgesEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${nudgesEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${nudgesEnabled ? 'translate-x-6' : ''}`} />
                    </button>
                </div>
                {nudgesEnabled && (
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">Preferred Time</label>
                        <input type="time" value={nudgeTime} onChange={e => setNudgeTime(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                )}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 mb-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Calendar Integration</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-dark">Connect Google Calendar</p>
                        <p className="text-xs text-text-gray">Auto-tag mood entries with academic context</p>
                    </div>
                    <div className="relative">
                        <button disabled className="px-5 py-2 bg-gray-100 text-text-gray rounded-xl text-sm font-medium cursor-not-allowed">
                            Connect
                        </button>
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                            Soon
                        </span>
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-3 mb-8">
                <button onClick={handleSave} disabled={saving}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center gap-2">
                    {saving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    Save Changes
                </button>
                {saved && <span className="text-sm text-green-600 font-medium">✓ Saved!</span>}
            </div>

            {/* Danger Zone */}
            <div className="border-2 border-danger/30 rounded-2xl p-6 bg-red-50/50">
                <h2 className="text-lg font-semibold text-danger mb-4">Danger Zone</h2>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-text-dark">Delete Account</p>
                        <p className="text-xs text-text-gray">Permanently delete your account and all data</p>
                    </div>
                    <button onClick={() => setConfirmDelete(true)}
                        className="px-5 py-2 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                        Delete Account
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-dark">Sign Out</p>
                        <p className="text-xs text-text-gray">Log out of your account</p>
                    </div>
                    <button onClick={handleLogout}
                        className="px-5 py-2 bg-gray-200 text-text-gray rounded-xl text-sm font-semibold hover:bg-gray-300 transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Delete Confirm */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                            <h3 className="text-lg font-semibold text-text-dark mb-2">Delete your account?</h3>
                            <p className="text-sm text-text-gray mb-5">All your data will be permanently deleted. This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-medium hover:bg-red-700 transition">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
