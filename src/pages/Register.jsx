import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

export default function Register() {
    const [form, setForm] = useState({ name: '', university: '', email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const navigate = useNavigate()
    const setAuth = useAuthStore(s => s.setAuth)

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Full name is required'
        if (!form.university.trim()) e.university = 'University is required'
        if (!form.email) e.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
        if (!form.password) e.password = 'Password is required'
        else if (form.password.length < 6) e.password = 'At least 6 characters'
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const v = validate()
        setErrors(v)
        if (Object.keys(v).length) return
        setLoading(true)
        setApiError('')
        try {
            const { data } = await registerUser(form)
            setAuth(data.token, data.user)
            navigate('/dashboard')
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm`

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-3">🧠</span>
                    <h1 className="text-3xl font-bold text-text-dark">Join MindMate</h1>
                    <p className="text-text-gray mt-2">Your AI mental health companion</p>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8">
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-danger text-sm rounded-xl">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className={inputClass('name')} placeholder="Riya Sharma" />
                            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">University</label>
                            <input type="text" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })}
                                className={inputClass('university')} placeholder="IIT Delhi" />
                            {errors.university && <p className="text-danger text-xs mt-1">{errors.university}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className={inputClass('email')} placeholder="you@university.edu" />
                            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Password</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                className={inputClass('password')} placeholder="••••••••" />
                            {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                            {loading && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-gray mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    )
}
