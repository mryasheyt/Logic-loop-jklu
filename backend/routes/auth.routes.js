const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, university, year } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, university, year });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                university: user.university,
                burnoutScore: user.burnoutScore,
                burnoutRiskLevel: user.burnoutRiskLevel,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                university: user.university,
                burnoutScore: user.burnoutScore,
                burnoutRiskLevel: user.burnoutRiskLevel,
                nudgesEnabled: user.nudgesEnabled,
                nudgeTime: user.nudgeTime,
                timezone: user.timezone,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

// PUT /api/auth/me
router.put('/me', auth, async (req, res) => {
    try {
        const { name, university, year, timezone } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (university) updates.university = university;
        if (year) updates.year = year;
        if (timezone) updates.timezone = timezone;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/auth/me — GDPR-compliant full deletion
router.delete('/me', auth, async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const userId = req.user._id;

        // Delete all user data
        await Promise.all([
            mongoose.model('Mood').deleteMany({ user: userId }),
            mongoose.model('ChatSession').deleteMany({ user: userId }),
            mongoose.model('PeerPost').deleteMany({ user: userId }),
            mongoose.model('BurnoutCheckin').deleteMany({ user: userId }),
            mongoose.model('Nudge').deleteMany({ user: userId }),
            User.findByIdAndDelete(userId),
        ]);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
