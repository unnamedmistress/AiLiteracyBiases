(function () {
    const LESSON_SEQUENCE = [
        { id: 'lesson1', label: 'Lesson 1: Prompt Wizardry Warm-Up', path: 'lesson1-ai-intro.html' },
        { id: 'lesson2-learn', label: 'Lesson 2: AI Literacy', path: 'presentation.html' },
        { id: 'lesson2-game', label: 'Lesson 2: Game Mode', path: 'game.html' },
        { id: 'lesson3', label: 'Lesson 3: Content Creation', path: 'lesson3-content-creation.html' },
        { id: 'quiz1', label: 'Quiz 1: Warm-Up Review', path: 'quiz1.html' },
        { id: 'lesson4', label: 'Lesson 4: Advanced Prompting', path: 'lesson4-advanced-prompting.html' },
        { id: 'lesson5', label: 'Lesson 5: AI Workflows', path: 'lesson5-ai-workflows.html' },
        { id: 'lesson6', label: 'Lesson 6: Capstone', path: 'lesson6-capstone.html' },
        { id: 'lesson7-placeholder', label: 'Lesson 7 (Coming Soon)', path: '#' }
    ];

    const CUSTOM_NEXT = {
        lesson1: {
            href: 'presentation.html',
            label: 'Next: Lesson 2 →'
        },
        quiz1: {
            href: 'lesson4-advanced-prompting.html',
            label: 'Next: Lesson 4 →'
        },
        'lesson2-learn': {
            href: 'game.html',
            label: 'Next: Game Mode →'
        },
        'lesson2-game': {
            href: 'lesson3-content-creation.html',
            label: 'Next: Lesson 3 →'
        },
        lesson6: {
            href: 'certificate.html',
            label: 'View Certificate →'
        }
    };

    function findLessonIndex(lessonId) {
        return LESSON_SEQUENCE.findIndex((lesson) => lesson.id === lessonId);
    }

    function setNavigationButtons(lessonId, containerSelector = '.footer-nav') {
        const index = findLessonIndex(lessonId);
        if (index === -1) return;

        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '';

        const mainBtn = createNavButton('Main Menu', 'index.html', 'btn-secondary');

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
        button.href = href;
        button.className = `btn ${className}`.trim();
        return button;
    }

    function setBreadcrumb(lessonId, containerSelector = '.breadcrumb') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const lessonIndex = findLessonIndex(lessonId);
        container.innerHTML = '';

        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
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

        function setMode(mode) {
            if (!gamePanel || !presentationPanel) return;

            const showGame = mode === 'game';
            gamePanel.classList.toggle('hidden', !showGame);
            presentationPanel.classList.toggle('hidden', showGame);

            if (gameBtn && presentBtn) {
                gameBtn.classList.toggle('active', showGame);
                presentBtn.classList.toggle('active', !showGame);
            }
        }

        if (gameBtn) gameBtn.addEventListener('click', () => setMode('game'));
        if (presentBtn) presentBtn.addEventListener('click', () => setMode('presentation'));

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

    window.AILesson = {
        LESSON_SEQUENCE,
        initLessonNavigation: function (options = {}) {
            const { lessonId, breadcrumbSelector, footerSelector } = options;
            setBreadcrumb(lessonId, breadcrumbSelector);
            setNavigationButtons(lessonId, footerSelector);
        },
        initModeToggle,
        updateXPBar,
        findLessonIndex
    };

    document.addEventListener('DOMContentLoaded', () => {
        const lessonId = document.body?.dataset?.lessonId;
        if (!lessonId || !window.AILesson) return;
        const breadcrumbSelector = document.body.dataset.breadcrumbSelector || '.breadcrumb';
        const footerSelector = document.body.dataset.footerSelector || '.footer-nav';
        window.AILesson.initLessonNavigation({ lessonId, breadcrumbSelector, footerSelector });
    });
})();
