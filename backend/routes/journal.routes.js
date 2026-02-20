const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/journal/entry
router.post('/entry', auth, async (req, res) => {
    try {
        const { content, moodScore } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const user = await User.findById(req.user._id);
        user.journalEntries.push({ content, moodScore });
        await user.save();

        const entry = user.journalEntries[user.journalEntries.length - 1];
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/journal/entries
router.get('/entries', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('journalEntries');
        const entries = (user.journalEntries || []).sort((a, b) => b.createdAt - a.createdAt);
        res.json({ entries });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/journal/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const { content, moodScore } = req.body;
        const user = await User.findById(req.user._id);

        const entry = user.journalEntries.id(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        if (content) entry.content = content;
        if (moodScore !== undefined) entry.moodScore = moodScore;
        await user.save();

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/journal/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const entry = user.journalEntries.id(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        entry.deleteOne();
        await user.save();

        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
