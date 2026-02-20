const emojis = ['😔', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳']

export default function MoodSlider({ value, onChange }) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-2xl">😔</span>
                <span className="text-3xl">{emojis[value - 1]}</span>
                <span className="text-2xl">😊</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="mood-slider w-full cursor-pointer"
            />
            <div className="flex justify-between mt-1 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <span key={n} className="text-xs text-text-gray font-medium">{n}</span>
                ))}
            </div>
        </div>
    )
}
