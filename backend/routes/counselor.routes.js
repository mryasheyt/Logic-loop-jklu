const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/counselor/alerts — get all flagged users
router.get('/alerts', auth, async (req, res) => {
    try {
        const flaggedUsers = await User.find({ isFlaggedForCrisis: true })
            .select('name email university burnoutScore burnoutRiskLevel isFlaggedForCrisis createdAt');

        res.json({ alerts: flaggedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/counselor/resolve/:userId — clear crisis flag
router.post('/resolve/:userId', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { isFlaggedForCrisis: false });
        res.json({ message: 'Crisis resolved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/counselor/caseload
router.get('/caseload', auth, async (req, res) => {
    try {
        const students = await User.find({ assignedCounselor: req.user._id })
            .select('name email university burnoutScore burnoutRiskLevel isFlaggedForCrisis');

        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
