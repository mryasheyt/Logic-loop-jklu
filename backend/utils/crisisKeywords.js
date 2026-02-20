// Absolutist words linked to depression/anxiety (Al-Mosaiwi & Johnstone, 2018)
const absolutistWords = [
    'always', 'never', 'nothing', 'completely', 'totally', 'everyone', 'no one',
    'everything', 'nobody', 'nowhere', 'forever', 'constantly', 'entirely',
    'absolutely', 'every', 'whole', 'all',
];

// Crisis keywords indicating immediate risk
const crisisKeywords = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'self-harm',
    'self harm', 'cutting', 'overdose', 'no reason to live', 'better off dead',
    'cant go on', "can't go on", 'give up', 'hopeless', 'worthless', 'pointless',
    'no way out', 'end it all', 'hurt myself', 'not worth it',
];

// Negative emotion words for linguistic analysis
const negativeWords = [
    'sad', 'depressed', 'anxious', 'worried', 'scared', 'afraid', 'terrible',
    'horrible', 'awful', 'miserable', 'lonely', 'alone', 'empty', 'exhausted',
    'overwhelmed', 'stressed', 'angry', 'frustrated', 'disappointed', 'ashamed',
    'guilty', 'helpless', 'trapped', 'failing', 'broken', 'useless', 'lost',
    'numb', 'pain', 'suffering', 'crying', 'tears', 'panic', 'dread',
];

module.exports = { absolutistWords, crisisKeywords, negativeWords };
