const MISSION_RUBRICS = {
    content: {
        name: 'Blog Post Factory',
        description: 'Topic Input → Research (GPT) → Draft (Claude) → Image (DALL·E) → Human Review → Publish',
        checkpoints: [
            'Topic intake or ideation gate',
            'Research assistant step using GPT or similar',
            'Drafting or writing pass using a second AI',
            'Image generation step (DALL·E / Midjourney)',
            'Human review / edit checkpoint',
            'Publishing or CMS output'
        ]
    },
    support: {
        name: 'Support Bot Workflow',
        description: 'Ticket Input → AI Classify → AI Sentiment → Route Logic → AI Reply → Email Output',
        checkpoints: [
            'Ticket ingestion layer',
            'Classification model or logic',
            'Sentiment or priority detection',
            'Routing or decision branch',
            'AI-generated reply or draft step',
            'Email / channel handoff'
        ]
    },
    data: {
        name: 'Data Insight Workflow',
        description: 'CSV Input → Clean Data (Code) → Analyze (AI) → Chart (AI) → Report Output',
        checkpoints: [
            'Raw data upload/ingest',
            'Cleaning / transformation step (code or tool)',
            'AI analysis / insight generation',
            'Charting or visualization pass',
            'Final report / export phase'
        ]
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { blueprint, mission } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('Missing OPENAI_API_KEY');
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    if (!blueprint || typeof blueprint !== 'string' || !blueprint.trim()) {
        return res.status(400).json({ error: 'Blueprint text is required' });
    }

    if (!mission || !MISSION_RUBRICS[mission]) {
        return res.status(400).json({ error: 'Unknown mission provided' });
    }

    const missionInfo = MISSION_RUBRICS[mission];

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
                        content: `You are an AI solutions architect who grades workflow blueprints.
The student is describing the "${missionInfo.name}" pipeline defined as: ${missionInfo.description}.

Evaluate their write-up against these checkpoints:
${missionInfo.checkpoints.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Scoring:
- Award up to 100 points. Each checkpoint should score ~16-20 points when clearly described.
- Mark a checkpoint as met only if the student clearly addresses it.
- Give concise feedback per checkpoint.

Return strict JSON:
{
  "score": number 0-100,
  "coverage": [
    { "requirement": "Ticket ingestion layer", "met": true/false, "comment": "short sentence" },
    ... include every checkpoint, in order
  ],
  "strengths": ["bullet"],
  "improvements": ["bullet"],
  "tip": "one-sentence summary"
}`
                    },
                    {
                        role: 'user',
                        content: blueprint
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
        const normalizedCoverage = missionInfo.checkpoints.map((checkpoint) => {
            const match = Array.isArray(parsed.coverage)
                ? parsed.coverage.find((item) => item.requirement === checkpoint)
                : null;
            return {
                requirement: checkpoint,
                met: Boolean(match?.met),
                comment: match?.comment || ''
            };
        });

        return res.status(200).json({
            score: Number(parsed.score) || 0,
            coverage: normalizedCoverage,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            tip: parsed.tip || ''
        });
    } catch (error) {
        console.error('evaluate-workflow error:', error);
        return res.status(500).json({ error: 'Failed to evaluate workflow blueprint', details: error.message });
    }
}
