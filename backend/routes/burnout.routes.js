const router = require('express').Router();
const auth = require('../middleware/auth');
const BurnoutCheckin = require('../models/BurnoutCheckin');
const { updateBurnoutScore, hasCheckedInToday } = require('../services/burnout.service');
const { triggerContextNudge } = require('../services/nudge.service');

// POST /api/burnout/checkin
router.post('/checkin', auth, async (req, res) => {
    try {
        const { restedScore, motivationScore, tookBreaks } = req.body;

        if (!restedScore || !motivationScore || tookBreaks === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if already checked in today
        const alreadyDone = await hasCheckedInToday(req.user._id);
        if (alreadyDone) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const checkin = await BurnoutCheckin.create({
            user: req.user._id,
            restedScore,
            motivationScore,
            tookBreaks,
        });

        // Update user's overall burnout score
        const result = await updateBurnoutScore(req.user._id);

        // Trigger nudge if burnout is high
        if (result && result.score > 70) {
            await triggerContextNudge(req.user, { highBurnout: true });
        }

        res.status(201).json({
            checkin,
            score: result?.score || checkin.computedBurnout,
            riskLevel: result?.riskLevel || 'low',
        });
    } catch (error) {
        console.error('Burnout checkin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/burnout/score
router.get('/score', auth, async (req, res) => {
    try {
        const checkedInToday = await hasCheckedInToday(req.user._id);
        res.json({
            score: req.user.burnoutScore,
            riskLevel: req.user.burnoutRiskLevel,
            checkedInToday,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/burnout/trend
router.get('/trend', auth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const trend = await BurnoutCheckin.find({
            user: req.user._id,
            createdAt: { $gte: thirtyDaysAgo },
        }).sort({ createdAt: 1 });

        res.json({ trend });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
