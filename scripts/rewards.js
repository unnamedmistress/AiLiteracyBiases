(function () {
    const REWARD_ID = 'reward-toast';

    function ensureStyles() {
        if (document.getElementById('reward-styles')) return;
        const style = document.createElement('style');
        style.id = 'reward-styles';
        style.textContent = `
        .reward-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10B981, #059669);
            color: #fff;
            padding: 14px 18px;
            border-radius: 14px;
            box-shadow: 0 14px 30px rgba(16, 185, 129, 0.35);
            z-index: 1100;
            min-width: 220px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
        }
        .reward-toast .reward-xp {
            font-size: 22px;
        }
        .reward-toast .reward-copy {
            font-size: 14px;
        }
        `;
        document.head.appendChild(style);
    }

    function showReward(xp = 0, message = 'Nice work!', { credit = true } = {}) {
        ensureStyles();
        const reward = document.createElement('div');
        reward.id = `${REWARD_ID}-${Date.now()}`;
        reward.className = 'reward-toast';
        reward.setAttribute('role', 'status');
        reward.innerHTML = `<span class="reward-xp">+${xp} XP</span><span class="reward-copy">${message}</span>`;
        document.body.appendChild(reward);

        setTimeout(() => {
            reward.remove();
        }, 3200);

        if (credit) {
            const app = window.AppProgress || window.ProgressTracker || null;
            if (app && typeof app.addXP === 'function' && xp) {
                app.addXP(xp, { source: 'reward' });
                const total = app.getXP ? app.getXP() : null;
                if (window.AILesson && window.AILesson.updateXPBar && total !== null) {
                    window.AILesson.updateXPBar({ xp: total, xpToNext: Math.max(100, total || 100) });
                }
            }
        }
    }

    window.Rewards = { showReward };
})();
