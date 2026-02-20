const mongoose = require('mongoose');

const peerPostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    content: { type: String, required: true, maxlength: 280 },
    category: {
        type: String,
        enum: ['loneliness', 'academic_pressure', 'anxiety', 'burnout', 'homesickness', 'relationship', 'sleep', 'identity', 'other'],
        default: 'other',
    },

    reactions: {
        heart: { type: Number, default: 0 },
        strong: { type: Number, default: 0 },
        notAlone: { type: Number, default: 0 },
    },

    flagCount: { type: Number, default: 0 },
    isRemoved: { type: Boolean, default: false },
    expiresAt: { type: Date },
}, {
    timestamps: true,
});

// TTL index — auto-delete after 7 days
peerPostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
peerPostSchema.index({ category: 1, createdAt: -1 });

// Auto-set expiresAt on creation
peerPostSchema.pre('save', function () {
    if (this.isNew && !this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
});

module.exports = mongoose.model('PeerPost', peerPostSchema);
