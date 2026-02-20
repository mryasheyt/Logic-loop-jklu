const router = require('express').Router();
const auth = require('../middleware/auth');
const PeerPost = require('../models/PeerPost');

// POST /api/peer/post
router.post('/post', auth, async (req, res) => {
    try {
        const { content, category } = req.body;

        if (!content || content.length > 280) {
            return res.status(400).json({ message: 'Content is required and must be under 280 characters' });
        }

        const post = await PeerPost.create({
            user: req.user._id,
            content,
            category: category || 'other',
        });

        // Return without user field
        res.status(201).json({
            _id: post._id,
            content: post.content,
            category: post.category,
            reactions: post.reactions,
            createdAt: post.createdAt,
        });
    } catch (error) {
        console.error('Peer post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/peer/feed
router.get('/feed', auth, async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isRemoved: false };
        if (category && category !== 'all') {
            filter.category = category;
        }

        // user field has select:false in schema, so it's automatically excluded
        const posts = await PeerPost.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .select('-user');

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/peer/:id/react
router.post('/:id/react', auth, async (req, res) => {
    try {
        const { reactionType } = req.body;

        if (!['heart', 'strong', 'notAlone'].includes(reactionType)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const update = { $inc: { [`reactions.${reactionType}`]: 1 } };
        const post = await PeerPost.findByIdAndUpdate(req.params.id, update, { new: true }).select('-user');

        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.json({ reactions: post.reactions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/peer/:id/flag
router.post('/:id/flag', auth, async (req, res) => {
    try {
        const post = await PeerPost.findByIdAndUpdate(
            req.params.id,
            { $inc: { flagCount: 1 } },
            { new: true }
        );

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Auto-remove if 3+ flags
        if (post.flagCount >= 3) {
            post.isRemoved = true;
            await post.save();
        }

        res.json({ message: 'Post flagged', flagCount: post.flagCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
