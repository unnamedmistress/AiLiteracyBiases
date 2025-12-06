(function () {
    const MODE_STORAGE_KEY = 'aiProfessionalMode_v1';

    function readProfessionalModePreference() {
        try {
            return localStorage.getItem(MODE_STORAGE_KEY) === 'professional';
        } catch (error) {
            console.warn('[nav] Unable to read mode preference.', error);
            return false;
        }
    }

    function applyProfessionalModeClass(enabled) {
        const root = document.documentElement;
        if (root) {
            root.classList.toggle('professional-mode', Boolean(enabled));
        }
        const body = document.body;
        if (body) {
            body.classList.toggle('professional-mode', Boolean(enabled));
        }
    }

    applyProfessionalModeClass(readProfessionalModePreference());
    window.addEventListener('professionalmodechange', (event) => {
        const specified = Boolean(event && event.detail && Object.prototype.hasOwnProperty.call(event.detail, 'enabled'));
        const nextState = specified ? Boolean(event.detail.enabled) : readProfessionalModePreference();
        applyProfessionalModeClass(nextState);
    });

    const MAIN_LINKS = [
        { id: 'home', label: 'Home', href: 'index.html' },
        { id: 'about', label: 'About', href: 'landing.html' }
    ];

    const RESOURCE_LINKS = [
        { id: 'glossary', label: 'Glossary', href: 'glossary.html' },
        { id: 'updates', label: 'Updates', href: 'updates.html' }
    ];

    const LESSON_LINKS = [
        { id: 'lesson1', label: 'Lesson 1', href: 'lesson1/l1-p1-learn-intro.html' },
        { id: 'lesson2', label: 'Lesson 2', href: 'lesson2/l2-p1-learn-intro.html' },
        { id: 'lesson3', label: 'Lesson 3', href: 'lesson3/l3-p1-learn-intro.html' },
        { id: 'quiz1', label: 'Quiz 1', href: 'quiz1.html' },
        { id: 'lesson4', label: 'Lesson 4', href: 'lesson4/l4-p1-learn-intro.html' },
        { id: 'lesson5', label: 'Lesson 5', href: 'lesson5/l5-p1-learn-intro.html' },
        { id: 'lesson6', label: 'Lesson 6', href: 'lesson6-capstone.html', locked: true, comingSoon: true }
    ];
    const LESSON_UNLOCK_RULES = {
        lesson2: 'lesson1',
        quiz1: 'lesson2',
        lesson3: 'quiz1',
        lesson4: 'lesson3',
        lesson5: 'lesson4',
        lesson6: 'lesson5'
    };
    const PROGRESS_STORAGE_KEY = 'aiLiteracyProgress_v1';
    const QUIZ_REQUIREMENTS = { quiz1: 75 };
    let cachedProgressSnapshot = null;

    const PATH_TO_STATE = {
        '': { main: 'home' },
        'index.html': { main: 'home' },
        'landing.html': { main: 'about' },
        'lesson1-ai-intro.html': { lesson: 'lesson1' }, // Legacy support
        'lesson1/l1-p1-learn-intro.html': { lesson: 'lesson1' },
        'lesson1/l1-p2-game-prediction.html': { lesson: 'lesson1' },
        'lesson1/l1-p3-learn-tone.html': { lesson: 'lesson1' },
        'lesson1/l1-p4-game-voice.html': { lesson: 'lesson1' },
        'lesson1/l1-p5-game-tone.html': { lesson: 'lesson1' },
        'lesson1/l1-p6-summary.html': { lesson: 'lesson1' },
        'quiz1.html': { lesson: 'quiz1' },
        'presentation.html': { lesson: 'lesson2' }, // Legacy support
        'lesson2/l2-p1-learn-intro.html': { lesson: 'lesson2' },
        'lesson2/l2-p2-learn-hallucinations.html': { lesson: 'lesson2' },
        'lesson2/l2-p3-game-hallucinations.html': { lesson: 'lesson2' },
        'lesson2/l2-p4-learn-confidence.html': { lesson: 'lesson2' },
        'lesson2/l2-p5-game-confidence.html': { lesson: 'lesson2' },
        'lesson2/l2-p6-learn-values.html': { lesson: 'lesson2' },
        'lesson2/l2-p7-game-values.html': { lesson: 'lesson2' },
        'lesson2/l2-p8-learn-memory.html': { lesson: 'lesson2' },
        'lesson2/l2-p9-game-memory.html': { lesson: 'lesson2' },
        'lesson2/l2-p10-learn-facts.html': { lesson: 'lesson2' },
        'lesson2/l2-p11-game-disasters.html': { lesson: 'lesson2' },
        'lesson2/l2-p12-summary.html': { lesson: 'lesson2' },
        'game.html': { lesson: 'lesson2' },
        'lesson3/l3-p1-learn-intro.html': { lesson: 'lesson3' },
        'lesson3/l3-p2-learn-briefs.html': { lesson: 'lesson3' },
        'lesson3/l3-p3-game-brief-diagnostics.html': { lesson: 'lesson3' },
        'lesson3/l3-p4-learn-structure.html': { lesson: 'lesson3' },
        'lesson3/l3-p5-game-structure.html': { lesson: 'lesson3' },
        'lesson3/l3-p6-learn-style.html': { lesson: 'lesson3' },
        'lesson3/l3-p7-game-style.html': { lesson: 'lesson3' },
        'lesson3/l3-p8-learn-safety.html': { lesson: 'lesson3' },
        'lesson3/l3-p9-game-safety.html': { lesson: 'lesson3' },
        'lesson3/l3-p10-summary.html': { lesson: 'lesson3' },
        'lesson3-content-creation.html': { lesson: 'lesson3' },
        'lesson4/l4-p1-learn-intro.html': { lesson: 'lesson4' },
        'lesson4/l4-p2-learn-fewshot.html': { lesson: 'lesson4' },
        'lesson4/l4-p3-game-fewshot.html': { lesson: 'lesson4' },
        'lesson4/l4-p4-learn-cot.html': { lesson: 'lesson4' },
        'lesson4/l4-p5-game-cot.html': { lesson: 'lesson4' },
        'lesson4/l4-p6-learn-tools.html': { lesson: 'lesson4' },
        'lesson4/l4-p7-game-tools.html': { lesson: 'lesson4' },
        'lesson4/l4-p8-learn-rag.html': { lesson: 'lesson4' },
        'lesson4/l4-p9-game-rag.html': { lesson: 'lesson4' },
        'lesson4/l4-p10-learn-safety.html': { lesson: 'lesson4' },
        'lesson4/l4-p11-game-safety.html': { lesson: 'lesson4' },
        'lesson4/l4-p12-summary.html': { lesson: 'lesson4' },
        'lesson4-advanced-prompting.html': { lesson: 'lesson4' },
        'lesson5/l5-p1-learn-intro.html': { lesson: 'lesson5' },
        'lesson5/l5-p2-learn-patterns.html': { lesson: 'lesson5' },
        'lesson5/l5-p3-game-builder.html': { lesson: 'lesson5' },
        'lesson5/l5-p4-learn-bottlenecks.html': { lesson: 'lesson5' },
        'lesson5/l5-p5-game-debug.html': { lesson: 'lesson5' },
        'lesson5/l5-p6-learn-automation.html': { lesson: 'lesson5' },
        'lesson5/l5-p7-game-automation.html': { lesson: 'lesson5' },
        'lesson5/l5-p8-learn-guardrails.html': { lesson: 'lesson5' },
        'lesson5/l5-p9-game-scenario.html': { lesson: 'lesson5' },
        'lesson5/l5-p10-summary.html': { lesson: 'lesson5' },
        'lesson5-ai-workflows.html': { lesson: 'lesson5' },
        'lesson6-capstone.html': { lesson: 'lesson6' },
        'glossary.html': { resource: 'glossary' },
        'updates.html': { resource: 'updates' }
    };

    function loadProgressSnapshot() {
        if (cachedProgressSnapshot) return cachedProgressSnapshot;
        try {
            const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (!raw) {
                cachedProgressSnapshot = { lessons: {}, quizScores: {} };
                return cachedProgressSnapshot;
            }
            const parsed = JSON.parse(raw);
            cachedProgressSnapshot = {
                lessons: typeof parsed?.lessons === 'object' && parsed?.lessons ? parsed.lessons : {},
                quizScores: typeof parsed?.quizScores === 'object' && parsed?.quizScores ? parsed.quizScores : {}
            };
        } catch (error) {
            console.warn('[nav] Failed to parse progress snapshot.', error);
            cachedProgressSnapshot = { lessons: {}, quizScores: {} };
        }
        return cachedProgressSnapshot;
    }

    function getQuizStatus(snapshot, quizId) {
        const score = Number(snapshot.quizScores?.[quizId]) || 0;
        const required = QUIZ_REQUIREMENTS[quizId] ?? 1;
        if (score >= required) return 'completed';
        if (score > 0) return 'in-progress';
        return 'not-started';
    }

    function requirementMet(snapshot, requirementId) {
        if (!requirementId) return true;
        if (requirementId.startsWith('quiz')) {
            const quizScore = Number(snapshot.quizScores?.[requirementId]) || 0;
            const needed = QUIZ_REQUIREMENTS[requirementId] ?? 1;
            return quizScore >= needed;
        }
        return snapshot.lessons?.[requirementId] === 'completed';
    }

    function getLessonStatusMeta(link) {
        if (!link.id) return { status: 'not-started', icon: '', label: 'Not started', locked: false };
        const snapshot = loadProgressSnapshot();
        const prerequisite = LESSON_UNLOCK_RULES[link.id];
        const gated = Boolean(prerequisite && !requirementMet(snapshot, prerequisite));
        if (link.locked || gated) {
            return {
                status: 'locked',
                icon: '🔒',
                label: link.comingSoon ? 'Coming soon' : gated ? 'Locked · Finish the previous mission' : 'Locked',
                locked: true,
                comingSoon: Boolean(link.comingSoon),
                prerequisite
            };
        }
        let status = snapshot.lessons?.[link.id] || 'not-started';
        if (link.id.startsWith('quiz')) {
            status = getQuizStatus(snapshot, link.id);
        }
        if (status === 'completed') {
            return { status, icon: '✓', label: 'Completed', locked: false };
        }
        if (status === 'in-progress') {
            return { status, icon: '🔄', label: 'In progress', locked: false };
        }
        return { status: 'not-started', icon: '', label: 'Not started', locked: false };
    }

    function buildLink(link, activeId, group) {
        const { id, label, href, locked, comingSoon } = link;
        const isActive = activeId === id;
        let computedLock = Boolean(locked);
        let statusMeta = { status: 'not-started', icon: '', label: 'Not started', locked: false };

        if (group === 'lesson') {
            statusMeta = getLessonStatusMeta(link);
            computedLock = computedLock || Boolean(statusMeta.locked);
        }

        const element = document.createElement(computedLock ? 'span' : 'a');
        element.className = `nav-link nav-link-${group}`;
        element.dataset.navId = id;
        if (group === 'lesson') {
            element.dataset.lessonStatus = statusMeta.status;
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'nav-link-label';
        labelSpan.textContent = label;
        element.appendChild(labelSpan);

        if (computedLock) {
            element.classList.add('is-locked');
            element.setAttribute('aria-disabled', 'true');
            const lockCopy = comingSoon || statusMeta.comingSoon ? 'Coming soon' : 'Locked';
            element.setAttribute('title', lockCopy);
            element.setAttribute('aria-label', `${label} (${lockCopy})`);
            if (comingSoon || statusMeta.comingSoon) {
                const badge = document.createElement('span');
                badge.className = 'nav-coming-soon';
                badge.textContent = 'Coming Soon';
                element.appendChild(badge);
            }
        } else {
            element.href = href;
            if (group === 'lesson') {
                element.setAttribute('aria-label', `${label} · ${statusMeta.label}`);
            }
        }

        if (isActive) {
            element.classList.add('is-active');
            if (group === 'lesson') {
                element.classList.add('active-lesson');
            }
            element.setAttribute('aria-current', group === 'lesson' ? 'step' : 'page');
            const indicator = document.createElement('span');
            indicator.className = 'nav-current-indicator';
            indicator.textContent = "You're here";
            element.appendChild(indicator);
        }

        if (group === 'lesson') {
            if (statusMeta.status === 'completed') {
                element.classList.add('is-completed');
            } else if (statusMeta.status === 'in-progress') {
                element.classList.add('is-in-progress');
            }
            if (statusMeta.icon) {
                const badge = document.createElement('span');
                badge.className = `nav-status-badge nav-status-${statusMeta.status}`;
                badge.setAttribute('role', 'img');
                badge.setAttribute('aria-label', `${statusMeta.label}`);
                badge.textContent = statusMeta.icon;
                labelSpan.appendChild(badge);
            }
        }

        return element;
    }

    function buildSection(title, links, activeId, group) {
        const section = document.createElement('section');
        section.className = 'nav-drawer-section';

        const heading = document.createElement('p');
        heading.className = 'nav-section-title';
        heading.textContent = title;
        section.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'nav-drawer-links';
        links.forEach((link) => list.appendChild(buildLink(link, activeId, group)));
        section.appendChild(list);

        return section;
    }

    function renderNav() {
        const currentFile = window.location.pathname.split('/').pop();
        const activeState = PATH_TO_STATE[currentFile] || { main: 'home' };

        const nav = document.createElement('nav');
        nav.className = 'global-nav';
        nav.dataset.globalNav = 'true';

        const brand = document.createElement('div');
        brand.className = 'nav-brand';
        const brandLink = document.createElement('a');
        brandLink.href = 'index.html';
        brandLink.textContent = 'AI Detective Academy';
        brand.appendChild(brandLink);

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'navDrawer');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.innerHTML = '<span class="sr-only">Toggle navigation</span><span class="nav-toggle-bars" aria-hidden="true"></span>';

        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';

        const drawer = document.createElement('div');
        drawer.className = 'nav-drawer';
        drawer.id = 'navDrawer';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'nav-close';
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.innerHTML = '<span aria-hidden="true">×</span>';

        drawer.appendChild(closeBtn);
        drawer.appendChild(buildSection('Main', MAIN_LINKS, activeState.main, 'main'));
        drawer.appendChild(buildSection('Resources', RESOURCE_LINKS, activeState.resource, 'resource'));
        drawer.appendChild(buildSection('Lessons', LESSON_LINKS, activeState.lesson, 'lesson'));

        nav.appendChild(brand);
        nav.appendChild(toggle);
        nav.appendChild(overlay);
        nav.appendChild(drawer);

        function setDrawerState(open) {
            nav.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        toggle.addEventListener('click', () => {
            const nextState = !nav.classList.contains('nav-open');
            setDrawerState(nextState);
        });

        overlay.addEventListener('click', () => setDrawerState(false));
        closeBtn.addEventListener('click', () => setDrawerState(false));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('nav-open')) {
                setDrawerState(false);
            }
        });

        nav.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            const anchor = event.target.closest('a');
            if (!anchor || anchor.getAttribute('href') === '#') return;
            const href = anchor.getAttribute('href');
            if (!href) return;
            event.preventDefault();
            setDrawerState(false);
            window.location.href = href;
        });

        document.body.classList.add('with-global-nav');
        document.body.prepend(nav);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('[data-global-nav]')) return;
        renderNav();
    });
})();
