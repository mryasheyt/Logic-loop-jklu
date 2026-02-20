const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/crisis/escalate
router.post('/escalate', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isFlaggedForCrisis: true });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('crisis:escalated', {
                userId: req.user._id,
                name: req.user.name,
                timestamp: new Date(),
            });
        }

        res.json({ message: 'Crisis escalated. A counselor has been notified.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/crisis/resources
router.get('/resources', (req, res) => {
    res.json({
        resources: [
            { name: 'iCall', number: '9152987821', availability: 'Mon–Sat 8am–10pm', desc: 'Professional counseling service by TISS' },
            { name: 'Vandrevala Foundation', number: '1860-2662-345', availability: '24/7', desc: 'Mental health helpline' },
            { name: 'iMind', number: '4066-2222', availability: '24/7', desc: 'Emotional support helpline' },
            { name: 'NIMHANS', number: '080-46110007', availability: '24/7', desc: 'National mental health helpline' },
        ],
    });
});

// GET /api/crisis/hotlines
router.get('/hotlines', (req, res) => {
    res.json({
        hotlines: [
            { name: 'iCall', number: '9152987821', availability: 'Mon–Sat 8am–10pm', desc: 'Professional counseling service by TISS' },
            { name: 'Vandrevala Foundation', number: '1860-2662-345', availability: '24/7', desc: 'Mental health helpline' },
            { name: 'iMind', number: '4066-2222', availability: '24/7', desc: 'Emotional support helpline' },
            { name: 'NIMHANS', number: '080-46110007', availability: '24/7', desc: 'National mental health helpline' },
            { name: 'Snehi', number: '044-24640050', availability: '24/7', desc: 'Emotional support' },
            { name: 'AASRA', number: '9820466726', availability: '24/7', desc: 'Crisis intervention' },
        ],
    });
});

module.exports = router;
