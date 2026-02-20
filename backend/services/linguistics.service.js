const vader = require('vader-sentiment');
const { absolutistWords, crisisKeywords, negativeWords } = require('../utils/crisisKeywords');

/**
 * Analyze text for linguistic crisis indicators
 */
function analyzeText(text) {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Sentence metrics
    const sentenceCount = sentences.length;
    const avgSentenceLength = words.length / Math.max(sentenceCount, 1);

    // Negative word count
    const negCount = words.filter(w => negativeWords.includes(w)).length;

    // Crisis keyword detection
    const foundCrisisKeywords = crisisKeywords.filter(kw => lower.includes(kw));

    // Absolutist language
    const absolutistCount = words.filter(w => absolutistWords.includes(w)).length;

    // VADER sentiment
    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    const sentimentScore = sentiment.compound; // -1 to 1

    // Positive word ratio
    const positiveRatio = words.length > 0
        ? words.filter(w => {
            const s = vader.SentimentIntensityAnalyzer.polarity_scores(w);
            return s.compound > 0.1;
        }).length / words.length
        : 0.5;

    return {
        sentenceCount,
        avgSentenceLength,
        negativeWords: negCount,
        crisisKeywords: foundCrisisKeywords,
        absolutistCount,
        sentimentScore,
        positiveWordRatio: positiveRatio,
        wordCount: words.length,
    };
}

/**
 * Compare current analysis against user's baseline
 */
function computeDeviation(current, baseline) {
    if (!baseline || baseline.samplesCollected < 5) {
        // Not enough baseline data — use absolute thresholds
        return {
            sentenceLengthDeviation: 0,
            positiveRatioDeviation: 0,
            isDeviating: current.crisisKeywords.length > 0 || current.sentimentScore < -0.5,
        };
    }

    const sentenceLengthDeviation = baseline.avgSentenceLength > 0
        ? (current.avgSentenceLength - baseline.avgSentenceLength) / baseline.avgSentenceLength
        : 0;

    const positiveRatioDeviation = baseline.positiveWordRatio > 0
        ? (current.positiveWordRatio - baseline.positiveWordRatio) / baseline.positiveWordRatio
        : 0;

    // Deviating if sentences are 30%+ shorter, positive ratio dropped 40%+, or crisis keywords found
    const isDeviating = sentenceLengthDeviation < -0.3
        || positiveRatioDeviation < -0.4
        || current.crisisKeywords.length > 0
        || current.sentimentScore < -0.5;

    return { sentenceLengthDeviation, positiveRatioDeviation, isDeviating };
}

/**
 * Determine risk level from analysis
 */
function assessRisk(analysis, deviation) {
    if (analysis.crisisKeywords.length >= 2 || (analysis.crisisKeywords.length >= 1 && analysis.sentimentScore < -0.6)) {
        return 'high';
    }
    if (analysis.crisisKeywords.length >= 1 || deviation.isDeviating || analysis.sentimentScore < -0.4) {
        return 'moderate';
    }
    if (analysis.negativeWords >= 3 || analysis.absolutistCount >= 3 || analysis.sentimentScore < -0.2) {
        return 'low';
    }
    return 'none';
}

/**
 * Update user's linguistic baseline with new sample
 */
function updateBaseline(baseline, newSample) {
    const n = baseline.samplesCollected || 0;
    return {
        avgSentenceLength: (baseline.avgSentenceLength * n + newSample.avgSentenceLength) / (n + 1),
        avgResponseTimeMs: baseline.avgResponseTimeMs, // updated separately with response time
        positiveWordRatio: (baseline.positiveWordRatio * n + newSample.positiveWordRatio) / (n + 1),
        samplesCollected: n + 1,
    };
}

module.exports = { analyzeText, computeDeviation, assessRisk, updateBaseline };
