document.addEventListener('DOMContentLoaded', () => {
    const progressApi = window.AppProgress || window.ProgressTracker || null;
    const QUIZ_MIN_SCORES = {
        quiz1: 75
    };
    const MODE_STORAGE_KEY = 'aiProfessionalMode_v1';

    const DASHBOARD_ITEMS = [
        {
            id: 'lesson1',
            type: 'lesson',
            title: 'Lesson 1 · Warm-Up',
            summary: 'Tone basics, probability radar, and three Prompt Wizardry mini-games.',
            path: 'lesson1/l1-p1-learn-intro.html',
            icon: '⚡️',
            time: '8 min'
        },
        {
            id: 'lesson2',
            type: 'lesson',
            title: 'Lesson 2 · AI Literacy',
            summary: '32 machine pathologies, F.A.C.T.S. framework, and real disaster drills.',
            path: 'lesson2/l2-p1-learn-intro.html',
            requires: 'lesson1',
            icon: '🧭',
            time: '25 min'
        },
        {
            id: 'quiz1',
            type: 'quiz',
            title: 'Quiz 1 · Warm-Up Review',
            summary: 'Check your instincts before unlocking Lesson 3.',
            path: 'quiz1.html',
            requires: 'lesson2',
            icon: '🎯',
            time: '5 min'
        },
        {
            id: 'lesson3',
            type: 'lesson',
            title: 'Lesson 3 · Content Creation',
            summary: 'Ethical content systems, AI collaborator roles, and guardrails.',
            path: 'lesson3/l3-p1-learn-intro.html',
            requires: 'quiz1',
            icon: '🎨',
            time: '18 min'
        },
        {
            id: 'lesson4',
            type: 'lesson',
            title: 'Lesson 4 · Advanced Prompting',
            summary: 'Layered prompting blueprints for research, marketing, and ops.',
            path: 'lesson4/l4-p1-learn-intro.html',
            requires: 'lesson3',
            icon: '🔮',
            time: '22 min'
        },
        {
            id: 'lesson5',
            type: 'lesson',
            title: 'Lesson 5 · AI Workflows',
            summary: 'Chain multiple models, automate reviews, and add human escalation.',
            path: 'lesson5/l5-p1-learn-intro.html',
            requires: 'lesson4',
            icon: '🌐',
            time: '20 min'
        },
        {
            id: 'lesson6',
            type: 'lesson',
            title: 'Lesson 6 · Capstone',
            summary: 'Ship your AI policy, lesson plan, or automation brief for certification.',
            path: 'lesson6-capstone.html',
            requires: 'lesson5',
            icon: '🎓',
            time: '30 min'
        }
    ];
    const DEFAULT_TOTAL_LESSONS = DASHBOARD_ITEMS.filter((item) => item.type === 'lesson').length;

    const els = {
        lessonGrid: document.getElementById('lessonGrid'),
        progressFill: document.getElementById('homeProgressFill'),
        progressCopy: document.getElementById('homeProgressCopy'),
        lessonCount: document.getElementById('homeLessonCount'),
        xpTotal: document.getElementById('homeXpTotal'),
        quizStatus: document.getElementById('homeQuizStatus'),
        quizNote: document.getElementById('homeQuizNote'),
        nextLesson: document.getElementById('homeNextLesson'),
        startButtons: document.querySelectorAll('[data-start-course]'),
        scrollButtons: document.querySelectorAll('[data-scroll-target]'),
        resetBtn: document.getElementById('resetProgressBtn'),
        resetWarning: document.getElementById('resetWarning'),
        modeButtons: document.querySelectorAll('[data-mode-choice]'),
        modeDescription: document.getElementById('modeToggleDescription')
    };

    const RESET_CONFIRM_WINDOW = 8000;
    let resetConfirmTimer = null;
    let awaitingResetConfirm = false;
    let professionalModeEnabled = false;

    function readProfessionalModePreference() {
        return localStorage.getItem(MODE_STORAGE_KEY) === 'professional';
    }

    function persistProfessionalModePreference(enabled) {
        try {
            localStorage.setItem(MODE_STORAGE_KEY, enabled ? 'professional' : 'learner');
        } catch (error) {
            console.warn('[home] Unable to persist mode preference.', error);
        }
    }

    function broadcastProfessionalMode(enabled) {
        const root = document.documentElement;
        if (root) {
            root.classList.toggle('professional-mode', Boolean(enabled));
        }
        const body = document.body;
        if (body) {
            body.classList.toggle('professional-mode', Boolean(enabled));
        }
        window.dispatchEvent(new CustomEvent('professionalmodechange', { detail: { enabled: Boolean(enabled) } }));
    }

    function updateModeControlsUI(enabled) {
        if (els.modeButtons && els.modeButtons.length) {
            els.modeButtons.forEach((button) => {
                const wantsProfessional = button.dataset.modeChoice === 'professional';
                button.setAttribute('aria-pressed', wantsProfessional === enabled ? 'true' : 'false');
            });
        }
        if (els.modeDescription) {
            els.modeDescription.textContent = enabled
                ? 'Professional Mode strips XP, streaks, and badges to spotlight lesson progress only.'
                : 'Learner Mode keeps XP, badges, and quests visible for extra motivation.';
        }
    }

    function setProfessionalMode(enabled) {
        professionalModeEnabled = Boolean(enabled);
        persistProfessionalModePreference(professionalModeEnabled);
        broadcastProfessionalMode(professionalModeEnabled);
        updateModeControlsUI(professionalModeEnabled);
    }

    function initModePreference() {
        professionalModeEnabled = readProfessionalModePreference();
        broadcastProfessionalMode(professionalModeEnabled);
        updateModeControlsUI(professionalModeEnabled);
        if (els.modeButtons && els.modeButtons.length) {
            els.modeButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const wantsProfessional = button.dataset.modeChoice === 'professional';
                    if (professionalModeEnabled === wantsProfessional) {
                        return;
                    }
                    setProfessionalMode(wantsProfessional);
                });
            });
        }
    }

    function performProgressReset() {
        if (progressApi && progressApi.resetProgress) {
            progressApi.resetProgress();
        } else if (progressApi && progressApi.reset) {
            progressApi.reset();
        } else {
            localStorage.removeItem('aiLiteracyProgress_v1');
        }
        window.location.reload();
    }

    if (els.resetBtn) {
        const defaultLabel = els.resetBtn.textContent || 'Reset Progress';
        els.resetBtn.addEventListener('click', () => {
            if (!awaitingResetConfirm) {
                awaitingResetConfirm = true;
                els.resetBtn.textContent = 'Confirm Reset';
                showResetWarning('This wipes all XP and lesson unlocks. Click "Confirm Reset" within 8 seconds to continue.');
                clearTimeout(resetConfirmTimer);
                resetConfirmTimer = setTimeout(() => {
                    awaitingResetConfirm = false;
                    els.resetBtn.textContent = defaultLabel;
                    hideResetWarning();
                }, RESET_CONFIRM_WINDOW);
                return;
            }

            awaitingResetConfirm = false;
            clearTimeout(resetConfirmTimer);
            els.resetBtn.textContent = defaultLabel;
            hideResetWarning();
            performProgressReset();
        });
    }

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
            const ariaLabel = state.locked
                ? `${state.statusLabel} · ${item.title}`
                : `${state.ctaLabel} ${item.title}`;
            return `
                <article class="lesson-card ${state.locked ? 'locked' : ''}"${state.comingSoon ? ' data-coming-soon="true"' : ''}>
                    <div class="lesson-header">
                        <span class="lesson-icon" aria-hidden="true">${item.icon || '📘'}</span>
                        <div class="lesson-titles">
                            <div class="status-pill${state.modifier ? ` ${state.modifier}` : ''}">${state.statusLabel}</div>
                            <h3>${item.title}</h3>
                        </div>
                    </div>
                    <p>${item.summary}</p>
                    <div class="lesson-meta">
                        <span class="time-estimate">⏱ ${item.time || '10 min'}</span>
                        ${state.comingSoon ? '<span class="coming-soon-note">🚧 Launching soon · stay tuned</span>' : ''}
                    </div>
                    <button type="button" data-path="${item.path}" data-locked="${state.locked}" aria-label="${ariaLabel}">${state.ctaLabel}</button>
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
        const overview = getOverviewSnapshot();
        const totalLessons = overview.total || DEFAULT_TOTAL_LESSONS;
        const completionRate = totalLessons ? Math.round((overview.completed / totalLessons) * 100) : 0;
        if (els.progressFill) {
            els.progressFill.style.width = `${completionRate}%`;
        }
        if (els.progressCopy) {
            els.progressCopy.textContent = overview.corrected
                ? 'Progress data was reset to keep stats accurate. Resume when ready.'
                : totalLessons
                    ? `${overview.completed}/${totalLessons} lessons complete (${completionRate}%)`
                    : 'Progress tracking unavailable.';
        }
        if (els.lessonCount) {
            els.lessonCount.textContent = `${overview.completed}/${totalLessons}`;
        }
        if (els.xpTotal) {
            els.xpTotal.textContent = `${overview.xp || 0} XP`;
        }
        if (overview.corrected) {
            showResetWarning('Progress numbers looked out of sync. Use Reset Progress to start from a clean slate.');
        } else {
            hideResetWarning();
        }
        updateNextLessonCopy();
        updateQuizSummary();
    }

    function updateQuizSummary() {
        if (!els.quizStatus || !els.quizNote) return;
        const quizId = 'quiz1';
        const score = getQuizScore(quizId);
        const requirement = getQuizRequirement(quizId);
        if (score >= requirement) {
            els.quizStatus.textContent = 'Passed';
            els.quizNote.textContent = `Score ${score}% · Lesson 3 unlocked.`;
            return;
        }
        if (score > 0) {
            els.quizStatus.textContent = 'Retry Needed';
            els.quizNote.textContent = `Score ${score}% · Need ${requirement}% to unlock Lesson 3.`;
            return;
        }
        els.quizStatus.textContent = 'Pending';
        els.quizNote.textContent = `Score ${requirement}% or higher to unlock Lesson 3.`;
    }

    function initHeroButtons() {
        const destination = getNextStartDestination();
        const startPath = destination?.path || 'lesson1/l1-p1-learn-intro.html';
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

    function updateNextLessonCopy() {
        if (!els.nextLesson) return;
        const destination = getNextStartDestination();
        if (!destination) {
            els.nextLesson.textContent = 'All missions complete — review any lesson anytime.';
            return;
        }
        const state = getItemState(destination);
        if (state.completed) {
            els.nextLesson.textContent = 'All missions complete — review any lesson anytime.';
            return;
        }
        els.nextLesson.textContent = `Next: ${destination.title}`;
    }

    initModePreference();
    renderLessons();
    updateStats();
    initHeroButtons();

    function getOverviewSnapshot() {
        const raw = progressApi && progressApi.getOverview ? progressApi.getOverview() : null;
        return normalizeOverview(raw);
    }

    function normalizeOverview(raw = {}) {
        const total = Number(raw.total) || DEFAULT_TOTAL_LESSONS;
        const completed = Math.min(total, Math.max(0, Number(raw.completed) || 0));
        const xp = Math.max(0, Number(raw.xp) || 0);
        const corrected = completed === 0 && xp > 0;
        return {
            xp: corrected ? 0 : xp,
            completed,
            total,
            corrected
        };
    }

    function showResetWarning(message) {
        if (!els.resetWarning) return;
        els.resetWarning.textContent = message;
        els.resetWarning.classList.remove('hidden');
    }

    function hideResetWarning() {
        if (!els.resetWarning) return;
        els.resetWarning.textContent = '';
        els.resetWarning.classList.add('hidden');
    }
});
