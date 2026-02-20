const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 10 },
    emotions: [{ type: String, enum: ['anxious', 'lonely', 'overwhelmed', 'happy', 'focused', 'tired', 'stressed', 'hopeful'] }],

    context: {
        examWithin48h: { type: Boolean, default: false },
        academicWeekType: { type: String, enum: ['midterm', 'finals', 'regular', 'break'], default: 'regular' },
    },

    velocityDelta: { type: Number, default: 0 },
    isAnomalous: { type: Boolean, default: false },
    note: { type: String, maxlength: 500 },
}, {
    timestamps: true,
});

moodSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema);
