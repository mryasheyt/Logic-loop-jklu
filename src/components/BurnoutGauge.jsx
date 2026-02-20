export default function BurnoutGauge({ score = 0, size = 200 }) {
    const getColor = (s) => {
        if (s <= 40) return '#059669'
        if (s <= 70) return '#D97706'
        return '#DC2626'
    }

    const getLabel = (s) => {
        if (s <= 40) return "You're doing well"
        if (s <= 70) return 'Watch your energy'
        return 'Recovery mode activated'
    }

    const color = getColor(score)
    const radius = 80
    const strokeWidth = 14
    const cx = 100
    const cy = 100
    const circumference = Math.PI * radius
    const progress = (score / 100) * circumference

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
                {/* Background arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    style={{ transition: 'stroke-dasharray 0.8s ease-out, stroke 0.3s ease' }}
                />
                {/* Score text */}
                <text x={cx} y="85" textAnchor="middle" fontSize="32" fontWeight="700" fill={color}>
                    {score}
                </text>
                <text x={cx} y="105" textAnchor="middle" fontSize="10" fill="#6B7280">
                    / 100
                </text>
            </svg>
            <p className="text-sm font-semibold mt-1" style={{ color }}>{getLabel(score)}</p>
        </div>
    )
}
