document.addEventListener('DOMContentLoaded', () => {
    const progressApi = window.AppProgress || window.ProgressTracker || null;

    const DASHBOARD_ITEMS = [
        {
            id: 'lesson1',
            type: 'lesson',
            title: 'Lesson 1 · Warm-Up',
            summary: 'Tone basics, probability radar, and three Prompt Wizardry mini-games.',
            path: 'lesson1-ai-intro.html'
        },
        {
            id: 'quiz1',
            type: 'quiz',
            title: 'Quiz 1 · Warm-Up Review',
            summary: 'Check your instincts before unlocking Lesson 2.',
            path: 'quiz1.html',
            requires: 'lesson1'
        },
        {
            id: 'lesson2',
            type: 'lesson',
            title: 'Lesson 2 · AI Literacy',
            summary: '32 machine pathologies, F.A.C.T.S. framework, and real disaster drills.',
            path: 'presentation.html',
            requires: 'quiz1'
        },
        {
            id: 'lesson3',
            type: 'lesson',
            title: 'Lesson 3 · Content Creation',
            summary: 'Ethical content systems, AI collaborator roles, and guardrails.',
            path: 'lesson3-content-creation.html',
            requires: 'lesson2'
        },
        {
            id: 'lesson4',
            type: 'lesson',
            title: 'Lesson 4 · Advanced Prompting',
            summary: 'Layered prompting blueprints for research, marketing, and ops.',
            path: 'lesson4-advanced-prompting.html',
            requires: 'lesson3'
        },
        {
            id: 'lesson5',
            type: 'lesson',
            title: 'Lesson 5 · AI Workflows',
            summary: 'Chain multiple models, automate reviews, and add human escalation.',
            path: 'lesson5-ai-workflows.html',
            requires: 'lesson4'
        },
        {
            id: 'lesson6',
            type: 'lesson',
            title: 'Lesson 6 · Capstone',
            summary: 'Ship your AI policy, lesson plan, or automation brief for certification.',
            path: 'lesson6-capstone.html',
            requires: 'lesson5'
        }
    ];

    const els = {
        lessonGrid: document.getElementById('lessonGrid'),
        progressFill: document.getElementById('homeProgressFill'),
        progressCopy: document.getElementById('homeProgressCopy'),
        lessonCount: document.getElementById('homeLessonCount'),
        xpTotal: document.getElementById('homeXpTotal'),
        quizScore: document.getElementById('homeQuizScore'),
        startButtons: document.querySelectorAll('[data-start-course]'),
        scrollButtons: document.querySelectorAll('[data-scroll-target]')
    };

    function getLessonStatus(id) {
        if (!progressApi) return 'not-started';
        return progressApi.getLessonStatus ? progressApi.getLessonStatus(id) : 'not-started';
    }

    function isLessonComplete(id) {
        if (!progressApi) return false;
        if (progressApi.isLessonComplete) return progressApi.isLessonComplete(id);
        return getLessonStatus(id) === 'completed';
    }

    function getQuizScore(id) {
        if (!progressApi || !progressApi.getQuizScore) return 0;
        return Number(progressApi.getQuizScore(id)) || 0;
    }

    function requirementMet(requirementId) {
        if (!requirementId) return true;
        if (requirementId.startsWith('quiz')) return getQuizScore(requirementId) > 0;
        return isLessonComplete(requirementId);
    }

    function getItemState(item) {
        const lessonStatus = item.type === 'quiz' ? (getQuizScore(item.id) > 0 ? 'completed' : 'not-started') : getLessonStatus(item.id);
        const completed = lessonStatus === 'completed';
        const locked = !requirementMet(item.requires);
        let modifier = '';
        let statusLabel = 'Not Started';

        if (locked) {
            modifier = 'locked';
            statusLabel = 'Locked';
        } else if (completed) {
            modifier = 'completed';
            statusLabel = 'Completed';
        } else if (lessonStatus === 'in-progress') {
            modifier = 'in-progress';
            statusLabel = 'In Progress';
        }

        const ctaLabel = locked ? 'Locked' : completed ? 'Review' : 'Start';
        return { locked, completed, modifier, statusLabel, ctaLabel };
    }

    function renderLessons() {
        if (!els.lessonGrid) return;
        const cards = DASHBOARD_ITEMS.map((item) => {
            const state = getItemState(item);
            return `
                <article class="lesson-card ${state.locked ? 'locked' : ''}">
                    <div class="status-pill${state.modifier ? ` ${state.modifier}` : ''}">${state.statusLabel}</div>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                    <button type="button" data-path="${item.path}" data-locked="${state.locked}">${state.ctaLabel}</button>
                </article>
            `;
        }).join('');
        els.lessonGrid.innerHTML = cards;
        els.lessonGrid.querySelectorAll('button').forEach((button) => {
            const locked = button.dataset.locked === 'true';
            if (locked) {
                button.disabled = true;
                return;
            }
            button.addEventListener('click', () => {
                window.location.href = button.dataset.path;
            });
        });
    }

    function updateStats() {
        const overview = progressApi && progressApi.getOverview ? progressApi.getOverview() : { xp: 0, completed: 0, total: DASHBOARD_ITEMS.filter((i) => i.type === 'lesson').length };
        const totalLessons = overview.total || DASHBOARD_ITEMS.filter((i) => i.type === 'lesson').length;
        const completionRate = totalLessons ? Math.round((overview.completed / totalLessons) * 100) : 0;
        if (els.progressFill) {
            els.progressFill.style.width = `${completionRate}%`;
        }
        if (els.progressCopy) {
            els.progressCopy.textContent = totalLessons
                ? `${overview.completed}/${totalLessons} lessons complete (${completionRate}%)`
                : 'Progress tracking unavailable.';
        }
        if (els.lessonCount) {
            els.lessonCount.textContent = `${overview.completed}/${totalLessons}`;
        }
        if (els.xpTotal) {
            els.xpTotal.textContent = `${overview.xp || 0} XP`;
        }
        if (els.quizScore) {
            const score = getQuizScore('quiz1');
            els.quizScore.textContent = score > 0 ? `${score}%` : 'Pending';
        }
    }

    function getNextAvailableItem() {
        for (const item of DASHBOARD_ITEMS) {
            const state = getItemState(item);
            if (!state.locked && !state.completed) {
                return item;
            }
        }
        return DASHBOARD_ITEMS[0];
    }

    function initHeroButtons() {
        const nextItem = getNextAvailableItem();
        els.startButtons.forEach((button) => {
            button.addEventListener('click', () => {
                window.location.href = nextItem.path;
            });
        });
        els.scrollButtons.forEach((button) => {
            const target = button.getAttribute('data-scroll-target');
            button.addEventListener('click', () => {
                if (target) {
                    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    renderLessons();
    updateStats();
    initHeroButtons();
});
