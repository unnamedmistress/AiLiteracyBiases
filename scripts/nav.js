(function () {
    const MAIN_LINKS = [
        { id: 'home', label: 'Home', href: 'index.html' },
        { id: 'about', label: 'About', href: 'landing.html' }
    ];

    const RESOURCE_LINKS = [
        { id: 'glossary', label: 'Glossary', href: 'glossary.html' },
        { id: 'updates', label: 'Updates', href: 'updates.html' }
    ];

    const LESSON_LINKS = [
        { id: 'lesson1', label: 'Lesson 1', href: 'lesson1-ai-intro.html' },
        { id: 'quiz1', label: 'Quiz 1', href: 'quiz1.html' },
        { id: 'lesson2', label: 'Lesson 2', href: 'presentation.html' },
        { id: 'lesson3', label: 'Lesson 3', href: 'lesson3-content-creation.html' },
        { id: 'lesson4', label: 'Lesson 4', href: 'lesson4-advanced-prompting.html' },
        { id: 'lesson5', label: 'Lesson 5', href: 'lesson5-ai-workflows.html' },
        { id: 'lesson6', label: 'Lesson 6', href: 'lesson6-capstone.html' }
    ];

    const PATH_TO_STATE = {
        '': { main: 'home' },
        'index.html': { main: 'home' },
        'landing.html': { main: 'about' },
        'lesson1-ai-intro.html': { lesson: 'lesson1' },
        'quiz1.html': { lesson: 'quiz1' },
        'presentation.html': { lesson: 'lesson2' },
        'game.html': { lesson: 'lesson2' },
        'lesson3-content-creation.html': { lesson: 'lesson3' },
        'lesson4-advanced-prompting.html': { lesson: 'lesson4' },
        'lesson5-ai-workflows.html': { lesson: 'lesson5' },
        'lesson6-capstone.html': { lesson: 'lesson6' },
        'glossary.html': { resource: 'glossary' },
        'updates.html': { resource: 'updates' }
    };

    function buildLink({ id, label, href }, activeId, group) {
        const isActive = activeId === id;
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.textContent = label;
        anchor.className = `nav-link nav-link-${group}`;
        anchor.dataset.navId = id;
        if (isActive) {
            anchor.classList.add('is-active');
            if (group === 'lesson') {
                anchor.classList.add('active-lesson');
            }
            anchor.setAttribute('aria-current', group === 'lesson' ? 'step' : 'page');
        }
        return anchor;
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

        const mainLinksWrapper = document.createElement('div');
        mainLinksWrapper.className = 'nav-group nav-group-main';
        MAIN_LINKS.forEach((link) => {
            mainLinksWrapper.appendChild(buildLink(link, activeState.main, 'main'));
        });

        const resourcesWrapper = document.createElement('div');
        resourcesWrapper.className = 'nav-group nav-group-resources';
        RESOURCE_LINKS.forEach((link) => {
            resourcesWrapper.appendChild(buildLink(link, activeState.resource, 'resource'));
        });

        const lessonsWrapper = document.createElement('div');
        lessonsWrapper.className = 'nav-group nav-group-lessons';
        const lessonsLabel = document.createElement('span');
        lessonsLabel.className = 'nav-section-label';
        lessonsLabel.textContent = 'Lessons';
        lessonsWrapper.appendChild(lessonsLabel);
        const lessonsList = document.createElement('div');
        lessonsList.className = 'lesson-links';
        LESSON_LINKS.forEach((link) => {
            lessonsList.appendChild(buildLink(link, activeState.lesson, 'lesson'));
        });
        lessonsWrapper.appendChild(lessonsList);

        nav.appendChild(brand);
        nav.appendChild(mainLinksWrapper);
        nav.appendChild(resourcesWrapper);
        nav.appendChild(lessonsWrapper);

        document.body.classList.add('with-global-nav');
        document.body.prepend(nav);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('[data-global-nav]')) return;
        renderNav();
    });
})();
