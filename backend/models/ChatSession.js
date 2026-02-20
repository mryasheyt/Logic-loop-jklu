const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    linguistics: {
        sentenceCount: { type: Number },
        negativeWords: { type: Number },
        crisisKeywords: [String],
        sentimentScore: { type: Number },
        responseTimeMs: { type: Number },
    },
    createdAt: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionType: { type: String, enum: ['checkin', 'crisis', 'freeform', 'guided'], default: 'freeform' },
    messages: [messageSchema],
    riskLevel: { type: String, enum: ['none', 'low', 'moderate', 'high'], default: 'none' },
    escalatedToCounselor: { type: Boolean, default: false },
}, {
    timestamps: true,
});

chatSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
