const Mood = require('../models/Mood');

/**
 * Compute mood velocity (rate of change) for a user
 * Returns the delta between most recent and previous mood entries
 */
async function computeVelocity(userId) {
    const recentMoods = await Mood.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(2);

    if (recentMoods.length < 2) {
        return { velocityDelta: 0, isAnomalous: false, message: 'Not enough data for velocity' };
    }

    const [latest, previous] = recentMoods;
    const delta = latest.score - previous.score;
    const timeDiffMs = latest.createdAt - previous.createdAt;
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    // Anomalous if mood dropped 3+ points within 72 hours
    const isAnomalous = delta <= -3 && timeDiffHours <= 72;

    let message = '';
    if (delta < 0) {
        message = `Your mood dropped ${Math.abs(delta)} points in the last ${Math.round(timeDiffHours)} hours`;
    } else if (delta > 0) {
        message = `Your mood improved ${delta} points. Keep going! 🌱`;
    } else {
        message = 'Your mood has been stable';
    }

    return { velocityDelta: delta, isAnomalous, message };
}

/**
 * Check velocity for 72-hour window (multi-entry)
 */
async function computeExtendedVelocity(userId) {
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const moods = await Mood.find({
        user: userId,
        createdAt: { $gte: threeDaysAgo },
    }).sort({ createdAt: 1 });

    if (moods.length < 2) {
        return { velocityDelta: 0, isAnomalous: false, message: 'Not enough recent data' };
    }

    const first = moods[0];
    const last = moods[moods.length - 1];
    const delta = last.score - first.score;
    const isAnomalous = delta <= -3;

    let message = '';
    if (delta < 0) {
        message = `Your mood dropped ${Math.abs(delta)} points in the last 3 days`;
    } else if (delta > 0) {
        message = `Your mood improved ${delta} points in the last 3 days. Keep going! 🌱`;
    } else {
        message = 'Your mood has been stable over the last 3 days';
    }

    return { velocityDelta: delta, isAnomalous, message };
}

module.exports = { computeVelocity, computeExtendedVelocity };
