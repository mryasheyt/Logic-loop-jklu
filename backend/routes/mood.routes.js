const router = require('express').Router();
const auth = require('../middleware/auth');
const Mood = require('../models/Mood');
const { computeVelocity, computeExtendedVelocity } = require('../services/velocity.service');
const { triggerContextNudge } = require('../services/nudge.service');

// POST /api/mood/log
router.post('/log', auth, async (req, res) => {
    try {
        const { score, emotions, note } = req.body;

        if (!score || score < 1 || score > 10) {
            return res.status(400).json({ message: 'Score must be between 1 and 10' });
        }

        // Compute velocity against previous entry
        const velocity = await computeVelocity(req.user._id);

        const mood = await Mood.create({
            user: req.user._id,
            score,
            emotions: emotions || [],
            note,
            velocityDelta: velocity.velocityDelta,
            isAnomalous: velocity.isAnomalous,
        });

        // If anomalous velocity, trigger a nudge
        if (velocity.isAnomalous) {
            await triggerContextNudge(req.user, { velocityDrop: true });
        }

        res.status(201).json({
            _id: mood._id,
            score: mood.score,
            emotions: mood.emotions,
            velocityDelta: mood.velocityDelta,
            isAnomalous: mood.isAnomalous,
            context: mood.context,
        });
    } catch (error) {
        console.error('Mood log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/mood/history?days=7
router.get('/history', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const moods = await Mood.find({
            user: req.user._id,
            createdAt: { $gte: since },
        }).sort({ createdAt: 1 });

        res.json({ moods });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/mood/velocity
router.get('/velocity', auth, async (req, res) => {
    try {
        const velocity = await computeExtendedVelocity(req.user._id);
        res.json(velocity);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/mood/insights
router.get('/insights', auth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const moods = await Mood.find({
            user: req.user._id,
            createdAt: { $gte: thirtyDaysAgo },
        });

        if (moods.length === 0) {
            return res.json({ avgMood: 0, totalEntries: 0, topEmotions: [], trend: 'neutral' });
        }

        const avgMood = Math.round((moods.reduce((s, m) => s + m.score, 0) / moods.length) * 10) / 10;

        // Count emotions
        const emotionCounts = {};
        moods.forEach(m => {
            (m.emotions || []).forEach(e => {
                emotionCounts[e] = (emotionCounts[e] || 0) + 1;
            });
        });
        const topEmotions = Object.entries(emotionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([emotion, count]) => ({ emotion, count }));

        // Trend
        const firstHalf = moods.slice(0, Math.floor(moods.length / 2));
        const secondHalf = moods.slice(Math.floor(moods.length / 2));
        const firstAvg = firstHalf.reduce((s, m) => s + m.score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((s, m) => s + m.score, 0) / secondHalf.length;
        const trend = secondAvg > firstAvg + 0.5 ? 'improving' : secondAvg < firstAvg - 0.5 ? 'declining' : 'stable';

        res.json({ avgMood, totalEntries: moods.length, topEmotions, trend });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
