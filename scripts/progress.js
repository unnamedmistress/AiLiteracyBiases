(function () {
    const STORAGE_KEY = 'aiLiteracyProgress_v1';
    const KNOWN_LESSONS = ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'];
    const KNOWN_QUIZZES = ['quiz1'];
    const DEFAULT_STATE = {
        xp: 0,
        lessons: {},
        checkpoints: {},
        quizScores: {},
        lessonXP: {}
    };

    function cloneDefault() {
        return {
            xp: DEFAULT_STATE.xp,
            lessons: { ...DEFAULT_STATE.lessons },
            checkpoints: { ...DEFAULT_STATE.checkpoints },
            quizScores: { ...DEFAULT_STATE.quizScores },
            lessonXP: { ...DEFAULT_STATE.lessonXP }
        };
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return cloneDefault();
            const parsed = JSON.parse(raw);
            return {
                xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
                lessons: typeof parsed.lessons === 'object' && parsed.lessons ? parsed.lessons : {},
                checkpoints: typeof parsed.checkpoints === 'object' && parsed.checkpoints ? parsed.checkpoints : {},
                quizScores: typeof parsed.quizScores === 'object' && parsed.quizScores ? parsed.quizScores : {},
                lessonXP: typeof parsed.lessonXP === 'object' && parsed.lessonXP ? parsed.lessonXP : {}
            };
        } catch (error) {
            console.warn('[ProgressTracker] Failed to parse progress payload.', error);
            return cloneDefault();
        }
    }

    let state = loadState();
    sanitizeState();

    function isLessonIdentifier(id) {
        if (typeof id !== 'string' || !id) return false;
        return KNOWN_LESSONS.includes(id) || id.startsWith('lesson');
    }

    function isQuizIdentifier(id) {
        if (typeof id !== 'string' || !id) return false;
        return KNOWN_QUIZZES.includes(id) || id.startsWith('quiz');
    }

    function getTrackedLessonIds() {
        const ids = new Set(KNOWN_LESSONS);
        Object.keys(state.lessons || {}).forEach((key) => {
            if (isLessonIdentifier(key)) ids.add(key);
        });
        return Array.from(ids);
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('[ProgressTracker] Unable to persist progress state.', error);
        }
    }

    function countCompletedLessons() {
        if (!state.lessons || typeof state.lessons !== 'object') return 0;
        return getTrackedLessonIds().filter((lessonId) => state.lessons[lessonId] === 'completed').length;
    }

    function getQuizStatuses() {
        const entries = {};
        if (!state.lessons || typeof state.lessons !== 'object') return entries;
        Object.keys(state.lessons).forEach((key) => {
            if (isQuizIdentifier(key)) {
                entries[key] = state.lessons[key];
            }
        });
        return entries;
    }

    function sumLessonXP() {
        return Object.values(state.lessonXP || {}).reduce((total, lessonValue) => {
            const normalized = Number(lessonValue);
            if (Number.isFinite(normalized) && normalized > 0) {
                return total + normalized;
            }
            return total;
        }, 0);
    }

    function sanitizeState() {
        if (!state || typeof state !== 'object') {
            state = cloneDefault();
            persist();
            return;
        }

        let mutated = false;
        if (typeof state.lessons !== 'object' || !state.lessons) {
            state.lessons = {};
            mutated = true;
        }
        if (typeof state.checkpoints !== 'object' || !state.checkpoints) {
            state.checkpoints = {};
            mutated = true;
        }
        if (typeof state.quizScores !== 'object' || !state.quizScores) {
            state.quizScores = {};
            mutated = true;
        }
        if (typeof state.lessonXP !== 'object' || !state.lessonXP) {
            state.lessonXP = {};
            mutated = true;
        }

        state.xp = Number(state.xp) || 0;
        if (state.xp < 0) {
            state.xp = 0;
            mutated = true;
        }

        const completedLessons = countCompletedLessons();
        if (completedLessons === 0) {
            if (state.xp !== 0) {
                state.xp = 0;
                mutated = true;
            }
            if (Object.keys(state.quizScores).length) {
                state.quizScores = {};
                mutated = true;
            }
            if (Object.keys(state.lessonXP).length) {
                state.lessonXP = {};
                mutated = true;
            }
        }

        let ledgerXP = sumLessonXP();
        if (!ledgerXP && state.xp > 0) {
            state.lessonXP.__legacy = state.xp;
            ledgerXP = state.xp;
            mutated = true;
        }
        if (ledgerXP !== state.xp) {
            state.xp = ledgerXP;
            mutated = true;
        }

        if (mutated) persist();
    }

    function resetAllState() {
        state = cloneDefault();
        persist();
    }

    function resolveLessonKey(metadata = {}) {
        if (!metadata || typeof metadata !== 'object') return '__global';
        const { lessonId, lesson, source } = metadata;
        return String(lessonId || lesson || source || '__global');
    }

    function mutateLessonXP(delta = 0, metadata = {}) {
        const adjustment = Number(delta);
        if (!Number.isFinite(adjustment) || adjustment === 0) return;
        if (!state.lessonXP || typeof state.lessonXP !== 'object') {
            state.lessonXP = {};
        }
        const key = resolveLessonKey(metadata);
        const existing = Number(state.lessonXP[key]) || 0;
        const updated = Math.max(0, existing + adjustment);
        if (updated === 0) {
            delete state.lessonXP[key];
        } else {
            state.lessonXP[key] = updated;
        }
    }

    function recomputeTotalXP() {
        state.xp = Math.max(0, sumLessonXP());
    }

    function ensureLessonStructures(lessonId) {
        if (!lessonId) return;
        if (!state.lessons[lessonId]) state.lessons[lessonId] = 'not-started';
        if (!state.checkpoints[lessonId]) state.checkpoints[lessonId] = {};
    }

    const ProgressTracker = {
        getXP() {
            return state.xp;
        },
        addXP(amount = 0, metadata = {}) {
            const delta = Math.round(Number(amount) || 0);
            if (!Number.isFinite(delta) || delta <= 0) return state.xp;
            mutateLessonXP(delta, metadata);
            recomputeTotalXP();
            persist();
            return state.xp;
        },
        adjustXP(amount = 0, metadata = {}) {
            const delta = Math.round(Number(amount) || 0);
            if (!Number.isFinite(delta) || delta === 0) return state.xp;
            mutateLessonXP(delta, metadata);
            recomputeTotalXP();
            persist();
            return state.xp;
        },
        getLessonStatus(lessonId) {
            return state.lessons[lessonId] || 'not-started';
        },
        setLessonStatus(lessonId, status = 'not-started') {
            if (!lessonId) return;
            ensureLessonStructures(lessonId);
            state.lessons[lessonId] = status;
            persist();
        },
        resetLesson(lessonId) {
            if (!lessonId) return;
            ensureLessonStructures(lessonId);
            state.lessons[lessonId] = 'not-started';
            state.checkpoints[lessonId] = {};
            if (state.lessonXP && state.lessonXP[lessonId]) {
                delete state.lessonXP[lessonId];
            }
            recomputeTotalXP();
            persist();
        },
        markLessonComplete(lessonId) {
            if (!lessonId) return;
            ensureLessonStructures(lessonId);
            state.lessons[lessonId] = 'completed';
            persist();
        },
        getOverview() {
            const lessonIds = getTrackedLessonIds();
            const completedLessons = lessonIds.filter((lessonId) => state.lessons[lessonId] === 'completed').length;
            const totalLessons = lessonIds.length;
            const completionRate = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
            const quizStatuses = getQuizStatuses();
            const quizCompleted = Object.values(quizStatuses).filter((status) => status === 'completed').length;
            const quizTotal = Math.max(KNOWN_QUIZZES.length, Object.keys(quizStatuses).length);
            return {
                xp: state.xp,
                completed: completedLessons,
                total: totalLessons,
                completion: completionRate,
                quizzes: { ...state.quizScores },
                quizStatus: quizStatuses,
                quizTotals: {
                    completed: quizCompleted,
                    total: quizTotal
                }
            };
        },
        setCheckpoint(lessonId, checkpointId, value = true) {
            if (!lessonId || !checkpointId) return;
            ensureLessonStructures(lessonId);
            state.checkpoints[lessonId][checkpointId] = value;
            persist();
        },
        getCheckpoint(lessonId, checkpointId) {
            if (!lessonId || !checkpointId) return false;
            ensureLessonStructures(lessonId);
            return Boolean(state.checkpoints[lessonId][checkpointId]);
        },
        getCheckpoints(lessonId) {
            if (!lessonId) return {};
            ensureLessonStructures(lessonId);
            return { ...state.checkpoints[lessonId] };
        },
        setQuizScore(quizId, score = 0) {
            if (!quizId) return;
            const normalized = Math.max(0, Number(score) || 0);
            state.quizScores[quizId] = normalized;
            persist();
        },
        getQuizScore(quizId) {
            if (!quizId) return 0;
            return Number(state.quizScores[quizId]) || 0;
        },
        getQuizScores() {
            return { ...state.quizScores };
        },
        getLessonMap() {
            return { ...state.lessons };
        },
        reset() {
            resetAllState();
        },
        resetProgress() {
            resetAllState();
        }
    };

    window.ProgressTracker = ProgressTracker;

    window.AppProgress = {
        markLessonComplete: (lessonId) => ProgressTracker.markLessonComplete(lessonId),
        setLessonStatus: (lessonId, status) => ProgressTracker.setLessonStatus(lessonId, status),
        isLessonComplete: (lessonId) => ProgressTracker.getLessonStatus(lessonId) === 'completed',
        getLessonStatus: (lessonId) => ProgressTracker.getLessonStatus(lessonId),
        getLessonStatuses: () => ProgressTracker.getLessonMap(),
        addXP: (amount, metadata) => ProgressTracker.addXP(amount, metadata),
        adjustXP: (amount, metadata) => ProgressTracker.adjustXP(amount, metadata),
        getXP: () => ProgressTracker.getXP(),
        markQuizScore: (quizId, score) => ProgressTracker.setQuizScore(quizId, score),
        getQuizScore: (quizId) => ProgressTracker.getQuizScore(quizId),
        getQuizScores: () => ProgressTracker.getQuizScores(),
        getOverview: () => ProgressTracker.getOverview(),
        resetLesson: (lessonId) => ProgressTracker.resetLesson(lessonId),
        reset: () => ProgressTracker.reset(),
        resetProgress: () => ProgressTracker.resetProgress()
    };
})();
