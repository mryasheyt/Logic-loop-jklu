import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/mood', label: 'Mood', icon: '📊' },
    { path: '/journal', label: 'Journal', icon: '📓' },
    { path: '/peer-feed', label: 'Peer Feed', icon: '🤝' },
    { path: '/burnout', label: 'Burnout', icon: '🔥' },
]

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
                        <span className="text-2xl">🧠</span>
                        <span className="text-xl font-bold text-primary">MindMate</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                        ? 'text-primary bg-primary-light'
                                        : 'text-text-gray hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-1.5">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition"
                            >
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                                    {initials}
                                </div>
                            </button>
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-text-dark">{user?.name}</p>
                                            <p className="text-xs text-text-gray truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-text-gray hover:bg-gray-50 hover:text-primary transition"
                                        >
                                            ⚙️ Profile
                                        </Link>
                                        <Link
                                            to="/resources"
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-text-gray hover:bg-gray-50 hover:text-primary transition"
                                        >
                                            📞 Resources
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 transition"
                                        >
                                            🚪 Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            <svg className="w-6 h-6 text-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${location.pathname === link.path
                                            ? 'text-primary bg-primary-light'
                                            : 'text-text-gray hover:text-primary hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-2">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
