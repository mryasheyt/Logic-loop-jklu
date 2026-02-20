import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, User, GraduationCap, MapPin, Bell, Globe, LogOut, ShieldAlert, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully. Take care! 👋');
        navigate('/');
    };

    const menuItems = [
        { icon: <Bell className="w-5 h-5" />, label: 'Notification Preferences', meta: 'Dailly nudges active' },
        { icon: <Globe className="w-5 h-5" />, label: 'Timezone', meta: 'IST (UTC +5:30)' },
        { icon: <ShieldAlert className="w-5 h-5" />, label: 'Privacy & Security', meta: 'Encryption active' },
    ];

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft className="w-6 h-6 text-text-secondary" />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">My Profile</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pt-12">
                {/* User Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-6 relative overflow-hidden"
                    >
                        {user?.name?.[0] || 'S'}
                        <div className="absolute inset-0 bg-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xs font-bold uppercase tracking-widest">Edit</span>
                        </div>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-text-primary mb-1">{user?.name || 'Aalap Goswami'}</h2>
                    <p className="text-text-secondary font-medium">{user?.email || 'aalap@university.edu'}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">University</p>
                            <p className="font-bold text-text-primary text-sm">Delhi University</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary-light text-secondary rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Year of Study</p>
                            <p className="font-bold text-text-primary text-sm">3rd Year (Final)</p>
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden mb-12">
                    {menuItems.map((item, i) => (
                        <button
                            key={item.label}
                            className={`w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors ${i !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-text-secondary">{item.icon}</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-text-primary">{item.label}</h4>
                                    <p className="text-xs text-text-secondary">{item.meta}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        className="w-full py-5 bg-white border border-gray-100 text-primary font-bold rounded-3xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        Connect Google Calendar
                        <span className="px-2 py-0.5 bg-primary/10 text-[8px] rounded-full uppercase tracking-tighter">Coming Soon</span>
                    </button>

                    <div className="pt-8 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full py-5 bg-danger-light text-danger font-bold rounded-3xl hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-3"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout from MindMate
                        </button>
                        <p className="text-center text-[10px] text-text-secondary mt-8 uppercase tracking-widest font-bold">
                            MindMate AI v1.0.0 • Secured by AES-256
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
