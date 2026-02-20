const mongoose = require('mongoose');

const burnoutCheckinSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restedScore: { type: Number, required: true, min: 1, max: 5 },
    motivationScore: { type: Number, required: true, min: 1, max: 5 },
    tookBreaks: { type: Boolean, required: true },
    computedBurnout: { type: Number, min: 0, max: 100 },
}, {
    timestamps: true,
});

burnoutCheckinSchema.index({ user: 1, createdAt: -1 });

// Compute burnout score before save
burnoutCheckinSchema.pre('save', function () {
    if (this.isNew || this.isModified('restedScore') || this.isModified('motivationScore') || this.isModified('tookBreaks')) {
        // Higher rested + motivation + breaks = lower burnout
        const restComponent = this.restedScore * 8;   // 0-40
        const motivComponent = this.motivationScore * 8; // 0-40
        const breakComponent = this.tookBreaks ? 20 : 0; // 0-20
        this.computedBurnout = Math.max(0, Math.min(100, 100 - (restComponent + motivComponent + breakComponent)));
    }
});

module.exports = mongoose.model('BurnoutCheckin', burnoutCheckinSchema);
