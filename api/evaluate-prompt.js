export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('Missing OPENAI_API_KEY');
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    if (!prompt) {
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
                        content: `You are an expert prompt engineer grading a user's prompt. 
The user is trying to write a prompt for: "Get AI to write a compelling product description for noise-cancelling headphones that targets remote workers."

Grade their prompt on a scale of 0-100 based on:
1. Clarity (Is the task clear?)
2. Target Audience (Did they mention remote workers?)
3. Context/Constraints (Did they specify length, tone, or format?)
4. Benefits (Did they ask to highlight features?)

Return a JSON object with:
- score (number, 0-100)
- feedback (array of strings, e.g., "✅ Good target audience", "❌ Missing format constraints")
- improvement_tip (string, a short tip to make it better)

Be generous but fair. If they mention "remote workers", give at least 25 points.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const result = JSON.parse(data.choices[0].message.content);
        res.status(200).json(result);

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Failed to evaluate prompt', details: error.message });
    }
}
