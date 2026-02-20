const Nudge = require('../models/Nudge');

const nudgeTemplates = {
    breathing: {
        title: 'Take a Breath 🫁',
        message: 'Try box breathing: inhale 4 seconds, hold 4, exhale 4, hold 4. Repeat 4 times.',
        duration: 60,
    },
    grounding: {
        title: 'Ground Yourself 🌍',
        message: '5-4-3-2-1: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
        duration: 60,
    },
    pomodoro: {
        title: 'Focus Reset 🎯',
        message: 'Study for 25 minutes, then take a 5-minute break. You\'ve got this!',
        duration: 1500,
    },
    social: {
        title: 'Connect with Someone 💬',
        message: 'Send a quick message to a friend or family member. Human connection heals.',
        duration: 60,
    },
    sleep: {
        title: 'Wind Down 😴',
        message: 'Put your phone away 30 minutes before bed. Try reading or gentle stretching instead.',
        duration: 1800,
    },
};

/**
 * Create a nudge for a user based on context
 */
async function createNudge(userId, type, trigger) {
    const template = nudgeTemplates[type] || nudgeTemplates.breathing;

    const nudge = await Nudge.create({
        user: userId,
        type,
        trigger,
        content: {
            title: template.title,
            message: template.message,
            duration: template.duration,
        },
    });

    return nudge;
}

/**
 * Decide what nudge to create based on user state
 */
async function triggerContextNudge(user, context = {}) {
    let type = 'breathing';
    let trigger = 'general_check';

    if (context.velocityDrop) {
        type = 'breathing';
        trigger = 'velocity_drop';
    } else if (context.highBurnout) {
        type = 'sleep';
        trigger = 'high_burnout';
    } else if (context.examSoon) {
        type = 'pomodoro';
        trigger = 'exam_approaching';
    } else if (context.loneliness) {
        type = 'social';
        trigger = 'loneliness_detected';
    } else if (context.overwhelmed) {
        type = 'grounding';
        trigger = 'overwhelm_detected';
    }

    return createNudge(user._id, type, trigger);
}

module.exports = { createNudge, triggerContextNudge, nudgeTemplates };
