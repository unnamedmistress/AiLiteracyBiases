const UPDATES = [
    {
        date: '2024-06-09',
        title: 'Progress Tracker + Nav Refresh',
        tag: 'New Feature',
        summary: 'Introduced local XP tracking, checkpoint persistence, and consistent nav across the hub, lesson one, and landing page.'
    },
    {
        date: '2024-05-28',
        title: 'Lesson 1 Gamification',
        tag: 'Lesson Update',
        summary: 'Added checkpoint pills, replayable quiz rounds, and improved bias case studies. XP now awards per challenge.'
    },
    {
        date: '2024-05-15',
        title: 'AI Detective Academy Launch',
        tag: 'Release',
        summary: 'Published the beta curriculum for AI literacy plus initial investigative challenges and facilitator notes.'
    }
];

function formatUpdateDate(isoDate) {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function slugifyTag(tag) {
    return `tag-${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const updatesList = document.getElementById('updatesList');
    if (!updatesList) return;

    updatesList.innerHTML = UPDATES.map(({ date, title, tag, summary }) => {
        const formattedDate = formatUpdateDate(date);
        const tagClass = slugifyTag(tag);
        return `
            <article class="update-card">
                <div class="update-meta">
                    <p>${formattedDate}</p>
                    <span class="tag ${tagClass}">${tag}</span>
                </div>
                <h3>${title}</h3>
                <p>${summary}</p>
            </article>
        `;
    }).join('');
});
