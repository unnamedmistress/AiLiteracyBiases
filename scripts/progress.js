(function () {
    const STORAGE_KEY = 'aiLiteracyProgress_v1';
    const KNOWN_LESSONS = ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'];
    const DEFAULT_STATE = {
        xp: 0,
        lessons: {},
        checkpoints: {},
        quizScores: {}
    };

    function cloneDefault() {
        return {
            xp: DEFAULT_STATE.xp,
            lessons: { ...DEFAULT_STATE.lessons },
            checkpoints: { ...DEFAULT_STATE.checkpoints },
            quizScores: { ...DEFAULT_STATE.quizScores }
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
                quizScores: typeof parsed.quizScores === 'object' && parsed.quizScores ? parsed.quizScores : {}
            };
        } catch (error) {
            console.warn('[ProgressTracker] Failed to parse progress payload.', error);
            return cloneDefault();
        }
    }

    let state = loadState();

    function getTrackedLessonIds() {
        const ids = new Set([...KNOWN_LESSONS, ...Object.keys(state.lessons || {})]);
        return Array.from(ids);
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('[ProgressTracker] Unable to persist progress state.', error);
        }
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
        addXP(amount = 0) {
            const delta = Number(amount);
            if (!Number.isFinite(delta) || delta <= 0) return state.xp;
            state.xp += Math.round(delta);
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
            return {
                xp: state.xp,
                completed: completedLessons,
                total: totalLessons,
                completion: completionRate,
                quizzes: { ...state.quizScores }
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
            state = cloneDefault();
            persist();
        }
    };

    window.ProgressTracker = ProgressTracker;

    window.AppProgress = {
        markLessonComplete: (lessonId) => ProgressTracker.markLessonComplete(lessonId),
        setLessonStatus: (lessonId, status) => ProgressTracker.setLessonStatus(lessonId, status),
        isLessonComplete: (lessonId) => ProgressTracker.getLessonStatus(lessonId) === 'completed',
        getLessonStatus: (lessonId) => ProgressTracker.getLessonStatus(lessonId),
        getLessonStatuses: () => ProgressTracker.getLessonMap(),
        addXP: (amount) => ProgressTracker.addXP(amount),
        getXP: () => ProgressTracker.getXP(),
        markQuizScore: (quizId, score) => ProgressTracker.setQuizScore(quizId, score),
        getQuizScore: (quizId) => ProgressTracker.getQuizScore(quizId),
        getQuizScores: () => ProgressTracker.getQuizScores(),
        getOverview: () => ProgressTracker.getOverview(),
        reset: () => ProgressTracker.reset()
    };
})();
