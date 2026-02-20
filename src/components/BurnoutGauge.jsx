import { motion } from 'framer-motion';

const BurnoutGauge = ({ score = 0 }) => {
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const semiCircumference = circumference / 2;

    // score is 0-100. We want to map 0-100 to 0-semiCircumference
    const strokeDashoffset = semiCircumference - (score / 100) * semiCircumference;

    const getColor = (s) => {
        if (s < 40) return '#16A34A'; // Success / Green
        if (s < 70) return '#D97706'; // Warning / Amber
        return '#DC2626'; // Danger / Red
    };

    return (
        <div className="relative flex flex-col items-center">
            <svg
                height={radius * 1.5}
                width={radius * 2}
                className="transform rotate-0"
            >
                {/* Background track */}
                <path
                    d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${radius * 2 - stroke},${radius}`}
                    fill="transparent"
                    stroke="#E5E7EB"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
                {/* Progress fill */}
                <motion.path
                    d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${radius * 2 - stroke},${radius}`}
                    fill="transparent"
                    stroke={getColor(score)}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: score / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ strokeDasharray: semiCircumference }}
                />
            </svg>
            <div className="absolute top-[35%] flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold text-text-primary"
                >
                    {score}
                </motion.span>
                <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Burnout Risk</span>
            </div>
            {score > 70 && (
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-danger/10 rounded-full blur-2xl -z-10"
                />
            )}
        </div>
    );
};

export default BurnoutGauge;
