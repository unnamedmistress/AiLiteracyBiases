document.addEventListener('DOMContentLoaded', () => {
    const tracker = window.ProgressTracker || null;
    const summary = document.getElementById('landingProgressSummary');
    const detail = document.getElementById('landingProgressDetail');

    if (tracker && summary && detail) {
        const overview = tracker.getOverview();
        const lessonsComplete = overview.completed;
        const totalLessons = overview.total || 6;
        summary.textContent = lessonsComplete
            ? `You're ${lessonsComplete}/${totalLessons} lessons in.`
            : 'Begin your journey with Lesson 1.';
        detail.textContent = `Total XP: ${overview.xp}. ${lessonsComplete ? 'Keep going!' : 'No XP recorded yet — jump in to start tracking your milestones.'}`;
    }

    document.querySelectorAll('[data-link]').forEach((el) => {
        el.addEventListener('click', () => {
            const target = el.getAttribute('data-link');
            if (target) window.location.href = target;
        });
    });
});
