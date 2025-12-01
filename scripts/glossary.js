const GLOSSARY_TERMS = [
    { term: 'AI', description: 'Any system that performs tasks requiring human-like intelligence such as perception, pattern recognition, or decision-making.' },
    { term: 'Machine Learning', description: 'Algorithms that improve through experience by finding statistical patterns in data.' },
    { term: 'LLM (Large Language Model)', description: 'A neural network trained on massive corpora to predict the next word or token in a sequence.' },
    { term: 'Token', description: 'A chunk of text (word fragment) that models read and predict. Tokens limit context windows and cost usage credits.' },
    { term: 'Bias', description: 'Systematic errors in AI outputs caused by skewed training data, flawed objectives, or human assumptions.' },
    { term: 'Hallucination', description: 'When an AI generates authoritative-sounding but fabricated information.' },
    { term: 'Prompt Injection', description: 'A malicious instruction hidden inside content that tries to override or hijack the model’s behavior.' },
    { term: 'Knowledge Cutoff', description: 'The most recent date of information a model was trained on (e.g., GPT-5 Oct 2025).' },
    { term: 'Fairness Audit', description: 'A structured review of model behavior across demographics to catch disparate outcomes before deployment.' }
];

document.addEventListener('DOMContentLoaded', () => {
    const gridEl = document.getElementById('glossaryGrid');
    const searchInput = document.getElementById('glossarySearch');

    function renderGlossary(filter = '') {
        const normalized = filter.toLowerCase();
        const terms = GLOSSARY_TERMS.filter(({ term, description }) => {
            return term.toLowerCase().includes(normalized) || description.toLowerCase().includes(normalized);
        });
        gridEl.innerHTML = terms.map(({ term, description }) => `
            <article class="glossary-card">
                <h3>${term}</h3>
                <p>${description}</p>
            </article>
        `).join('');
    }

    renderGlossary();
    searchInput.addEventListener('input', (event) => renderGlossary(event.target.value));
});
