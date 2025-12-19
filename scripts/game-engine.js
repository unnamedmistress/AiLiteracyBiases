/**
 * Enhanced game engine for consistent interactions across all lessons
 */

class GameEngine {
    constructor(lessonKey, totalXP = 100) {
        this.lessonKey = lessonKey;
        this.totalXP = totalXP;
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const stored = localStorage.getItem(this.lessonKey);
        return stored ? JSON.parse(stored) : { xp: 0, gamesComplete: 0, badges: [] };
    }

    saveProgress() {
        localStorage.setItem(this.lessonKey, JSON.stringify(this.progress));
    }

    awardXP(amount, showNotification = true) {
        const oldXP = this.progress.xp;
        this.progress.xp = Math.min(this.totalXP, this.progress.xp + amount);
        this.saveProgress();
        this.updateDisplay();

        if (showNotification) {
            this.showXPNotification(amount);
        }

        return this.progress.xp - oldXP; // Return actual XP awarded
    }

    completeGame(gameNumber, xpReward = 20) {
        this.progress.gamesComplete = Math.max(this.progress.gamesComplete, gameNumber);
        this.awardXP(xpReward);
    }

    unlockBadge(badgeName) {
        if (!this.progress.badges.includes(badgeName)) {
            this.progress.badges.push(badgeName);
            this.saveProgress();
            this.showBadgeNotification(badgeName);
        }
    }

    updateDisplay() {
        const xpElement = document.getElementById('lessonXP');
        const fillElement = document.getElementById('lessonXPFill');

        if (xpElement) {
            xpElement.textContent = `${this.progress.xp}/${this.totalXP} XP`;
        }

        if (fillElement) {
            const percentage = (this.progress.xp / this.totalXP) * 100;
            fillElement.style.width = `${percentage}%`;
        }
    }

    showXPNotification(amount) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.textContent = `+${amount} XP`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showBadgeNotification(badgeName) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 8px;">🏆</div>
            <div style="font-weight: 600;">Badge Unlocked!</div>
            <div style="font-size: 14px; margin-top: 4px;">${badgeName}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 32px;
            border-radius: 16px;
            text-align: center;
            z-index: 9999;
            animation: badgePop 0.5s ease;
            border: 2px solid #facc15;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getProgress() {
        return this.progress;
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset your progress for this lesson?')) {
            this.progress = { xp: 0, gamesComplete: 0, badges: [] };
            this.saveProgress();
            this.updateDisplay();
            location.reload();
        }
    }
}

// Utility functions for common game interactions
const GameUtils = {
    selectOption(element, selectedClass = 'selected') {
        // Remove selected class from siblings
        const siblings = element.parentElement.querySelectorAll(`.${selectedClass}`);
        siblings.forEach(el => el.classList.remove(selectedClass));

        // Add selected class to clicked element
        element.classList.add(selectedClass);
    },

    markCorrect(element) {
        element.classList.remove('incorrect', 'selected');
        element.classList.add('correct');
    },

    markIncorrect(element) {
        element.classList.remove('correct', 'selected');
        element.classList.add('incorrect');
    },

    showFeedback(feedbackId) {
        const feedback = document.getElementById(feedbackId);
        if (feedback) {
            feedback.classList.add('show');
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    hideFeedback(feedbackId) {
        const feedback = document.getElementById(feedbackId);
        if (feedback) {
            feedback.classList.remove('show');
        }
    },

    disableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        }
    },

    enableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    },

    validateInput(inputId, minLength = 1) {
        const input = document.getElementById(inputId);
        if (!input) return false;

        const value = input.value.trim();
        return value.length >= minLength;
    },

    showError(message, duration = 3000) {
        const error = document.createElement('div');
        error.className = 'error-notification';
        error.textContent = message;
        error.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(error);

        setTimeout(() => {
            error.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => error.remove(), 300);
        }, duration);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes badgePop {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Export for use in lesson pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine, GameUtils };
}
