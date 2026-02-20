import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePeerFeed, useCreatePost, useReactToPost, useFlagPost } from '../hooks/usePeerFeed'
import PeerPostCard from '../components/PeerPostCard'

const categories = [
    { key: 'all', label: 'All' },
    { key: 'loneliness', label: '😔 Loneliness' },
    { key: 'academic_pressure', label: '📚 Academic Pressure' },
    { key: 'anxiety', label: '😰 Anxiety' },
    { key: 'burnout', label: '🔥 Burnout' },
    { key: 'homesickness', label: '🏠 Homesickness' },
    { key: 'relationship', label: '💔 Relationship' },
    { key: 'sleep', label: '😴 Sleep' },
    { key: 'identity', label: '🪞 Identity' },
    { key: 'other', label: '💭 Other' },
]

export default function PeerFeed() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [content, setContent] = useState('')
    const [postCategory, setPostCategory] = useState('other')
    const { data, isLoading } = usePeerFeed(activeCategory)
    const createPost = useCreatePost()
    const reactToPost = useReactToPost()
    const flagPost = useFlagPost()

    const posts = data?.posts || data || []

    const handlePost = async () => {
        if (!content.trim() || content.length > 280) return
        try {
            await createPost.mutateAsync({ content: content.trim(), category: postCategory })
            setContent('')
        } catch { /* handled */ }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto px-4 py-6"
        >
            <h1 className="text-2xl font-bold text-text-dark mb-1">You Are Not Alone 🤝</h1>
            <p className="text-text-gray text-sm mb-6">Share anonymously. No judgments. No usernames.</p>

            {/* Post Composer */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 mb-6">
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value.slice(0, 280))}
                    placeholder="How are you feeling? Share anonymously..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                        <select
                            value={postCategory}
                            onChange={e => setPostCategory(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-gray focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            {categories.filter(c => c.key !== 'all').map(c => (
                                <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                        </select>
                        <span className={`text-xs font-medium ${content.length > 260 ? 'text-danger' : 'text-text-gray'}`}>
                            {content.length}/280
                        </span>
                    </div>
                    <button
                        onClick={handlePost}
                        disabled={!content.trim() || createPost.isPending}
                        className="px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center gap-2"
                    >
                        {createPost.isPending && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        )}
                        Post Anonymously
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                {categories.map(c => (
                    <button
                        key={c.key}
                        onClick={() => setActiveCategory(c.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeCategory === c.key
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-text-gray border border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Posts */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16">
                    <span className="text-5xl block mb-3">🌱</span>
                    <p className="text-text-gray">No posts in this category yet. You can be the first.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <PeerPostCard
                            key={post._id}
                            post={post}
                            onReact={(id, type) => reactToPost.mutate({ id, reactionType: type })}
                            onFlag={(id) => flagPost.mutate(id)}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    )
}
