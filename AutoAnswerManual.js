(function() {
    const rawJson = prompt("Paste your JSON dictionary from the other script here:");
    if (!rawJson) return;
    const parsed = JSON.parse(rawJson);
    const vocab = parsed.vocab || (parsed.conjugations ? {} : parsed);
    const conjugations = parsed.conjugations || {};

    const clean = (str) => {
        return str
            .replace(/^[0-9]+\.\s*/, '')
            .replace(/[\n\r\t]+/g, ' ')
            .split('/')[0]
            .trim();
    };

    // Regular verb forms for él/ella/usted are identical, and likewise for
    // ellos/ellas/ustedes, so both collapse into one bucket each.
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

    // Conjuguemos sometimes swaps a real pronoun for a stand-in subject
    // (e.g. "Pablo" for "él", "Pablo y yo" for "nosotros"). A single name
    // is treated as third-person singular; compound subjects fall back to
    // nosotros/ellos based on whether "yo" is one of the people involved.
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

    window.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;

        const inputField = document.getElementById('answer-input');
        if (!inputField || inputField.value !== "") return;

        const questionEl = document.getElementById('question-input');
        const pronounEl = document.getElementById('pronoun-input');
        const verbEl = document.getElementById('verb-input');

        let answer = null;

        if (pronounEl && verbEl) {
            const verb = clean(verbEl.innerText);
            const pronounKey = resolvePronounKey(clean(pronounEl.innerText));
            answer = conjugations[verb] && conjugations[verb][pronounKey];
        } else if (questionEl) {
            const cleanQuestion = clean(questionEl.innerText);
            answer = vocab[cleanQuestion];
        }

        if (answer) {
            e.preventDefault();

            inputField.value = answer;

            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));

            console.log(`filled: ${answer}`);
        }
    }, true);

    console.log("Rosetta Suite: Press enter when the form is blank to autofill. Otherwise, press enter to submit.");
})();
