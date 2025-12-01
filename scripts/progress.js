(function () {
    const STORAGE_KEY = 'aiLiteracyProgress_v1';
    const DEFAULT_STATE = {
        xp: 0,
        lessons: {},
        checkpoints: {}
    };

    function cloneDefault() {
        return {
            xp: DEFAULT_STATE.xp,
            lessons: { ...DEFAULT_STATE.lessons },
            checkpoints: { ...DEFAULT_STATE.checkpoints }
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
                checkpoints: typeof parsed.checkpoints === 'object' && parsed.checkpoints ? parsed.checkpoints : {}
            };
        } catch (error) {
            console.warn('[ProgressTracker] Failed to parse progress payload.', error);
            return cloneDefault();
        }
    }

    let state = loadState();

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
            const statuses = Object.values(state.lessons);
            const totalLessons = statuses.length;
            const completedLessons = statuses.filter((status) => status === 'completed').length;
            const completionRate = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                xp: state.xp,
                completed: completedLessons,
                total: totalLessons,
                completion: completionRate
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
        reset() {
            state = cloneDefault();
            persist();
        }
    };

    window.ProgressTracker = ProgressTracker;
})();
