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

    let modalHost = null;
    let toastHost = null;
    function hideModal() {
        if (!modalHost) return;
        modalHost.classList.remove('is-visible');
    }

    function ensureModalHost() {
        if (modalHost) return modalHost;
        modalHost = document.createElement('div');
        modalHost.className = 'ui-modal';
        modalHost.innerHTML = `
            <div class="ui-modal__backdrop" data-modal-close="true"></div>
            <div class="ui-modal__card" role="dialog" aria-modal="true" aria-labelledby="uiModalTitle" aria-describedby="uiModalBody">
                <button class="ui-modal__close" type="button" data-modal-close="true" aria-label="Close">×</button>
                <h3 class="ui-modal__title" id="uiModalTitle"></h3>
                <p class="ui-modal__body" id="uiModalBody"></p>
                <div class="ui-modal__actions">
                    <button class="btn btn-secondary ui-modal__default" type="button" data-modal-close="true">Got it</button>
                    <a class="btn btn-primary ui-modal__action" role="button" href="#">Go</a>
                </div>
            </div>
        `;
        document.body.appendChild(modalHost);
        modalHost.querySelectorAll('[data-modal-close]').forEach((el) => {
            el.addEventListener('click', hideModal);
        });
        const backdrop = modalHost.querySelector('.ui-modal__backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', hideModal);
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') hideModal();
        });
        return modalHost;
    }

    function showModal({ title = 'Heads up', message = '', actionLabel = 'Go', actionHref = null } = {}) {
        const host = ensureModalHost();
        const titleEl = host.querySelector('.ui-modal__title');
        const bodyEl = host.querySelector('.ui-modal__body');
        const actionEl = host.querySelector('.ui-modal__action');
        const defaultEl = host.querySelector('.ui-modal__default');

        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.textContent = message;

        if (actionEl) {
            if (actionHref) {
                actionEl.href = resolveHref(actionHref);
                actionEl.textContent = actionLabel || 'Go';
                actionEl.style.display = 'inline-flex';
            } else {
                actionEl.href = '#';
                actionEl.style.display = 'none';
            }
        }
        if (defaultEl) {
            defaultEl.textContent = actionHref ? 'Stay here' : actionLabel || 'Got it';
        }

        host.classList.add('is-visible');
        requestAnimationFrame(() => {
            if (defaultEl && typeof defaultEl.focus === 'function') {
                defaultEl.focus();
            }
        });
    }

    function ensureToastHost() {
        if (toastHost) return toastHost;
        toastHost = document.createElement('div');
        toastHost.className = 'ui-toast-stack';
        document.body.appendChild(toastHost);
        return toastHost;
    }

    function showToast(message, { duration = 3200 } = {}) {
        if (!message) return;
        const host = ensureToastHost();
        const item = document.createElement('div');
        item.className = 'ui-toast';
        item.textContent = message;
        host.appendChild(item);
        requestAnimationFrame(() => item.classList.add('is-visible'));
        const hide = () => {
            item.classList.remove('is-visible');
            setTimeout(() => item.remove(), 300);
        };
        const timer = setTimeout(hide, duration);
        item.addEventListener('click', () => {
            clearTimeout(timer);
            hide();
        });
    }

    function ensureRewardsScript() {
        if (window.Rewards && typeof window.Rewards.showReward === 'function') return;
        const existing = document.querySelector('script[data-rewards]');
        if (existing) return;
        const script = document.createElement('script');
        script.src = resolveHref('scripts/rewards.js');
        script.defer = true;
        script.dataset.rewards = 'true';
        document.head.appendChild(script);
    }

    function ensurePracticeChat(lessonId) {
        if (!(lessonId === 'lesson3' || lessonId === 'lesson4')) return;
        if (document.querySelector('script[data-chatbox]')) return;
        const script = document.createElement('script');
        script.src = resolveHref('scripts/chatbox.js');
        script.defer = true;
        script.dataset.chatbox = 'true';
        document.head.appendChild(script);
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

    const PAGE_LABELS = {
        'lesson1/l1-p1-learn-intro.html': 'Next: Play Prediction Game',
        'lesson1/l1-p2-game-prediction.html': 'Next: Tone Lesson',
        'lesson1/l1-p3-learn-tone.html': 'Next: Voice Game',
        'lesson1/l1-p4-game-voice.html': 'Next: Tone Game',
        'lesson1/l1-p5-game-tone.html': 'Next: Lesson 1 Summary',
        'lesson1/l1-p6-summary.html': 'Next: Lesson 2 Intro',

        'lesson2/l2-p1-learn-intro.html': 'Next: Hallucination Lesson',
        'lesson2/l2-p2-learn-hallucinations.html': 'Next: Hallucination Game',
        'lesson2/l2-p3-game-hallucinations.html': 'Next: Confidence Lesson',
        'lesson2/l2-p4-learn-confidence.html': 'Next: Confidence Game',
        'lesson2/l2-p5-game-confidence.html': 'Next: Values Lesson',
        'lesson2/l2-p6-learn-values.html': 'Next: Values Game',
        'lesson2/l2-p7-game-values.html': 'Next: Memory Lesson',
        'lesson2/l2-p8-learn-memory.html': 'Next: Memory Game',
        'lesson2/l2-p9-game-memory.html': 'Next: Facts Lesson',
        'lesson2/l2-p10-learn-facts.html': 'Next: Disasters Game',
        'lesson2/l2-p11-game-disasters.html': 'Next: Lesson 2 Summary',
        'lesson2/l2-p12-summary.html': 'Next: Quiz 1',

        'quiz1.html': 'Next: Lesson 3 Intro'
    };

    const PAGE_ORDER = {
        lesson1: [
            'lesson1/l1-p1-learn-intro.html',
            'lesson1/l1-p2-game-prediction.html',
            'lesson1/l1-p3-learn-tone.html',
            'lesson1/l1-p4-game-voice.html',
            'lesson1/l1-p5-game-tone.html',
            'lesson1/l1-p6-summary.html'
        ],
        lesson2: [
            'lesson2/l2-p1-learn-intro.html',
            'lesson2/l2-p2-learn-hallucinations.html',
            'lesson2/l2-p3-game-hallucinations.html',
            'lesson2/l2-p4-learn-confidence.html',
            'lesson2/l2-p5-game-confidence.html',
            'lesson2/l2-p6-learn-values.html',
            'lesson2/l2-p7-game-values.html',
            'lesson2/l2-p8-learn-memory.html',
            'lesson2/l2-p9-game-memory.html',
            'lesson2/l2-p10-learn-facts.html',
            'lesson2/l2-p11-game-disasters.html',
            'lesson2/l2-p12-summary.html'
        ],
        lesson3: [
            'lesson3/l3-p1-learn-intro.html',
            'lesson3/l3-p2-learn-briefs.html',
            'lesson3/l3-p3-game-brief-diagnostics.html',
            'lesson3/l3-p4-learn-structure.html',
            'lesson3/l3-p5-game-structure.html',
            'lesson3/l3-p6-learn-style.html',
            'lesson3/l3-p7-game-style.html',
            'lesson3/l3-p8-learn-safety.html',
            'lesson3/l3-p9-game-safety.html',
            'lesson3/l3-p10-summary.html'
        ],
        lesson4: [
            'lesson4/l4-p1-learn-intro.html',
            'lesson4/l4-p2-learn-fewshot.html',
            'lesson4/l4-p3-game-fewshot.html',
            'lesson4/l4-p4-learn-cot.html',
            'lesson4/l4-p5-game-cot.html',
            'lesson4/l4-p6-learn-tools.html',
            'lesson4/l4-p7-game-tools.html',
            'lesson4/l4-p8-learn-rag.html',
            'lesson4/l4-p9-game-rag.html',
            'lesson4/l4-p10-learn-safety.html',
            'lesson4/l4-p11-game-safety.html',
            'lesson4/l4-p12-summary.html'
        ],
        lesson5: [
            'lesson5/l5-p1-learn-intro.html',
            'lesson5/l5-p2-learn-patterns.html',
            'lesson5/l5-p3-game-builder.html',
            'lesson5/l5-p4-learn-bottlenecks.html',
            'lesson5/l5-p5-game-debug.html',
            'lesson5/l5-p6-learn-automation.html',
            'lesson5/l5-p7-game-automation.html',
            'lesson5/l5-p8-learn-guardrails.html',
            'lesson5/l5-p9-game-scenario.html',
            'lesson5/l5-p10-summary.html'
        ]
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

    function initAnswerFeedback() {
        const buttons = Array.from(document.querySelectorAll('[data-answer]'));
        if (!buttons.length) return;
        buttons.forEach((btn) => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            const explanation = btn.dataset.explanation || '';
            const correct = btn.dataset.correct === 'true' || btn.dataset.answer === 'correct';
            btn.addEventListener('click', () => applyFeedback(btn, correct, explanation));
            btn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    applyFeedback(btn, correct, explanation);
                }
            });
        });
    }

    function applyFeedback(clickedBtn, isCorrect, explanation) {
        const group = clickedBtn.closest('[data-answer-group]') || clickedBtn.parentElement;
        const buttons = group ? Array.from(group.querySelectorAll('[data-answer]')) : [clickedBtn];
        let correctBtn = null;

        buttons.forEach((btn) => {
            btn.classList.remove('correct', 'incorrect');
            const markedCorrect = btn.dataset.correct === 'true' || btn.dataset.answer === 'correct';
            if (markedCorrect) {
                correctBtn = btn;
            }
        });

        clickedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect && correctBtn) {
            correctBtn.classList.add('correct');
        }

        if (isCorrect && group && !group.dataset.xpAwarded) {
            const xpAward = Number(group.dataset.xp || clickedBtn.dataset.xp || 10);
            if (Number.isFinite(xpAward) && xpAward > 0 && typeof window.updateXP === 'function') {
                window.updateXP(xpAward, { source: 'quiz', lessonId: document.body?.dataset?.lessonId || null });
            }
            group.dataset.xpAwarded = 'true';
        }

        if (explanation) {
            let expl = group ? group.querySelector('.answer-explanation') : null;
            if (!expl && group) {
                expl = document.createElement('div');
                expl.className = 'answer-explanation';
                group.appendChild(expl);
            }
            if (expl) {
                expl.textContent = explanation;
            }
        }
    }

    function setNavigationButtons(lessonId, containerSelector = '.footer-nav') {
        const index = findLessonIndex(lessonId);
        if (index === -1) return;

        // Skip auto nav when a page declares its own navigation (progress-nav or data-manual-nav)
        const hasManualNav = document.querySelector('[data-manual-nav], .progress-nav');
        const disableAutoNav = document.body?.dataset?.disableAutoNav === 'true';
        if (disableAutoNav || hasManualNav) return;

        let container = document.querySelector(containerSelector);
        if (!container) {
            const host = document.querySelector('.lesson-shell') || document.querySelector('.container');
            if (!host) return;
            container = document.createElement('div');
            container.className = containerSelector.replace('.', '') || 'footer-nav';
            host.appendChild(container);
        }

        container.innerHTML = '';

        const mainBtn = createNavButton('Back to Main Menu', LANDING_PAGE, 'btn-secondary');
        const path = (window.location && window.location.pathname) || '';
        const current = path.split('/').filter(Boolean).join('/');

        let nextHref = null;
        let nextLabel = 'Next →';
        let nextNote = '';

        if (PAGE_ORDER[lessonId]) {
            const seq = PAGE_ORDER[lessonId];
            const idx = seq.findIndex((p) => current.endsWith(p));
            if (idx >= 0 && idx < seq.length - 1) {
                nextHref = seq[idx + 1];
                nextLabel = PAGE_LABELS[nextHref] || 'Next →';
                nextNote = nextLabel;
            } else if (idx === seq.length - 1) {
                const override = CUSTOM_NEXT[lessonId];
                const autoNext = getAutoNextDestination(lessonId);
                const target = override || autoNext;
                if (target && target.href && target.href !== '#') {
                    nextHref = target.href;
                    nextLabel = target.label || 'Next Lesson →';
                    nextNote = target.label || 'Next lesson';
                }
            }
        } else {
            const pageTotal = Number(document.body?.dataset?.totalPages) || 0;
            const pageNumber = Number(document.body?.dataset?.pageNumber) || 0;
            const file = path.split('/').filter(Boolean).pop() || '';
            const folder = path.substring(0, path.lastIndexOf('/') + 1);
            const fileMatch = file.match(/^(.*?p)(\d+)(-.+)?\.html$/i);
            function buildSiblingPageHref(targetNumber) {
                if (!fileMatch || !folder) return null;
                const prefix = fileMatch[1];
                const suffix = fileMatch[3] || '';
                return `${folder}${prefix}${targetNumber}${suffix}.html`;
            }
            if (pageTotal && pageNumber && pageNumber < pageTotal) {
                nextHref = buildSiblingPageHref(pageNumber + 1);
            }
            if (!nextHref) {
                const override = CUSTOM_NEXT[lessonId];
                const autoNext = getAutoNextDestination(lessonId);
                const target = override || autoNext;
                if (target && target.href && target.href !== '#') {
                    nextHref = target.href;
                    nextLabel = target.label || 'Next →';
                    nextNote = target.label || 'Next lesson';
                }
            }
            if (nextHref && PAGE_LABELS[nextHref]) {
                nextLabel = PAGE_LABELS[nextHref];
                nextNote = PAGE_LABELS[nextHref];
            }
        }

        container.appendChild(mainBtn);

        if (nextHref) {
            container.appendChild(createNavButton(nextLabel, nextHref, 'btn-primary'));
        } else {
            const nextBtn = document.createElement('span');
            nextBtn.className = 'btn btn-primary is-disabled';
            nextBtn.textContent = nextLabel;
            nextBtn.setAttribute('aria-disabled', 'true');
            container.appendChild(nextBtn);
        }

        if (nextHref && nextNote) {
            const note = document.createElement('div');
            note.className = 'nav-note';
            note.textContent = nextNote;
            container.appendChild(note);
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

    function initPageProgress() {
        const total = Number(document.body?.dataset?.totalPages) || 0;
        const current = Number(document.body?.dataset?.pageNumber) || 0;
        if (!total || !current || current > total) return;
        const host = document.querySelector('.lesson-shell') || document.querySelector('.container');
        if (!host) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'page-progress-wrapper compact-progress';

        const label = document.createElement('div');
        label.className = 'page-progress-label';
        label.textContent = `Page ${current} of ${total}`;

        const bar = document.createElement('div');
        bar.className = 'page-progress';
        const fill = document.createElement('div');
        fill.className = 'page-progress-fill';
        const pct = Math.min(100, Math.round((current / total) * 100));
        fill.style.width = `${pct}%`;
        bar.appendChild(fill);

        wrapper.appendChild(label);
        wrapper.appendChild(bar);

        const header = host.querySelector('.header') || host.firstElementChild;
        if (header) {
            header.appendChild(wrapper);
        } else {
            host.prepend(wrapper);
        }
    }

    function emitXPEvent({ delta = 0, total = 0, source = 'activity', lessonId = null } = {}) {
        const detail = { delta, total, source, lessonId };
        document.dispatchEvent(new CustomEvent('xpUpdated', { detail }));
        window.dispatchEvent(new CustomEvent('xpUpdated', { detail }));
    }

    function updateXP(points = 0, { message = null, source = 'activity', lessonId = null } = {}) {
        const delta = Math.round(Number(points) || 0);
        if (!Number.isFinite(delta) || delta <= 0) return;
        const app = window.AppProgress || window.ProgressTracker || null;
        if (!app || typeof app.addXP !== 'function') return;
        const total = app.addXP(delta, { source, lessonId });
        ensureRewardsScript();
        if (window.Rewards && typeof window.Rewards.showReward === 'function') {
            const copy = message || `+${delta} XP earned!`;
            window.Rewards.showReward(delta, copy, { credit: false });
        }
        emitXPEvent({ delta, total, source, lessonId });
        if (window.AILesson && typeof window.AILesson.updateXPBar === 'function') {
            window.AILesson.updateXPBar({ xp: total, xpToNext: Math.max(100, total || 100) });
        }
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
        trackEvent: emitAnalytics,
        updateXP,
        emitXPEvent,
        showModal,
        showToast
    };

    window.updateXP = updateXP;
    window.emitXPEvent = emitXPEvent;
    window.showModal = showModal;
    window.showToast = showToast;

    document.addEventListener('DOMContentLoaded', () => {
        const lessonId = document.body?.dataset?.lessonId;
        if (!lessonId || !window.AILesson) return;
        if (!guardLessonAccess(lessonId)) {
            return;
        }
        const progressApi = window.AppProgress || window.ProgressTracker || null;
        if (progressApi && typeof progressApi.getLessonStatus === 'function' && typeof progressApi.setLessonStatus === 'function') {
            const status = progressApi.getLessonStatus(lessonId);
            if (status !== 'completed' && status !== 'in-progress') {
                progressApi.setLessonStatus(lessonId, 'in-progress');
            }
        }
        const breadcrumbSelector = document.body.dataset.breadcrumbSelector || '.breadcrumb';
        const footerSelector = document.body.dataset.footerSelector || '.footer-nav';
        window.AILesson.initLessonNavigation({ lessonId, breadcrumbSelector, footerSelector });
        initNextLessonButtons(lessonId);
        scrollGameExperiencesToTop();
        initPageProgress();

        ensurePracticeChat(lessonId);
        ensureRewardsScript();
        initAnswerFeedback();

        const looksLikeSummary = Boolean(document.querySelector('[data-next-lesson]'));
        if (looksLikeSummary && window.ProgressTracker && typeof window.ProgressTracker.markLessonComplete === 'function') {
            window.ProgressTracker.markLessonComplete(lessonId);
            emitAnalytics('lesson_completed', { lessonId, source: 'summary-page' });
        }
    });
})();
