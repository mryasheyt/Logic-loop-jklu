const cron = require('node-cron');
const User = require('../models/User');
const { updateBurnoutScore } = require('../services/burnout.service');
const { triggerContextNudge } = require('../services/nudge.service');

function startCronJobs() {
    // Daily burnout recalculation — runs at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running daily burnout recalculation...');
        try {
            const users = await User.find({}).select('_id');
            for (const user of users) {
                await updateBurnoutScore(user._id);
            }
            console.log(`[CRON] Updated burnout scores for ${users.length} users`);
        } catch (error) {
            console.error('[CRON] Burnout recalculation error:', error);
        }
    });

    // Nudge delivery — runs every hour, checks if it's the user's preferred nudge time
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Checking nudge delivery...');
        try {
            const currentHour = new Date().getHours().toString().padStart(2, '0');
            const users = await User.find({
                nudgesEnabled: true,
                nudgeTime: { $regex: `^${currentHour}:` },
            });

            for (const user of users) {
                const context = {};
                if (user.burnoutScore > 70) context.highBurnout = true;
                await triggerContextNudge(user, context);
            }
            console.log(`[CRON] Delivered nudges to ${users.length} users`);
        } catch (error) {
            console.error('[CRON] Nudge delivery error:', error);
        }
    });

    console.log('[CRON] Scheduled jobs started');
}

module.exports = startCronJobs;
