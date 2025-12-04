document.addEventListener('DOMContentLoaded', () => {
    const progressApi = window.AppProgress || window.ProgressTracker || null;
    const TOTAL_LESSONS = 6;
    const summary = document.getElementById('landingProgressSummary');
    const detail = document.getElementById('landingProgressDetail');
    let overviewSnapshot = normalizeOverview();

    if (progressApi && summary && detail) {
        overviewSnapshot = normalizeOverview(progressApi.getOverview ? progressApi.getOverview() : {});
    }

    refreshProgressCopy();
    window.addEventListener('professionalmodechange', refreshProgressCopy);

    document.querySelectorAll('[data-link]').forEach((el) => {
        const activate = () => {
            const target = el.getAttribute('data-link');
            if (target) window.location.href = target;
        };

        el.addEventListener('click', activate);

        if (!['BUTTON', 'A'].includes((el.tagName || '').toUpperCase())) {
            el.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                }
            });
        }
    });

    function refreshProgressCopy() {
        if (!summary || !detail) return;
        const lessonsComplete = overviewSnapshot.completed;
        const totalLessons = overviewSnapshot.total || TOTAL_LESSONS;
        summary.textContent = lessonsComplete
            ? `You're ${lessonsComplete}/${totalLessons} lessons in.`
            : 'Begin your journey with Lesson 1.';

        if (overviewSnapshot.corrected) {
            detail.textContent = 'Progress data looked off, so we reset it. Use Reset Progress on the dashboard anytime to start clean.';
            return;
        }

        if (isProfessionalMode()) {
            detail.textContent = lessonsComplete
                ? 'Professional Mode keeps stats minimal—toggle Learner Mode anytime to view XP again.'
                : 'Professional Mode hides XP until you need it. Start Lesson 1 to build momentum.';
            return;
        }

        detail.textContent = lessonsComplete
            ? `Total XP: ${overviewSnapshot.xp}. Keep the streak alive.`
            : `Total XP: ${overviewSnapshot.xp}. No XP recorded yet — jump in to start tracking your milestones.`;
    }

    function isProfessionalMode() {
        const root = document.documentElement;
        const body = document.body;
        return (root && root.classList.contains('professional-mode')) || (body && body.classList.contains('professional-mode'));
    }

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
