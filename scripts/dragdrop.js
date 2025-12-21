(function () {
    const DEFAULT_ATTEMPTS = 3;

    function ensureArray(val) {
        return Array.isArray(val) ? val : [val];
    }

    function createChipElement(chip) {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'dd-chip';
        el.draggable = true;
        el.textContent = chip.label;
        el.dataset.chipId = chip.id;
        el.setAttribute('aria-label', chip.label);
        return el;
    }

    function createSlotElement(slot) {
        const el = document.createElement('div');
        el.className = 'dd-slot';
        el.dataset.slotId = slot.id;
        el.dataset.correctChip = slot.correct;
        el.setAttribute('role', 'group');
        el.setAttribute('aria-label', slot.label || 'Drop zone');

        const label = document.createElement('div');
        label.className = 'dd-slot-label';
        label.textContent = slot.label || 'Slot';

        const target = document.createElement('div');
        target.className = 'dd-slot-target';
        target.textContent = 'Drop here';

        el.appendChild(label);
        el.appendChild(target);
        return el;
    }

    function setLiveMessage(liveRegion, message) {
        if (!liveRegion) return;
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message || '';
        }, 20);
    }

    function initDragDropActivity(config = {}) {
        const {
            containerId,
            activityId,
            lessonId = 'lesson5',
            prompt,
            chips = [],
            slots = [],
            attempts = DEFAULT_ATTEMPTS,
            xp = 12,
            hint = null
        } = config;

        const container = document.getElementById(containerId);
        if (!container) return;

        const state = {
            assignments: {},
            attempts: 0,
            completed: false,
            xpAwarded: false
        };

        container.classList.add('dd-wrapper');

        const header = document.createElement('div');
        header.className = 'dd-header';
        const title = document.createElement('h3');
        title.textContent = prompt || 'Arrange the workflow';
        const hintEl = document.createElement('p');
        hintEl.className = 'dd-hint';
        hintEl.textContent = hint || 'Drag steps into the correct order. You have limited attempts.';
        header.appendChild(title);
        header.appendChild(hintEl);

        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');

        const bank = document.createElement('div');
        bank.className = 'dd-bank';
        bank.setAttribute('aria-label', 'Available steps');

        const slotsWrap = document.createElement('div');
        slotsWrap.className = 'dd-slots';

        const controls = document.createElement('div');
        controls.className = 'dd-controls';
        const status = document.createElement('div');
        status.className = 'dd-status';
        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = 'btn btn-primary';
        checkBtn.textContent = 'Check answer';
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn btn-secondary';
        resetBtn.textContent = 'Reset';
        controls.appendChild(status);
        controls.appendChild(checkBtn);
        controls.appendChild(resetBtn);

        container.appendChild(header);
        container.appendChild(liveRegion);
        container.appendChild(bank);
        container.appendChild(slotsWrap);
        container.appendChild(controls);

        const chipMap = new Map();
        chips.forEach((chip) => {
            const el = createChipElement(chip);
            bank.appendChild(el);
            chipMap.set(chip.id, el);
        });

        const slotMap = new Map();
        slots.forEach((slot) => {
            const el = createSlotElement(slot);
            slotsWrap.appendChild(el);
            slotMap.set(slot.id, el);
        });

        function clearAssignments() {
            state.assignments = {};
            slotMap.forEach((slotEl) => {
                slotEl.classList.remove('dd-slot-correct', 'dd-slot-incorrect');
                const target = slotEl.querySelector('.dd-slot-target');
                target.textContent = 'Drop here';
                target.dataset.chipId = '';
            });
            chipMap.forEach((chipEl) => {
                chipEl.disabled = false;
                chipEl.classList.remove('dd-chip-placed');
                bank.appendChild(chipEl);
            });
        }

        function setSlotChip(slotEl, chipEl) {
            const target = slotEl.querySelector('.dd-slot-target');
            if (!target || !chipEl) return;

            const existingChipId = target.dataset.chipId;
            if (existingChipId && chipMap.has(existingChipId)) {
                const existing = chipMap.get(existingChipId);
                existing.classList.remove('dd-chip-placed');
                bank.appendChild(existing);
            }

            target.textContent = chipEl.textContent;
            target.dataset.chipId = chipEl.dataset.chipId;
            chipEl.classList.add('dd-chip-placed');
            slotEl.classList.remove('dd-slot-correct', 'dd-slot-incorrect');
        }

        function handleDrop(slotEl, chipId) {
            const chipEl = chipMap.get(chipId);
            if (!chipEl || chipEl.disabled || state.completed) return;
            setSlotChip(slotEl, chipEl);
        }

        function handleCheck() {
            if (state.completed) return;

            const missing = [];
            slotMap.forEach((slotEl, slotId) => {
                const chipId = slotEl.querySelector('.dd-slot-target')?.dataset?.chipId;
                if (!chipId) missing.push(slotId);
            });
            if (missing.length) {
                status.textContent = 'Fill every slot before checking.';
                setLiveMessage(liveRegion, 'Fill every slot before checking');
                return;
            }

            let correctCount = 0;
            slotMap.forEach((slotEl) => {
                const target = slotEl.querySelector('.dd-slot-target');
                const chosen = target?.dataset?.chipId;
                const expected = slotEl.dataset.correctChip;
                if (chosen && ensureArray(expected).includes(chosen)) {
                    correctCount += 1;
                    slotEl.classList.add('dd-slot-correct');
                    slotEl.classList.remove('dd-slot-incorrect');
                } else {
                    slotEl.classList.add('dd-slot-incorrect');
                    slotEl.classList.remove('dd-slot-correct');
                }
            });

            const total = slots.length;
            const allCorrect = correctCount === total;
            state.attempts += 1;

            if (allCorrect) {
                status.textContent = 'Nice! You assembled the workflow.';
                setLiveMessage(liveRegion, 'Correct workflow.');
                state.completed = true;
                checkBtn.disabled = true;
                resetBtn.disabled = true;

                try {
                    const tracker = window.ProgressTracker || null;
                    const app = window.AppProgress || tracker;
                    if (tracker && activityId) {
                        tracker.setCheckpoint(lessonId, activityId, true);
                    }
                    if (!state.xpAwarded && app && typeof app.addXP === 'function') {
                        const totalXP = app.addXP(xp, { source: 'dragdrop', lessonId });
                        state.xpAwarded = true;
                        if (window.Rewards && typeof window.Rewards.showReward === 'function') {
                            window.Rewards.showReward(xp, `+${xp} XP earned!`, { credit: false });
                        }
                        if (window.emitXPEvent) {
                            window.emitXPEvent({ delta: xp, total: totalXP, source: 'dragdrop', lessonId });
                        }
                    } else if (!state.xpAwarded && typeof window.updateXP === 'function') {
                        window.updateXP(xp, { source: 'dragdrop', lessonId });
                        state.xpAwarded = true;
                    }
                } catch (err) {
                    console.warn('[dragdrop] XP/Progress update failed', err);
                }
            } else {
                const remaining = Math.max(0, attempts - state.attempts);
                status.textContent = `Not quite. ${correctCount}/${total} correct. Attempts left: ${remaining}.`;
                setLiveMessage(liveRegion, `Incorrect. ${remaining} attempts left.`);
                if (state.attempts >= attempts) {
                    checkBtn.disabled = true;
                    status.textContent = 'Attempts used. See the answer highlighted in red/green.';
                    slotMap.forEach((slotEl) => {
                        const expected = slotEl.dataset.correctChip;
                        const target = slotEl.querySelector('.dd-slot-target');
                        const chosen = target?.dataset?.chipId;
                        if (!target) return;
                        if (!chosen && expected && chipMap.has(expected)) {
                            target.textContent = chipMap.get(expected).textContent;
                        }
                    });
                }
            }
        }

        function handleReset() {
            if (state.completed) return;
            clearAssignments();
            state.attempts = 0;
            status.textContent = 'Reset. Try again.';
            checkBtn.disabled = false;
        }

        bank.addEventListener('dragstart', (event) => {
            const chipId = event.target?.dataset?.chipId;
            if (!chipId) return;
            event.dataTransfer.setData('text/plain', chipId);
        });

        slotsWrap.addEventListener('dragstart', (event) => {
            const chipId = event.target?.dataset?.chipId;
            if (!chipId) return;
            event.dataTransfer.setData('text/plain', chipId);
        });

        slotsWrap.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        slotsWrap.addEventListener('drop', (event) => {
            event.preventDefault();
            const slotEl = event.target.closest('.dd-slot');
            const chipId = event.dataTransfer.getData('text/plain');
            if (slotEl && chipId) {
                handleDrop(slotEl, chipId);
            }
        });

        bank.addEventListener('click', (event) => {
            const chipEl = event.target.closest('.dd-chip');
            if (!chipEl || state.completed) return;
            const selected = bank.dataset.selectedChip;
            if (!selected) {
                bank.dataset.selectedChip = chipEl.dataset.chipId;
                chipEl.classList.add('dd-chip-selected');
            } else {
                bank.dataset.selectedChip = '';
                chipMap.forEach((c) => c.classList.remove('dd-chip-selected'));
            }
        });

        slotsWrap.addEventListener('click', (event) => {
            const slotEl = event.target.closest('.dd-slot');
            if (!slotEl || state.completed) return;
            const selected = bank.dataset.selectedChip;
            if (selected) {
                chipMap.forEach((c) => c.classList.remove('dd-chip-selected'));
                bank.dataset.selectedChip = '';
                handleDrop(slotEl, selected);
            }
        });

        checkBtn.addEventListener('click', handleCheck);
        resetBtn.addEventListener('click', handleReset);

        // Initialize
        clearAssignments();
    }

    window.initDragDropActivity = initDragDropActivity;
})();
