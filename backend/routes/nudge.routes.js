const router = require('express').Router();
const auth = require('../middleware/auth');
const Nudge = require('../models/Nudge');
const User = require('../models/User');

// GET /api/nudges/pending
router.get('/pending', auth, async (req, res) => {
    try {
        const nudges = await Nudge.find({
            user: req.user._id,
            dismissedAt: null,
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({ nudges });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/nudges/dismiss
router.post('/dismiss', auth, async (req, res) => {
    try {
        const { nudgeId, wasHelpful } = req.body;

        const nudge = await Nudge.findOneAndUpdate(
            { _id: nudgeId, user: req.user._id },
            { dismissedAt: new Date(), wasHelpful },
            { new: true }
        );

        if (!nudge) return res.status(404).json({ message: 'Nudge not found' });

        res.json({ message: 'Nudge dismissed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/nudges/preferences
router.put('/preferences', auth, async (req, res) => {
    try {
        const { nudgesEnabled, nudgeTime } = req.body;
        const updates = {};
        if (nudgesEnabled !== undefined) updates.nudgesEnabled = nudgesEnabled;
        if (nudgeTime) updates.nudgeTime = nudgeTime;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
