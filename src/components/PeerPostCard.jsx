import { useState } from 'react'

const categoryColors = {
    loneliness: 'bg-blue-100 text-blue-700',
    academic_pressure: 'bg-purple-100 text-purple-700',
    anxiety: 'bg-amber-100 text-amber-700',
    burnout: 'bg-red-100 text-red-700',
    homesickness: 'bg-teal-100 text-teal-700',
    relationship: 'bg-pink-100 text-pink-700',
    sleep: 'bg-indigo-100 text-indigo-700',
    identity: 'bg-emerald-100 text-emerald-700',
    other: 'bg-gray-100 text-gray-700',
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
}

export default function PeerPostCard({ post, onReact, onFlag }) {
    const [reacted, setReacted] = useState({})
    const [flagged, setFlagged] = useState(false)

    const handleReact = (type) => {
        if (reacted[type]) return
        setReacted(prev => ({ ...prev, [type]: true }))
        onReact?.(post._id, type)
    }

    const handleFlag = () => {
        if (flagged) return
        setFlagged(true)
        onFlag?.(post._id)
    }

    const reactions = [
        { type: 'heart', icon: '❤️', label: 'I feel this', count: post.reactions?.heart || 0 },
        { type: 'strong', icon: '💪', label: 'Stay strong', count: post.reactions?.strong || 0 },
        { type: 'notAlone', icon: '🤝', label: "You're not alone", count: post.reactions?.notAlone || 0 },
    ]

    return (
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-50 hover:shadow-md transition-shadow">
            {/* Category badge */}
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${categoryColors[post.category] || categoryColors.other}`}>
                {post.category?.replace('_', ' ')}
            </span>

            {/* Content */}
            <p className="text-text-dark text-sm leading-relaxed mb-4">{post.content}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-text-gray">{timeAgo(post.createdAt)}</span>
                <div className="flex items-center gap-2">
                    {reactions.map(r => (
                        <button
                            key={r.type}
                            onClick={() => handleReact(r.type)}
                            title={r.label}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${reacted[r.type]
                                    ? 'bg-primary text-white scale-105'
                                    : 'bg-gray-50 text-text-gray hover:bg-gray-100'
                                }`}
                        >
                            <span>{r.icon}</span>
                            <span className="font-medium">{r.count + (reacted[r.type] ? 1 : 0)}</span>
                        </button>
                    ))}
                    <button
                        onClick={handleFlag}
                        title="Report post"
                        className={`p-1.5 rounded-lg text-xs transition ${flagged ? 'text-gray-300 cursor-not-allowed' : 'text-text-gray hover:bg-red-50 hover:text-danger'
                            }`}
                        disabled={flagged}
                    >
                        🚩
                    </button>
                </div>
            </div>
        </div>
    )
}
