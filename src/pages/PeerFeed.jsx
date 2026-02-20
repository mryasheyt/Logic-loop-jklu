import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Users, MessageCircle, Flag, Send, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PeerFeed = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
        {
            id: 1,
            category: 'Anxiety',
            text: "Feeling really overwhelmed with final exams coming up. Does anyone else feel like they're falling behind no matter how much they study?",
            time: '2h ago',
            reactions: { felt: 24, strong: 12, alone: 18 },
            color: 'bg-purple-100 text-purple-700'
        },
        {
            id: 2,
            category: 'Relationship',
            text: "Tried talking to my parents about my career choices, but it turned into an argument. It's hard when they don't see my vision.",
            time: '5h ago',
            reactions: { felt: 15, strong: 8, alone: 10 },
            color: 'bg-teal-100 text-teal-700'
        },
        {
            id: 3,
            category: 'Motivation',
            text: "Found a great study spot today! Small wins matter. Keep going everyone, you've got this! 🌱",
            time: '8h ago',
            reactions: { felt: 42, strong: 30, alone: 5 },
            color: 'bg-green-100 text-green-700'
        }
    ]);

    const categories = ['All', 'Anxiety', 'Depression', 'Relationship', 'Academic', 'Motivation'];

    const handlePost = () => {
        if (!postText.trim()) return;
        const newPost = {
            id: posts.length + 1,
            category: 'General',
            text: postText,
            time: 'Just now',
            reactions: { felt: 0, strong: 0, alone: 0 },
            color: 'bg-gray-100 text-gray-700'
        };
        setPosts([newPost, ...posts]);
        setPostText('');
    };

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-6 py-6 border-b border-gray-100">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <Users className="w-6 h-6 text-primary" />
                        </button>
                        <h1 className="text-2xl font-bold text-text-primary">Peer Feed</h1>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">100% Anonymous</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">You Are Not Alone 🤝</h2>
                        <p className="text-white/80 max-w-sm">
                            A safe, moderated space to share your thoughts and support fellow students.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <MessageCircle className="w-24 h-24" />
                    </div>
                </motion.div>

                {/* Post Composer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-[32px] shadow-custom"
                >
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Share what's on your mind. No names. No judgment."
                        className="w-full bg-background border-none rounded-2xl p-6 mb-4 focus:ring-2 focus:ring-primary/10 resize-none h-32 text-text-primary placeholder:text-text-secondary/50"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="flex gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${postText.length > 240 ? 'text-warning' : 'text-text-secondary'}`}>
                                    {postText.length} / 280
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={!postText.trim() || postText.length > 280}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                        >
                            Post Anonymously
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white text-text-secondary hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ translateY: -4 }}
                                className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${post.color}`}>
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-text-secondary font-medium">{post.time}</span>
                                </div>

                                <p className="text-text-primary text-lg leading-relaxed mb-8">
                                    {post.text}
                                </p>

                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {[
                                            { icon: <Heart className="w-4 h-4" />, label: "I feel this", key: 'felt' },
                                            { icon: <Shield className="w-4 h-4" />, label: "Stay strong", key: 'strong' },
                                            { icon: <Users className="w-4 h-4" />, label: "You're not alone", key: 'alone' }
                                        ].map(btn => (
                                            <motion.button
                                                key={btn.key}
                                                whileTap={{ scale: 1.3 }}
                                                className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-primary-light hover:text-primary transition-all flex items-center gap-2 group"
                                            >
                                                <span className="group-hover:animate-bounce">{btn.icon}</span>
                                                <span className="text-xs font-bold">{post.reactions[btn.key]}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <button className="p-2 text-text-secondary hover:text-danger opacity-40 hover:opacity-100 transition-all">
                                        <Flag className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default PeerFeed;
