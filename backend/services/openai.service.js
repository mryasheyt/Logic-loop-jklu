const Mood = require('../models/Mood');

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';

/**
 * Build dynamic system prompt based on user context
 */
async function buildSystemPrompt(user) {
    const recentMoods = await Mood.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(3);

    const moodScores = recentMoods.map(m => m.score);
    const velocityDelta = recentMoods.length >= 2
        ? recentMoods[0].score - recentMoods[1].score
        : 0;

    return `You are MindMate AI, a compassionate mental health companion for college students.

STUDENT: ${user.name}, ${user.university || 'Unknown university'}
BURNOUT: ${user.burnoutScore}/100 (${user.burnoutRiskLevel})
MOOD SCORES: ${moodScores.length > 0 ? moodScores.join(', ') : 'none'}/10, velocity: ${velocityDelta}

RULES:
- Keep responses 2-4 sentences, warm and non-clinical
- Validate feelings before suggesting coping strategies
- Never diagnose or prescribe medication
- If burnout > 70: suggest rest, not productivity
- If mood dropping fast (velocity <= -3): be extra attentive, suggest counselor
- For crisis/self-harm mentions: provide iCall 9152987821, Vandrevala Foundation 1860-2662-345
- End with a gentle follow-up question when appropriate`;
}

/**
 * Send message using Hugging Face Inference API via router
 */
async function chat(user, messages, sessionType = 'freeform') {
    const systemPrompt = await buildSystemPrompt(user);

    const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
        })),
    ];

    const models = [
        'meta-llama/Llama-3.1-70B-Instruct',
        'Qwen/Qwen2.5-Coder-32B-Instruct',
    ];

    for (const model of models) {
        try {
            const res = await fetch(HF_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: chatMessages,
                    max_tokens: 300,
                    temperature: 0.7,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error(`HF ${model} error (${res.status}):`, errText.slice(0, 120));
                continue;
            }

            const data = await res.json();
            if (data.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }
        } catch (error) {
            console.error(`HF ${model} fetch error:`, error.message?.slice(0, 80));
            continue;
        }
    }

    return "I'm here for you. I'm experiencing a brief delay — please try again in a moment. If you need immediate support, call iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345. 💙";
}

module.exports = { chat, buildSystemPrompt };
