const BurnoutCheckin = require('../models/BurnoutCheckin');
const User = require('../models/User');

/**
 * Update user's burnout score based on recent check-ins (7-day average)
 */
async function updateBurnoutScore(userId) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const checkins = await BurnoutCheckin.find({
        user: userId,
        createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    if (checkins.length === 0) return null;

    // Average of recent burnout scores
    const avgBurnout = Math.round(
        checkins.reduce((sum, c) => sum + c.computedBurnout, 0) / checkins.length
    );

    // Determine risk level
    let riskLevel = 'low';
    if (avgBurnout >= 90) riskLevel = 'critical';
    else if (avgBurnout >= 70) riskLevel = 'high';
    else if (avgBurnout >= 40) riskLevel = 'moderate';

    await User.findByIdAndUpdate(userId, {
        burnoutScore: avgBurnout,
        burnoutRiskLevel: riskLevel,
    });

    return { score: avgBurnout, riskLevel };
}

/**
 * Check if user has already checked in today
 */
async function hasCheckedInToday(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const checkin = await BurnoutCheckin.findOne({
        user: userId,
        createdAt: { $gte: startOfDay },
    });

    return !!checkin;
}

module.exports = { updateBurnoutScore, hasCheckedInToday };
