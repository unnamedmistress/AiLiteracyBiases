document.addEventListener('DOMContentLoaded', () => {
    const progressApi = window.AppProgress || window.ProgressTracker || null;
    const QUIZ_MIN_SCORES = {
        quiz1: 75
    };

    const DASHBOARD_ITEMS = [
        {
            id: 'lesson1',
            type: 'lesson',
            title: 'Lesson 1 · Warm-Up',
            summary: 'Tone basics, probability radar, and three Prompt Wizardry mini-games.',
            path: 'lesson1-ai-intro.html'
        },
        {
            id: 'lesson2',
            type: 'lesson',
            title: 'Lesson 2 · AI Literacy',
            summary: '32 machine pathologies, F.A.C.T.S. framework, and real disaster drills.',
            path: 'presentation.html',
            requires: 'lesson1'
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
            id: 'quiz1',
            type: 'quiz',
            title: 'Quiz 1 · Warm-Up Review',
            summary: 'Check your instincts before unlocking Lesson 4.',
            path: 'quiz1.html',
            requires: 'lesson3'
        },
        {
            id: 'lesson4',
            type: 'lesson',
            title: 'Lesson 4 · Advanced Prompting',
            summary: 'Layered prompting blueprints for research, marketing, and ops.',
            path: 'lesson4-advanced-prompting.html',
            requires: 'quiz1'
        },
        {
            id: 'lesson5',
            type: 'lesson',
            title: 'Lesson 5 · AI Workflows',
            summary: 'Chain multiple models, automate reviews, and add human escalation.',
            path: 'lesson5-ai-workflows.html',
            requires: 'lesson4',
            comingSoon: true
        },
        {
            id: 'lesson6',
            type: 'lesson',
            title: 'Lesson 6 · Capstone',
            summary: 'Ship your AI policy, lesson plan, or automation brief for certification.',
            path: 'lesson6-capstone.html',
            requires: 'lesson5',
            comingSoon: true
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
        scrollButtons: document.querySelectorAll('[data-scroll-target]'),
        resetBtn: document.getElementById('resetProgressBtn')
    };

    if (els.resetBtn) {
        els.resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                if (progressApi && progressApi.resetProgress) {
                    progressApi.resetProgress();
                } else {
                    localStorage.removeItem('aiLiteracyProgress_v1');
                }
                window.location.reload();
            }
        });
    }

    function getLessonStatus(id) {
        if (!progressApi) return 'not-started';
        
        // Special handling for Lesson 2 (Presentation OR Game)
        if (id === 'lesson2') {
            const status = progressApi.getLessonStatus ? progressApi.getLessonStatus(id) : 'not-started';
            if (status === 'completed') return 'completed';
            
            const gameStatus = progressApi.getLessonStatus ? progressApi.getLessonStatus('lesson2-game') : 'not-started';
            if (gameStatus === 'completed') return 'completed';
            
            if (status === 'in-progress' || gameStatus === 'in-progress') return 'in-progress';
            return 'not-started';
        }

        return progressApi.getLessonStatus ? progressApi.getLessonStatus(id) : 'not-started';
    }

    function isLessonComplete(id) {
        if (!progressApi) return false;

        // Special handling for Lesson 2
        if (id === 'lesson2') {
            if (progressApi.isLessonComplete && progressApi.isLessonComplete('lesson2')) return true;
            if (progressApi.isLessonComplete && progressApi.isLessonComplete('lesson2-game')) return true;
        }

        if (progressApi.isLessonComplete) return progressApi.isLessonComplete(id);
        return getLessonStatus(id) === 'completed';
    }

    function getQuizScore(id) {
        if (!progressApi || !progressApi.getQuizScore) return 0;
        return Number(progressApi.getQuizScore(id)) || 0;
    }

    function getQuizRequirement(quizId) {
        return QUIZ_MIN_SCORES[quizId] ?? 1;
    }

    function requirementMet(requirementId) {
        if (!requirementId) return true;
        if (requirementId.startsWith('quiz')) return getQuizScore(requirementId) >= getQuizRequirement(requirementId);
        return isLessonComplete(requirementId);
    }

    function getItemState(item) {
        const comingSoon = Boolean(item.comingSoon);
        let lessonStatus;
        if (item.type === 'quiz') {
            const score = getQuizScore(item.id);
            const minScore = getQuizRequirement(item.id);
            if (score >= minScore) {
                lessonStatus = 'completed';
            } else if (score > 0) {
                lessonStatus = 'in-progress';
            } else {
                lessonStatus = 'not-started';
            }
        } else {
            lessonStatus = getLessonStatus(item.id);
        }
        const completed = lessonStatus === 'completed';
        const locked = comingSoon || !requirementMet(item.requires);
        let modifier = '';
        let statusLabel = 'Not Started';

        if (locked) {
            modifier = comingSoon ? 'coming-soon' : 'locked';
            statusLabel = comingSoon ? 'Coming Soon' : 'Locked';
        } else if (completed) {
            modifier = 'completed';
            statusLabel = 'Completed';
        } else if (lessonStatus === 'in-progress') {
            modifier = 'in-progress';
            statusLabel = 'In Progress';
        }

        const ctaLabel = locked ? (comingSoon ? 'Coming Soon' : 'Locked') : completed ? 'Review' : 'Start';
        return { locked, completed, modifier, statusLabel, ctaLabel, comingSoon };
    }

    function getNextStartDestination() {
        for (const item of DASHBOARD_ITEMS) {
            const state = getItemState(item);
            if (!state.locked && !state.completed) {
                return item;
            }
        }
        return DASHBOARD_ITEMS[DASHBOARD_ITEMS.length - 1];
    }

    function getStartButtonLabel(destination) {
        if (!destination) return 'Start Course →';
        const firstItem = DASHBOARD_ITEMS[0];
        const firstState = getItemState(firstItem);
        const startingFresh = destination.id === firstItem.id && !firstState.completed;
        if (startingFresh) return 'Start Course →';
        return `Resume ${destination.title} →`;
    }

    function renderLessons() {
        if (!els.lessonGrid) return;
        const cards = DASHBOARD_ITEMS.map((item) => {
            const state = getItemState(item);
            return `
                <article class="lesson-card ${state.locked ? 'locked' : ''}"${state.comingSoon ? ' data-coming-soon="true"' : ''}>
                    <div class="status-pill${state.modifier ? ` ${state.modifier}` : ''}">${state.statusLabel}</div>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                    ${state.comingSoon ? '<p class="coming-soon-note">🚧 Launching soon · stay tuned</p>' : ''}
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

    function initHeroButtons() {
        const destination = getNextStartDestination();
        const startPath = destination?.path || 'lesson1-ai-intro.html';
        const ctaLabel = getStartButtonLabel(destination);
        els.startButtons.forEach((button) => {
            button.textContent = ctaLabel;
            button.setAttribute('aria-label', ctaLabel);
            button.addEventListener('click', () => {
                window.location.href = startPath;
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
