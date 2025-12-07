(function () {
    const MAX_ATTEMPTS_DEFAULT = 3;
    const PASS_SCORE_DEFAULT = 70;

    const PAGE_CONFIG = {
        lesson3: {
            'l3-p1-learn-intro.html': {
                title: 'Practice: Responsible creation',
                prompt: 'Draft one guideline for responsible AI content and one mitigation step for a new series.',
                keywords: ['consent', 'disclosure', 'attribution', 'bias', 'misinformation'],
                must: ['consent', 'disclosure'],
                minWords: 30,
                xp: 10
            },
            'l3-p2-learn-briefs.html': {
                title: 'Practice: Tighten the brief',
                prompt: 'Rewrite a content brief with audience, tone, format, CTA, and constraints.',
                keywords: ['audience', 'tone', 'format', 'cta', 'constraint', 'deadline'],
                must: ['audience', 'constraint'],
                minWords: 35,
                xp: 12
            },
            'l3-p3-game-brief-diagnostics.html': {
                title: 'Practice: Diagnose a weak brief',
                prompt: 'List the top gaps you would flag in a vague brief and how to fix them.',
                keywords: ['gap', 'risk', 'missing', 'constraint', 'audience', 'measure'],
                must: ['gap', 'constraint'],
                minWords: 30,
                xp: 14
            },
            'l3-p4-learn-structure.html': {
                title: 'Practice: Outline the structure',
                prompt: 'Propose a structure with hook, 3 body sections, and a CTA for an explainer.',
                keywords: ['hook', 'sections', 'cta', 'transition', 'summary'],
                must: ['hook', 'cta'],
                minWords: 35,
                xp: 12
            },
            'l3-p5-game-structure.html': {
                title: 'Practice: Fix the flow',
                prompt: 'Rewrite a rough outline to add headings, transitions, and a clear CTA.',
                keywords: ['heading', 'transition', 'cta', 'order', 'evidence'],
                must: ['heading', 'cta'],
                minWords: 30,
                xp: 14
            },
            'l3-p6-learn-style.html': {
                title: 'Practice: Nail the style',
                prompt: 'Describe the voice, tone, and cadence for a short-form post plus 2 must-have phrases.',
                keywords: ['voice', 'tone', 'cadence', 'phrases', 'style'],
                must: ['voice', 'tone'],
                minWords: 30,
                xp: 12
            },
            'l3-p7-game-style.html': {
                title: 'Practice: Style transfer',
                prompt: 'Explain how you would rewrite a paragraph to match a given author style (lexicon, rhythm, imagery).',
                keywords: ['lexicon', 'rhythm', 'imagery', 'syntax', 'tone'],
                must: ['lexicon', 'rhythm'],
                minWords: 35,
                xp: 14
            },
            'l3-p8-learn-safety.html': {
                title: 'Practice: Safety checklist',
                prompt: 'List the safeguards you apply before publishing AI content (sources, consent, disclosure, red flags).',
                keywords: ['sources', 'consent', 'disclosure', 'safety', 'red flag', 'review'],
                must: ['sources', 'disclosure'],
                minWords: 35,
                xp: 12
            },
            'l3-p9-game-safety.html': {
                title: 'Practice: Escalation plan',
                prompt: 'Draft an escalation path for risky content: detection, block/hold, human review, and logging.',
                keywords: ['detection', 'block', 'review', 'escalation', 'logging', 'appeal'],
                must: ['detection', 'review'],
                minWords: 35,
                xp: 14
            },
            'l3-p10-summary.html': {
                title: 'Practice: Full content plan',
                prompt: 'Summarize how you would brief, structure, style, and safety-check a new content series.',
                keywords: ['brief', 'structure', 'style', 'safety', 'review'],
                must: ['brief', 'safety'],
                minWords: 40,
                xp: 15
            }
        },
        lesson4: {
            'l4-p1-learn-intro.html': {
                title: 'Practice: Prompt intent',
                prompt: 'Write a prompt that states intent, constraints, and the desired output format.',
                keywords: ['intent', 'constraints', 'format', 'tone', 'audience'],
                must: ['intent', 'format'],
                minWords: 30,
                xp: 10
            },
            'l4-p2-learn-fewshot.html': {
                title: 'Practice: Few-shot setup',
                prompt: 'Draft a few-shot prompt with 2 examples, clear separators, and an instruction for the next turn.',
                keywords: ['examples', 'separator', 'instruction', 'format', 'consistency'],
                must: ['examples', 'separator'],
                minWords: 35,
                xp: 12
            },
            'l4-p3-game-fewshot.html': {
                title: 'Practice: Diagnose few-shot',
                prompt: 'Explain how you would fix a weak few-shot prompt (coverage, edge cases, separators).',
                keywords: ['coverage', 'edge', 'separator', 'consistency', 'target'],
                must: ['coverage', 'separator'],
                minWords: 30,
                xp: 14
            },
            'l4-p4-learn-cot.html': {
                title: 'Practice: Chain-of-thought',
                prompt: 'Write instructions that force step-by-step reasoning, checks, and a concise final answer.',
                keywords: ['step', 'reasoning', 'check', 'verify', 'concise'],
                must: ['step', 'reasoning'],
                minWords: 35,
                xp: 12
            },
            'l4-p5-game-cot.html': {
                title: 'Practice: Debug reasoning',
                prompt: 'Describe how you would spot and correct reasoning errors in a model answer.',
                keywords: ['assumption', 'step', 'evidence', 'correction', 'confidence'],
                must: ['assumption', 'correction'],
                minWords: 30,
                xp: 14
            },
            'l4-p6-learn-tools.html': {
                title: 'Practice: Tool call prompt',
                prompt: 'Draft a tool-using prompt with inputs, required params, expected outputs, and failure handling.',
                keywords: ['tool', 'input', 'output', 'parameter', 'fallback', 'validation'],
                must: ['input', 'output'],
                minWords: 35,
                xp: 12
            },
            'l4-p7-game-tools.html': {
                title: 'Practice: Tooling plan',
                prompt: 'Explain how you would validate inputs, handle timeouts, and retry a tool call safely.',
                keywords: ['validate', 'timeout', 'retry', 'fallback', 'rate'],
                must: ['validate', 'retry'],
                minWords: 30,
                xp: 14
            },
            'l4-p8-learn-rag.html': {
                title: 'Practice: RAG prompt',
                prompt: 'Write a RAG prompt that cites sources, handles missing answers, and formats responses.',
                keywords: ['retrieval', 'cite', 'source', 'missing', 'format'],
                must: ['cite', 'missing'],
                minWords: 35,
                xp: 12
            },
            'l4-p9-game-rag.html': {
                title: 'Practice: Fix RAG issues',
                prompt: 'Describe how you would improve grounding: chunking, re-ranking, and citation requirements.',
                keywords: ['chunk', 'rank', 'ground', 'citation', 'freshness'],
                must: ['citation', 'rank'],
                minWords: 30,
                xp: 14
            },
            'l4-p10-learn-safety.html': {
                title: 'Practice: Safety prompt',
                prompt: 'Draft instructions that refuse unsafe requests, follow policy, and log escalations.',
                keywords: ['refuse', 'unsafe', 'policy', 'escalation', 'log'],
                must: ['refuse', 'policy'],
                minWords: 30,
                xp: 12
            },
            'l4-p11-game-safety.html': {
                title: 'Practice: Enforce guardrails',
                prompt: 'Explain how you would block, rate-limit, and audit an unsafe prompt scenario.',
                keywords: ['block', 'rate', 'audit', 'appeal', 'monitor'],
                must: ['block', 'audit'],
                minWords: 30,
                xp: 14
            },
            'l4-p12-summary.html': {
                title: 'Practice: Prompt playbook',
                prompt: 'Summarize how you combine few-shot, CoT, tools, RAG, and safety in one prompt.',
                keywords: ['few-shot', 'chain', 'tool', 'rag', 'safety'],
                must: ['few-shot', 'tool', 'rag'],
                minWords: 40,
                xp: 15
            }
        }
    };

    function getPageKey() {
        const path = window.location && window.location.pathname ? window.location.pathname : '';
        const segments = path.split('/').filter(Boolean);
        return segments.pop() || '';
    }

    function buildUI(config) {
        const host = document.querySelector('.lesson-shell') || document.querySelector('.container');
        if (!host) return null;

        const section = document.createElement('section');
        section.className = 'section chatbox-section';

        const title = document.createElement('h2');
        title.textContent = config.title || 'Practice chat';
        section.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.className = 'section-subtitle';
        subtitle.textContent = 'Try up to 3 attempts. We grade your prompt quality right here—no external tools needed.';
        section.appendChild(subtitle);

        const card = document.createElement('div');
        card.className = 'chatbox-card';

        const prompt = document.createElement('div');
        prompt.className = 'chatbox-prompt';
        prompt.textContent = config.prompt || 'Write a practice prompt for this topic.';
        card.appendChild(prompt);

        const controls = document.createElement('div');
        controls.className = 'chatbox-controls';

        const textarea = document.createElement('textarea');
        textarea.className = 'chatbox-input';
        textarea.rows = 4;
        textarea.placeholder = 'Type your prompt here...';

        const meta = document.createElement('div');
        meta.className = 'chatbox-meta';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary chatbox-submit';
        button.textContent = 'Submit prompt';

        controls.appendChild(textarea);
        controls.appendChild(button);
        controls.appendChild(meta);

        const feedback = document.createElement('div');
        feedback.className = 'chatbox-feedback';

        card.appendChild(controls);
        card.appendChild(feedback);
        section.appendChild(card);

        const marker = document.querySelector('.progress-indicator');
        if (marker && marker.parentNode) {
            marker.parentNode.insertBefore(section, marker);
        } else {
            host.appendChild(section);
        }

        return { section, textarea, button, feedback, meta };
    }

    function gradeResponse(text, config) {
        const clean = String(text || '').trim();
        const lower = clean.toLowerCase();
        const words = clean ? clean.split(/\s+/).length : 0;

        const required = Array.isArray(config.must) ? config.must : [];
        const optional = Array.isArray(config.keywords) ? config.keywords : [];

        let reqHits = 0;
        const reqMissing = [];
        required.forEach((kw) => {
            const normalized = String(kw || '').toLowerCase();
            if (normalized && lower.includes(normalized)) {
                reqHits += 1;
            } else if (normalized) {
                reqMissing.push(normalized);
            }
        });

        let optHits = 0;
        const optMissing = [];
        optional.forEach((kw) => {
            const normalized = String(kw || '').toLowerCase();
            if (normalized && lower.includes(normalized)) {
                optHits += 1;
            } else if (normalized) {
                optMissing.push(normalized);
            }
        });

        const reqScore = required.length ? Math.round((reqHits / required.length) * 100) : 100;
        const optScore = optional.length ? Math.round((optHits / optional.length) * 100) : 100;
        const lengthScore = words >= (config.minWords || 20) ? 100 : Math.round((words / (config.minWords || 20)) * 100);

        const rawScore = Math.round((reqScore * 0.5) + (optScore * 0.3) + (lengthScore * 0.2));
        const score = Math.max(0, Math.min(100, rawScore));
        const passScore = config.passScore || PASS_SCORE_DEFAULT;
        const passed = reqMissing.length === 0 && score >= passScore;

        const feedbackLines = [];
        feedbackLines.push(`Score: ${score}/100`);
        feedbackLines.push(`Must-haves: ${reqHits}/${required.length || 0}${reqMissing.length ? ` (missing: ${reqMissing.slice(0, 2).join(', ')})` : ''}`);
        feedbackLines.push(`Supporting details: ${optHits}/${optional.length || 0}${optMissing.length ? ` (try: ${optMissing.slice(0, 2).join(', ')})` : ''}`);
        feedbackLines.push(words >= (config.minWords || 20)
            ? 'Length: ✔️ meets suggested detail'
            : `Length: add ~${Math.max(0, (config.minWords || 20) - words)} more words for clarity`);

        return { score, passed, feedback: feedbackLines.join(' • ') };
    }

    function initChatbox(config) {
        const ui = buildUI(config);
        if (!ui) return;

        const attemptsMax = config.attempts || MAX_ATTEMPTS_DEFAULT;
        let attemptsUsed = 0;
        let awarded = false;
        const xpLabel = Number(config.xp || 0) > 0 ? ` • Worth ${config.xp} XP` : '';

        function updateMeta() {
            ui.meta.textContent = `Attempts left: ${Math.max(0, attemptsMax - attemptsUsed)}${xpLabel}`;
            if (attemptsUsed >= attemptsMax) {
                ui.button.disabled = true;
                ui.button.classList.add('is-disabled');
                ui.meta.textContent += ' • Limit reached';
            }
        }

        function showFeedback(text) {
            ui.feedback.textContent = text;
        }

        function maybeAward(score) {
            if (awarded) return;
            const xp = Number(config.xp || 0);
            if (score >= (config.passScore || PASS_SCORE_DEFAULT) && xp > 0 && typeof window.updateXP === 'function') {
                window.updateXP(xp, { source: 'chat-practice', lessonId: document.body?.dataset?.lessonId || null });
                awarded = true;
                if (window.ProgressTracker && typeof window.ProgressTracker.setCheckpoint === 'function') {
                    const lessonId = document.body?.dataset?.lessonId || null;
                    const pageKey = getPageKey();
                    if (lessonId && pageKey) {
                        window.ProgressTracker.setCheckpoint(lessonId, pageKey, true);
                    }
                }
            }
        }

        ui.button.addEventListener('click', () => {
            if (attemptsUsed >= attemptsMax) return;
            const text = ui.textarea.value;
            const result = gradeResponse(text, config);
            attemptsUsed += 1;
            updateMeta();
            showFeedback(result.feedback + (result.passed ? ' • Looks solid—nice work.' : ' • Add missing points and try again.'));
            maybeAward(result.score);
        });

        updateMeta();
    }

    function bootstrap() {
        const lessonId = document.body?.dataset?.lessonId;
        if (!lessonId || !(lessonId === 'lesson3' || lessonId === 'lesson4')) return;
        const pageKey = getPageKey();
        const config = PAGE_CONFIG[lessonId]?.[pageKey];
        if (!config) return;
        initChatbox(config);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
