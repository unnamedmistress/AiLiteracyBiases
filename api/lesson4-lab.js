const SCENARIO_LABELS = {
    cot: 'Chain-of-Thought reasoning',
    role: 'Role-based prompting',
    fewshot: 'Few-shot patterning',
    custom: 'Custom prompting'
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('Missing OPENAI_API_KEY for lesson4 lab');
        return res.status(500).json({ error: 'Server configuration error: missing API key' });
    }

    const { task, prompt, scenario } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'A prompt is required for evaluation.' });
    }

    const scenarioLabel = SCENARIO_LABELS[scenario] || 'Free-form experimentation';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are Prompt Lab, a combined AI simulator and prompt coach. Execute the user's prompt, then grade it.
Respond with strict JSON using this shape:
{
  "assistant_response": "the reply the player's prompt would generate",
  "score": number 0-100,
  "summary": "one line reason",
  "strengths": ["bullet"],
  "suggestions": ["two concrete suggestions that would elevate the prompt"],
  "rubric": [
    { "area": "Specificity", "met": true/false, "note": "short" },
    { "area": "Constraints", "met": true/false, "note": "short" },
    { "area": "Reasoning", "met": true/false, "note": "short" }
  ]
}
All text must be concise. Suggestions list must contain exactly two entries.`
                    },
                    {
                        role: 'user',
                        content: `Scenario: ${scenarioLabel}\nTask context: ${task || 'Not provided'}\nPrompt to run: ${prompt}`
                    }
                ],
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'OpenAI error');
        }

        const messageContent = data?.choices?.[0]?.message?.content;
        if (!messageContent) {
            throw new Error('No content returned by OpenAI.');
        }

        const parsed = JSON.parse(messageContent);
        const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 2) : [];

        return res.status(200).json({
            response: parsed.assistant_response || parsed.response || '',
            score: Number(parsed.score) || 0,
            summary: parsed.summary || '',
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            suggestions,
            rubric: Array.isArray(parsed.rubric) ? parsed.rubric : []
        });
    } catch (error) {
        console.error('Lesson4 lab error:', error);
        return res.status(500).json({ error: 'Failed to process prompt', details: error.message });
    }
}
