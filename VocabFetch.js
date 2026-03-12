(function() {
    const rows = document.querySelectorAll('.vocab-row, tr');
    const dictionary = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, .term, .definition');
        if (cells.length >= 2) {
            const clean = (str) => {
                return str
                    .replace(/^[0-9]+\.\s*/, '')
                    .replace(/[\n\r\t]+/g, ' ')
                    .split('/')[0]
                    .trim();
            };
            
            const key = clean(cells[0].innerText);
            const value = clean(cells[1].innerText);
            
            if (key && value) {
                dictionary[key] = value;
            }
        }
    });

    const json = JSON.stringify(dictionary);

    const textArea = document.createElement("textarea");
    textArea.value = json;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    alert("Vocabulary dictionary copied to clipboard! You can now paste it into the other script.");
})();