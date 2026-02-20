const emotions = [
    { key: 'anxious', label: '😰 Anxious', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'lonely', label: '😞 Lonely', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'overwhelmed', label: '😵 Overwhelmed', color: 'bg-red-100 text-red-800 border-red-200' },
    { key: 'happy', label: '😊 Happy', color: 'bg-green-100 text-green-800 border-green-200' },
    { key: 'focused', label: '🎯 Focused', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'tired', label: '😴 Tired', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { key: 'stressed', label: '😣 Stressed', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { key: 'hopeful', label: '🌱 Hopeful', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
]

export default function EmotionTagSelector({ selected = [], onChange }) {
    const toggle = (key) => {
        if (selected.includes(key)) {
            onChange(selected.filter(s => s !== key))
        } else {
            onChange([...selected, key])
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {emotions.map(emotion => (
                <button
                    key={emotion.key}
                    type="button"
                    onClick={() => toggle(emotion.key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${selected.includes(emotion.key)
                            ? 'bg-primary text-white border-primary shadow-md scale-105'
                            : `${emotion.color} hover:scale-105`
                        }`}
                >
                    {emotion.label}
                </button>
            ))}
        </div>
    )
}
