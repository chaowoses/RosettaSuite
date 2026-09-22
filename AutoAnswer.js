(function() {
    const rawJson = prompt("Paste your JSON dictionary from the other script here:");
    if (!rawJson) return;
    const parsed = JSON.parse(rawJson);
    const vocab = parsed.vocab || (parsed.conjugations ? {} : parsed);
    const conjugations = parsed.conjugations || {};

    const allAnswers = [
        ...Object.values(vocab),
        ...Object.values(conjugations).flatMap(forms => Object.values(forms))
    ].filter(Boolean);

    const clean = (str) => {
        return str
            .replace(/^[0-9]+\.\s*/, '')
            .replace(/[\n\r\t]+/g, ' ')
            .split('/')[0]
            .trim();
    };

    const normalizePronoun = (label) => {
        const key = label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
        if (key === 'yo') return 'yo';
        if (key === 'tu' || key === 'vos') return 'tu';
        if (key === 'el' || key === 'ella' || key === 'usted') return 'el';
        if (key === 'nosotros' || key === 'nosotras') return 'nosotros';
        if (key === 'vosotros' || key === 'vosotras') return 'vosotros';
        if (key === 'ellos' || key === 'ellas' || key === 'ustedes') return 'ellos';
        return null;
    };

    const resolvePronounKey = (rawPronoun) => {
        const direct = normalizePronoun(rawPronoun);
        if (direct) return direct;

        const parts = rawPronoun.split(/\s+y\s+|\s*,\s*|\s+and\s+/i).map(p => p.trim()).filter(Boolean);
        if (parts.length > 1) {
            if (parts.some(p => normalizePronoun(p) === 'yo')) return 'nosotros';
            return 'ellos';
        }

        return 'el';
    };

    const getCorrectAnswer = () => {
        const questionEl = document.getElementById('question-input');
        const pronounEl = document.getElementById('pronoun-input');
        const verbEl = document.getElementById('verb-input');

        if (pronounEl && verbEl) {
            const verb = clean(verbEl.innerText);
            const pronounKey = resolvePronounKey(clean(pronounEl.innerText));
            return (conjugations[verb] && conjugations[verb][pronounKey]) || null;
        }
        if (questionEl) {
            return vocab[clean(questionEl.innerText)] || null;
        }
        return null;
    };

    const randomWrongAnswer = (correct) => {
        const pool = allAnswers.filter(a => a !== correct);
        if (!pool.length) return correct + 'x';
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // Exact deterministic mix of hits/misses, shuffled, so the final
    // score lands on the requested percentage rather than drifting.
    const buildAnswerPlan = (total, targetPercent) => {
        const correctCount = Math.round(total * targetPercent / 100);
        const plan = Array.from({ length: total }, (_, i) => i < correctCount);
        for (let i = plan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [plan[i], plan[j]] = [plan[j], plan[i]];
        }
        return plan;
    };

    const showSettingsModal = (onSubmit) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';

        const box = document.createElement('div');
        box.style.cssText = 'background:#fff;color:#111;padding:24px;border-radius:12px;min-width:280px;box-shadow:0 4px 24px rgba(0,0,0,0.3);';
        box.innerHTML = `
            <h2 style="margin:0 0 16px;font-size:18px;">Rosetta Suite — Auto Answer</h2>
            <label style="display:block;margin-bottom:8px;font-size:14px;">
                Target percent correct
                <input id="rs-percent" type="number" min="0" max="100" value="100" style="display:block;width:100%;margin-top:4px;padding:6px;box-sizing:border-box;">
            </label>
            <label style="display:block;margin-bottom:8px;font-size:14px;">
                Total questions to answer
                <input id="rs-total" type="number" min="1" value="50" style="display:block;width:100%;margin-top:4px;padding:6px;box-sizing:border-box;">
            </label>
            <label style="display:block;margin-bottom:16px;font-size:14px;">
                Delay between questions (ms)
                <input id="rs-delay" type="number" min="0" value="10" style="display:block;width:100%;margin-top:4px;padding:6px;box-sizing:border-box;">
            </label>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button id="rs-cancel" style="padding:8px 16px;border:none;border-radius:6px;background:#eee;cursor:pointer;">Cancel</button>
                <button id="rs-start" style="padding:8px 16px;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;">Start</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);
        box.querySelector('#rs-percent').focus();

        box.querySelector('#rs-cancel').addEventListener('click', () => overlay.remove());
        box.querySelector('#rs-start').addEventListener('click', () => {
            const percent = parseFloat(box.querySelector('#rs-percent').value);
            const total = parseInt(box.querySelector('#rs-total').value, 10);
            const delay = parseInt(box.querySelector('#rs-delay').value, 10);
            overlay.remove();

            if (isNaN(percent) || isNaN(total) || total <= 0 || isNaN(delay) || delay < 0) {
                alert('Rosetta Suite: invalid input, aborting.');
                return;
            }

            onSubmit(Math.max(0, Math.min(100, percent)), total, delay);
        });
    };

    const showStatusBadge = () => {
        const badge = document.createElement('div');
        badge.style.cssText = 'position:fixed;top:12px;right:12px;z-index:999999;background:#111;color:#fff;padding:8px 14px;border-radius:8px;font:13px sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.4);';
        document.body.appendChild(badge);
        return badge;
    };

    showSettingsModal((targetPercent, totalQuestions, delayMs) => {
        const plan = buildAnswerPlan(totalQuestions, targetPercent);
        const badge = showStatusBadge();

        let answered = 0;
        let correctSoFar = 0;
        let missCount = 0;
        let stopped = false;

        const stopListener = (e) => {
            if (e.key === 'Escape') {
                stopped = true;
            }
        };
        window.addEventListener('keydown', stopListener, true);

        const finish = (reason) => {
            window.removeEventListener('keydown', stopListener, true);
            badge.remove();
            alert(`Rosetta Suite: ${reason}\nAnswered ${answered}/${totalQuestions}, ${correctSoFar} correct (${answered ? Math.round(correctSoFar / answered * 100) : 0}%).`);
        };

        const waitForNextQuestion = (callback) => {
            const start = Date.now();
            const check = () => {
                if (stopped) return finish('stopped early');
                const inputField = document.getElementById('answer-input');
                if (inputField && inputField.value === '') {
                    callback();
                    return;
                }
                if (Date.now() - start > 5000) {
                    finish('timed out waiting for the next question');
                    return;
                }
                setTimeout(check, 40);
            };
            setTimeout(check, 40);
        };

        const submitOne = () => {
            if (stopped) return finish('stopped early');
            if (answered >= totalQuestions) return finish('done');

            const inputField = document.getElementById('answer-input');
            const correctAnswer = getCorrectAnswer();

            if (!inputField || !correctAnswer) {
                missCount++;
                if (missCount > 40) {
                    finish('gave up waiting for a recognizable question');
                    return;
                }
                setTimeout(submitOne, 75);
                return;
            }
            missCount = 0;

            const goCorrect = plan[answered];
            const answerToUse = goCorrect ? correctAnswer : randomWrongAnswer(correctAnswer);

            inputField.value = answerToUse;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));

            answered++;
            if (goCorrect) correctSoFar++;
            badge.textContent = `Rosetta Suite: ${answered}/${totalQuestions} (${correctSoFar} correct) — Esc to stop`;

            setTimeout(() => {
                // keyCode/which/charCode aren't set by the KeyboardEvent
                // constructor from `key` alone, and some Enter-to-submit
                // handlers still check the legacy numeric codes (and fire
                // on `keypress` instead of `keydown`), so send all three.
                const enterOpts = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, charCode: 13, bubbles: true, cancelable: true };
                inputField.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
                inputField.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
                inputField.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
                waitForNextQuestion(submitOne);
            }, delayMs);
        };

        badge.textContent = `Rosetta Suite: 0/${totalQuestions} (0 correct) — Esc to stop`;
        submitOne();
    });
})();
