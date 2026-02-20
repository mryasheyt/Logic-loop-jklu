const router = require('express').Router();
const auth = require('../middleware/auth');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { chat } = require('../services/openai.service');
const { analyzeText, computeDeviation, assessRisk, updateBaseline } = require('../services/linguistics.service');
const { triggerContextNudge } = require('../services/nudge.service');

// POST /api/chat/session — create new session
router.post('/session', auth, async (req, res) => {
    try {
        const { sessionType } = req.body;

        const session = await ChatSession.create({
            user: req.user._id,
            sessionType: sessionType || 'freeform',
            messages: [],
        });

        res.status(201).json({
            sessionId: session._id,
            sessionType: session.sessionType,
            messages: [],
            riskLevel: 'none',
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/chat/session/:id/message
router.post('/session/:id/message', auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const session = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
        if (!session) return res.status(404).json({ message: 'Session not found' });

        // Analyze user message linguistics
        const analysis = analyzeText(content);
        const deviation = computeDeviation(analysis, req.user.linguisticBaseline);
        const messageRisk = assessRisk(analysis, deviation);

        // Add user message
        session.messages.push({
            role: 'user',
            content,
            linguistics: {
                sentenceCount: analysis.sentenceCount,
                negativeWords: analysis.negativeWords,
                crisisKeywords: analysis.crisisKeywords,
                sentimentScore: analysis.sentimentScore,
            },
        });

        // Get AI response from Grok
        const aiResponse = await chat(req.user, session.messages, session.sessionType);

        // Add assistant message
        session.messages.push({
            role: 'assistant',
            content: aiResponse,
        });

        // Update session risk level (escalate only, never de-escalate within session)
        const riskLevels = ['none', 'low', 'moderate', 'high'];
        const currentIdx = riskLevels.indexOf(session.riskLevel);
        const newIdx = riskLevels.indexOf(messageRisk);
        if (newIdx > currentIdx) {
            session.riskLevel = messageRisk;
        }

        // Handle crisis escalation
        let nudgeTriggered = false;
        if (session.riskLevel === 'high' && !session.escalatedToCounselor) {
            session.escalatedToCounselor = true;
            await User.findByIdAndUpdate(req.user._id, { isFlaggedForCrisis: true });

            // Emit socket event (will be caught by server.js)
            const io = req.app.get('io');
            if (io) {
                io.emit('crisis:escalated', { userId: req.user._id, sessionId: session._id });
            }
        }

        // Trigger nudge if moderate risk
        if (session.riskLevel === 'moderate') {
            await triggerContextNudge(req.user, { velocityDrop: true });
            nudgeTriggered = true;
        }

        // Update linguistic baseline (only for non-crisis, normal conversation)
        if (session.riskLevel === 'none' || session.riskLevel === 'low') {
            const newBaseline = updateBaseline(req.user.linguisticBaseline, analysis);
            await User.findByIdAndUpdate(req.user._id, { linguisticBaseline: newBaseline });
        }

        await session.save();

        res.json({
            message: { role: 'assistant', content: aiResponse },
            riskLevel: session.riskLevel,
            nudgeTriggered,
        });
    } catch (error) {
        console.error('Chat message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/chat/history
router.get('/history', auth, async (req, res) => {
    try {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const sessions = await ChatSession.find({
            user: req.user._id,
            createdAt: { $gte: ninetyDaysAgo },
        })
            .sort({ createdAt: -1 })
            .select('sessionType riskLevel createdAt messages');

        res.json({ sessions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
