(function() {
    const dictionary = {};
    const conjugations = {};
    const commands = {};

    const clean = (str) => {
        return str
            .replace(/^[0-9]+\.\s*/, '')
            .split(/[\n\r]+/)[0]
            .replace(/\t+/g, ' ')
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
        const commandForms = {};

        card.querySelectorAll('table').forEach(table => {
            const headerLabels = Array.from(table.querySelectorAll('thead td, thead th'))
                .map(cell => clean(cell.innerText).toLowerCase());
            // Command tables have one pronoun per row plus separate
            // positive/negative columns, instead of the usual two
            // pronoun+form pairs per row, so they need their own pass.
            const isCommandTable = headerLabels.includes('positive') && headerLabels.includes('negative');

            if (isCommandTable) {
                table.querySelectorAll('tbody tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 3) return;
                    const pronoun = normalizePronoun(clean(cells[0].innerText));
                    const positive = clean(cells[1].innerText);
                    const negative = clean(cells[2].innerText);
                    if (!pronoun) return;
                    commandForms[pronoun] = commandForms[pronoun] || {};
                    if (positive) commandForms[pronoun].positive = positive;
                    if (negative) commandForms[pronoun].negative = negative;
                });
                return;
            }

            table.querySelectorAll('tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                for (let i = 0; i + 1 < cells.length; i += 2) {
                    const pronoun = normalizePronoun(clean(cells[i].innerText));
                    const form = clean(cells[i + 1].innerText);
                    if (pronoun && form) {
                        forms[pronoun] = form;
                    }
                }
            });
        });

        if (Object.keys(forms).length) {
            conjugations[infinitive] = forms;
        }
        if (Object.keys(commandForms).length) {
            commands[infinitive] = commandForms;
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

    const payload = { vocab: dictionary, conjugations, commands };
    const json = JSON.stringify(payload);

    const textArea = document.createElement("textarea");
    textArea.value = json;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    alert("Vocabulary dictionary copied to clipboard! You can now paste it into the other script.");
})();
