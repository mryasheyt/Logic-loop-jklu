const config = {
    none: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Safe' },
    low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Low Risk' },
    moderate: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Moderate' },
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk', pulse: true },
}

export default function RiskLevelBadge({ level = 'none' }) {
    const c = config[level] || config.none

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} ${c.pulse ? 'animate-pulse-ring' : ''
                }`}
        >
            <span className={`w-2 h-2 rounded-full ${level === 'none' ? 'bg-gray-400' :
                    level === 'low' ? 'bg-green-500' :
                        level === 'moderate' ? 'bg-amber-500' :
                            'bg-red-500'
                }`} />
            {c.label}
        </span>
    )
}
