const mongoose = require('mongoose');

const nudgeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['breathing', 'grounding', 'pomodoro', 'social', 'sleep'], required: true },
    trigger: { type: String }, // e.g. 'velocity_drop', 'high_burnout', 'late_night'
    content: {
        title: { type: String, required: true },
        message: { type: String, required: true },
        actionUrl: { type: String },
        duration: { type: Number }, // seconds
    },
    deliveredAt: { type: Date, default: Date.now },
    dismissedAt: { type: Date },
    wasHelpful: { type: Boolean },
}, {
    timestamps: true,
});

nudgeSchema.index({ user: 1, dismissedAt: 1 });

module.exports = mongoose.model('Nudge', nudgeSchema);
