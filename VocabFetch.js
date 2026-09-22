(function() {
    const dictionary = {};
    const conjugations = {};

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

    // Verb conjugation cards
    document.querySelectorAll('.verb-card').forEach(card => {
        const infinitive = clean(card.querySelector('h4.font-bold')?.innerText || '');
        if (!infinitive) return;

        const translation = card.querySelector('.table-title .flex p:last-child')?.innerText;
        if (translation) {
            dictionary[infinitive] = clean(translation);
        }

        const forms = {};
        card.querySelectorAll('table tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            for (let i = 0; i + 1 < cells.length; i += 2) {
                const pronoun = normalizePronoun(clean(cells[i].innerText));
                const form = clean(cells[i + 1].innerText);
                if (pronoun && form) {
                    forms[pronoun] = form;
                }
            }
        });

        if (Object.keys(forms).length) {
            conjugations[infinitive] = forms;
        }
    });

    // Plain vocab tables (skip rows that belong to a verb-card)
    document.querySelectorAll('.vocab-row, tr').forEach(row => {
        if (row.closest('.verb-card')) return;

        const cells = row.querySelectorAll('td, .term, .definition');
        if (cells.length >= 2) {
            const key = clean(cells[0].innerText);
            const value = clean(cells[1].innerText);

            if (key && value) {
                dictionary[key] = value;
            }
        }
    });

    const payload = { vocab: dictionary, conjugations };
    const json = JSON.stringify(payload);

    const textArea = document.createElement("textarea");
    textArea.value = json;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    alert("Vocabulary dictionary copied to clipboard! You can now paste it into the other script.");
})();
