(function() {
    const rawJson = prompt("Paste your JSON dictionary from the other script here:");
    if (!rawJson) return;
    const vocab = JSON.parse(rawJson);

    window.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const questionEl = document.getElementById('question-input');
            const inputField = document.getElementById('answer-input');

            if (questionEl && inputField) {
                const cleanQuestion = questionEl.innerText
                    .replace(/^[0-9]+\.\s*/, '')
                    .replace(/[\n\r\t]+/g, ' ')
                    .split('/')[0] 
                    .trim();

                const answer = vocab[cleanQuestion];

                if (answer && inputField.value === "") {
                    e.preventDefault();

                    inputField.value = answer;

                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));

                    console.log(`filled: ${answer}`);
                }
            }
        }
    }, true); 
    console.log("Rosetta Suite: Press enter when the form is blank to autofill. Otherwise, press enter to submit.");
})();