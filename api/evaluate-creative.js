const COMPONENTS = [
    { id: 'subject', label: 'Subject & action', rubric: 'Does the student describe who/what is in the frame and what is happening?' },
    { id: 'style', label: 'Style / medium', rubric: 'Does the prompt reference an art style, medium, or technique?' },
    { id: 'mood', label: 'Mood / atmosphere', rubric: 'Does it set an emotional tone or vibe?' },
    { id: 'lighting', label: 'Lighting / camera', rubric: 'Does it mention lighting, camera angles, or time of day?' },
    { id: 'quality', label: 'Quality specs', rubric: 'Does it include fidelity cues like 4K, ultra-detailed, HDR, etc.?' }
];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('Missing OPENAI_API_KEY');
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an art director helping students learn to write detailed generative image prompts.
Evaluate the student's prompt across the following components and respond with strict JSON.

Components:
${COMPONENTS.map((c, index) => `${index + 1}. ${c.label} -> ${c.rubric}`).join('\n')}

Scoring rubric:
- Award 20 points per component that is strong (total 0-100).
- A component is "met" when the concept is clearly present.
- Give concise feedback for each component.

Return JSON with:
{
  "score": number (0-100),
  "components": [
    { "id": "subject", "label": "Subject & action", "met": true/false, "feedback": "short note" },
    ... (include every component in the same order)
  ],
  "strengths": ["bullet"],
  "improvements": ["bullet"],
  "tip": "one-sentence coaching tip"
}`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('No content returned by OpenAI.');
        }

        const parsed = JSON.parse(content);
        const normalizedComponents = COMPONENTS.map((component) => {
            const match = Array.isArray(parsed.components)
                ? parsed.components.find((entry) => entry.id === component.id)
                : null;
            return {
                id: component.id,
                label: component.label,
                met: Boolean(match?.met),
                feedback: match?.feedback || ''
            };
        });

        return res.status(200).json({
            score: Number(parsed.score) || 0,
            components: normalizedComponents,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            tip: parsed.tip || ''
        });
    } catch (error) {
        console.error('evaluate-creative error:', error);
        return res.status(500).json({ error: 'Failed to evaluate creative prompt', details: error.message });
    }
}
