const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const journalEntrySchema = new mongoose.Schema({
    content: { type: String, required: true },
    moodScore: { type: Number, min: 1, max: 10 },
    createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    university: { type: String, trim: true },
    year: { type: Number, min: 1, max: 6 },

    // Burnout tracking
    burnoutScore: { type: Number, default: 0, min: 0, max: 100 },
    burnoutRiskLevel: { type: String, enum: ['low', 'moderate', 'high', 'critical'], default: 'low' },

    // Linguistic baseline (built over first 2 weeks)
    linguisticBaseline: {
        avgSentenceLength: { type: Number, default: 0 },
        avgResponseTimeMs: { type: Number, default: 0 },
        positiveWordRatio: { type: Number, default: 0.5 },
        samplesCollected: { type: Number, default: 0 },
    },

    // Calendar integration
    calendarToken: { type: String },

    // Counselor
    assignedCounselor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isFlaggedForCrisis: { type: Boolean, default: false },

    // Nudge preferences
    nudgesEnabled: { type: Boolean, default: true },
    nudgeTime: { type: String, default: '09:00' },
    timezone: { type: String, default: 'Asia/Kolkata' },

    // Journal entries (embedded)
    journalEntries: [journalEntrySchema],
}, {
    timestamps: true,
});

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// Never return password in JSON
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
