(function () {
    function getDataLayer() {
        if (!Array.isArray(window.dataLayer)) {
            window.dataLayer = [];
        }
        return window.dataLayer;
    }

    function emitAnalytics(eventName, payload = {}) {
        if (!eventName) return;
        const entry = { event: eventName, ts: Date.now(), ...payload };
        try {
            const handler = typeof window.analyticsEvent === 'function' ? window.analyticsEvent : null;
            if (handler && handler !== emitAnalytics) {
                handler(eventName, payload);
                return;
            }
            getDataLayer().push(entry);
        } catch (error) {
            console.warn('[analytics] Failed to push event', error);
        }
    }

    function getBasePrefix() {
        const path = window.location && window.location.pathname ? window.location.pathname : '';
        const segments = path.split('/').filter(Boolean);
        const depth = Math.max(0, segments.length - 1);
        return depth ? '../'.repeat(depth) : '';
    }

    function resolveHref(href) {
        if (!href) return href;
        if (/^(https?:)?\/\//i.test(href) || href.startsWith('#')) return href;
        return `${getBasePrefix()}${href}`;
    }

    const LANDING_PAGE = 'landing.html';

    const LESSON_SEQUENCE = [
        { id: 'lesson1', label: 'Lesson 1: Prompt Wizardry Warm-Up', path: 'lesson1/l1-p1-learn-intro.html' },
        { id: 'lesson2', label: 'Lesson 2: AI Literacy', path: 'lesson2/l2-p1-learn-intro.html' },
        { id: 'quiz1', label: 'Quiz 1: Warm-Up Review', path: 'quiz1.html' },
        { id: 'lesson3', label: 'Lesson 3: Content Creation', path: 'lesson3/l3-p1-learn-intro.html' },
        { id: 'lesson4', label: 'Lesson 4: Advanced Prompting', path: 'lesson4/l4-p1-learn-intro.html' },
        { id: 'lesson5', label: 'Lesson 5: AI Workflows', path: 'lesson5/l5-p1-learn-intro.html' },
        { id: 'lesson6', label: 'Lesson 6: Capstone', path: 'lesson6-capstone.html' },
        { id: 'lesson7-placeholder', label: 'Lesson 7 (Coming Soon)', path: '#' }
    ];
    const LESSON_REQUIREMENTS = {
        lesson2: 'lesson1',
        lesson3: 'quiz1',
        lesson4: 'lesson3',
        lesson5: 'lesson4',
        lesson6: 'lesson5',
        quiz1: 'lesson2'
    };
    const QUIZ_GATE_REQUIREMENTS = {
        quiz1: 75
    };

    const CUSTOM_NEXT = {
        lesson1: {
            href: 'lesson2/l2-p1-learn-intro.html',
            label: 'Next: Lesson 2 →'
        },
        quiz1: {
            href: 'lesson3/l3-p1-learn-intro.html',
            label: 'Next: Lesson 3 →'
        },
        lesson2: {
            href: 'quiz1.html',
            label: 'Next: Quiz 1 →'
        },
        lesson6: {
            href: 'certificate.html',
            label: 'View Certificate →'
        }
    };

    function getLessonById(lessonId) {
        return LESSON_SEQUENCE.find((lesson) => lesson.id === lessonId);
    }

    function findLessonIndex(lessonId) {
        return LESSON_SEQUENCE.findIndex((lesson) => lesson.id === lessonId);
    }

    function getAutoNextDestination(lessonId) {
        if (!lessonId) return null;
        const override = CUSTOM_NEXT[lessonId];
        if (override) {
            return {
                id: null,
                label: override.label || 'Next →',
                href: override.href
            };
        }

        const index = findLessonIndex(lessonId);
        if (index === -1) return null;
        const nextLesson = LESSON_SEQUENCE[index + 1];
        if (!nextLesson || nextLesson.id === 'lesson7-placeholder') return null;
        return {
            id: nextLesson.id,
            label: `Next: ${nextLesson.label} →`,
            href: nextLesson.path
        };
    }

    function resolveLessonDestination(targetId) {
        if (!targetId) return null;
        const lesson = getLessonById(targetId);
        if (!lesson || lesson.id === 'lesson7-placeholder') return null;
        return {
            id: lesson.id,
            label: `Go to ${lesson.label}`,
            href: lesson.path
        };
    }

    function initNextLessonButtons(currentLessonId) {
        const buttons = document.querySelectorAll('[data-next-lesson]');
        if (!buttons.length) return;

        buttons.forEach((button) => {
            const directive = button.dataset.nextLesson;
            let destination = null;

            if (!directive || directive === 'auto') {
                destination = getAutoNextDestination(currentLessonId);
            } else {
                destination = resolveLessonDestination(directive);
            }

            if (!destination || !destination.href) {
                button.disabled = true;
                button.classList.add('is-disabled');
                return;
            }

            const label = button.dataset.nextLabel || destination.label;
            if (label) {
                button.textContent = label;
            }

            button.addEventListener('click', () => {
                const targetHref = resolveHref(destination.href);
                emitAnalytics('next_lesson_click', { fromLesson: currentLessonId, target: destination.id || destination.href });
                window.location.href = targetHref;
            });
        });
    }

    function requirementMet(lessonId, api) {
        const requirement = LESSON_REQUIREMENTS[lessonId];
        if (!requirement) return true;
        if (!api) return false;
        if (requirement.startsWith('quiz')) {
            const neededScore = QUIZ_GATE_REQUIREMENTS[requirement] ?? 1;
            const actualScore = api.getQuizScore ? Number(api.getQuizScore(requirement)) || 0 : 0;
            return actualScore >= neededScore;
        }
        const status = api.getLessonStatus ? api.getLessonStatus(requirement) : 'not-started';
        return status === 'completed';
    }
    
    function guardLessonAccess(lessonId) {
        const api = window.AppProgress || window.ProgressTracker || null;
        if (!lessonId) return true;
        if (!api) return false;
        if (!requirementMet(lessonId, api)) {
            alert('Finish the previous mission before jumping ahead. Redirecting you back to the dashboard.');
            window.location.href = LANDING_PAGE;
            emitAnalytics('lesson_blocked', { lessonId, reason: 'prerequisite' });
            return false;
        }
        return true;
    }

    function setNavigationButtons(lessonId, containerSelector = '.footer-nav') {
        const index = findLessonIndex(lessonId);
        if (index === -1) return;

        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '';

        const mainBtn = createNavButton('Main Menu', LANDING_PAGE, 'btn-secondary');

        if (index > 0) {
            const prevLesson = LESSON_SEQUENCE[index - 1];
            const prevBtn = createNavButton(`← Previous`, prevLesson.path, 'btn-secondary');
            container.appendChild(prevBtn);
        }

        container.appendChild(mainBtn);

        const override = CUSTOM_NEXT[lessonId];
        if (override) {
            const overrideBtn = createNavButton(override.label || 'Next →', override.href, 'btn-primary');
            container.appendChild(overrideBtn);
            return;
        }

        if (index < LESSON_SEQUENCE.length - 2) {
            const nextLesson = LESSON_SEQUENCE[index + 1];
            const nextBtn = createNavButton(`Next →`, nextLesson.path, 'btn-primary');
            container.appendChild(nextBtn);
        }
    }

    function createNavButton(label, href, className) {
        const button = document.createElement('a');
        button.textContent = label;
        button.href = resolveHref(href);
        button.className = `btn ${className}`.trim();
        return button;
    }

    function setBreadcrumb(lessonId, containerSelector = '.breadcrumb') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const lessonIndex = findLessonIndex(lessonId);
        container.innerHTML = '';

        const homeLink = document.createElement('a');
        homeLink.href = LANDING_PAGE;
        homeLink.textContent = 'Home';
        container.appendChild(homeLink);

        if (lessonIndex >= 0) {
            const separator = document.createElement('span');
            separator.textContent = '/';
            separator.className = 'breadcrumb-separator';
            container.appendChild(separator);

            const currentLesson = LESSON_SEQUENCE[lessonIndex];
            const label = document.createElement('span');
            label.textContent = currentLesson.label;
            container.appendChild(label);
        }
    }

    function initModeToggle({
        defaultMode = 'presentation',
        gamePanelId = 'gameMode',
        presentationPanelId = 'presentationMode',
        gameButtonId = 'gameBtn',
        presentationButtonId = 'presentBtn'
    } = {}) {
        const gamePanel = document.getElementById(gamePanelId);
        const presentationPanel = document.getElementById(presentationPanelId);
        const gameBtn = document.getElementById(gameButtonId);
        const presentBtn = document.getElementById(presentationButtonId);
        let currentMode = null;

        function syncButtonState(targetBtn, isActive) {
            if (!targetBtn) return;
            targetBtn.classList.toggle('active', isActive);
            targetBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }

        function togglePanel(panel, shouldShow) {
            if (!panel) return;
            panel.classList.toggle('hidden', !shouldShow);
            panel.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        }

        function setMode(mode = defaultMode) {
            const normalizedMode = mode === 'game' ? 'game' : 'presentation';
            if (currentMode === normalizedMode) return;
            currentMode = normalizedMode;

            const showGame = normalizedMode === 'game';
            togglePanel(gamePanel, showGame);
            togglePanel(presentationPanel, !showGame);

            syncButtonState(gameBtn, showGame);
            syncButtonState(presentBtn, !showGame);
        }

        if (gameBtn) {
            gameBtn.addEventListener('click', () => setMode('game'));
            gameBtn.setAttribute('type', 'button');
            if (gamePanelId) gameBtn.setAttribute('aria-controls', gamePanelId);
            gameBtn.setAttribute('aria-pressed', 'false');
        }
        if (presentBtn) {
            presentBtn.addEventListener('click', () => setMode('presentation'));
            presentBtn.setAttribute('type', 'button');
            if (presentationPanelId) presentBtn.setAttribute('aria-controls', presentationPanelId);
            presentBtn.setAttribute('aria-pressed', 'false');
        }

        setMode(defaultMode);
        return { setMode };
    }

    function updateXPBar({
        xp = 0,
        xpToNext = 100,
        barId = 'xpBar',
        textId = 'xpText'
    } = {}) {
        const bar = document.getElementById(barId);
        const text = document.getElementById(textId);
        if (!bar) return;

        const percentage = Math.min(100, Math.round((xp / xpToNext) * 100));
        bar.style.width = `${percentage}%`;
        if (text) text.textContent = `${xp}/${xpToNext}`;
    }

    function scrollGameExperiencesToTop() {
        const lessonId = document.body?.dataset?.lessonId || '';
        const looksLikeGamePage =
            lessonId.includes('game') ||
            document.querySelector('.game-container') ||
            document.getElementById('gameMode');

        if (!looksLikeGamePage) return;

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
    }

    if (typeof window.analyticsEvent !== 'function') {
        window.analyticsEvent = emitAnalytics;
    }

    window.AILesson = {
        LESSON_SEQUENCE,
        initLessonNavigation: function (options = {}) {
            const { lessonId, breadcrumbSelector, footerSelector } = options;
            setBreadcrumb(lessonId, breadcrumbSelector);
            setNavigationButtons(lessonId, footerSelector);
        },
        getLessonById,
        getNextLessonDestination: getAutoNextDestination,
        initModeToggle,
        updateXPBar,
        findLessonIndex,
        trackEvent: emitAnalytics
    };

    document.addEventListener('DOMContentLoaded', () => {
        const lessonId = document.body?.dataset?.lessonId;
        if (!lessonId || !window.AILesson) return;
        if (!guardLessonAccess(lessonId)) {
            return;
        }
        const breadcrumbSelector = document.body.dataset.breadcrumbSelector || '.breadcrumb';
        const footerSelector = document.body.dataset.footerSelector || '.footer-nav';
        window.AILesson.initLessonNavigation({ lessonId, breadcrumbSelector, footerSelector });
        initNextLessonButtons(lessonId);
        scrollGameExperiencesToTop();

        const looksLikeSummary = Boolean(document.querySelector('[data-next-lesson]'));
        if (looksLikeSummary && window.ProgressTracker && typeof window.ProgressTracker.markLessonComplete === 'function') {
            window.ProgressTracker.markLessonComplete(lessonId);
            emitAnalytics('lesson_completed', { lessonId, source: 'summary-page' });
        }
    });
})();
