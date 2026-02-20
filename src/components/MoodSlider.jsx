import { useState } from 'react';
import { motion } from 'framer-motion';

const MoodSlider = ({ value, onChange }) => {
    const emojis = ['😔', '😟', '😐', '🙂', '😊', '😄'];
    const getEmoji = (val) => {
        const index = Math.min(Math.floor((val - 1) / 2), emojis.length - 1);
        return emojis[index];
    };

    return (
        <div className="w-full space-y-8 py-6">
            <div className="flex justify-center">
                <motion.div
                    key={value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    className="text-6xl"
                >
                    {getEmoji(value)}
                </motion.div>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-danger via-warning to-success rounded-lg appearance-none cursor-pointer accent-white border-2 border-white shadow-sm"
                />
                <div className="flex justify-between mt-2 px-1 text-xs text-text-secondary font-medium uppercase tracking-tighter">
                    <span>Struggling</span>
                    <span>Thriving</span>
                </div>
            </div>
        </div>
    );
};

export default MoodSlider;
