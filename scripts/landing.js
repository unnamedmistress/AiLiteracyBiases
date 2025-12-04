document.addEventListener('DOMContentLoaded', () => {
    const progressApi = window.AppProgress || window.ProgressTracker || null;
    const TOTAL_LESSONS = 6;
    const summary = document.getElementById('landingProgressSummary');
    const detail = document.getElementById('landingProgressDetail');

    if (progressApi && summary && detail) {
        const overview = normalizeOverview(progressApi.getOverview ? progressApi.getOverview() : {});
        const lessonsComplete = overview.completed;
        const totalLessons = overview.total || TOTAL_LESSONS;
        summary.textContent = lessonsComplete
            ? `You're ${lessonsComplete}/${totalLessons} lessons in.`
            : 'Begin your journey with Lesson 1.';
        detail.textContent = overview.corrected
            ? 'Progress data looked off, so we reset it. Hit Reset Progress on the dashboard anytime to start fresh.'
            : `Total XP: ${overview.xp}. ${lessonsComplete ? 'Keep going!' : 'No XP recorded yet — jump in to start tracking your milestones.'}`;
    }

    document.querySelectorAll('[data-link]').forEach((el) => {
        el.addEventListener('click', () => {
            const target = el.getAttribute('data-link');
            if (target) window.location.href = target;
        });
    });

    function normalizeOverview(raw = {}) {
        const total = Number(raw.total) || TOTAL_LESSONS;
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
});
