
# Rosetta Suite — Conjuguemos Autofiller

  

**Rosetta Suite** is a small browser script toolkit that automatically fills answers for **Conjuguemos graded practice**, using data scraped from the lesson's reference page.

  

It supports two kinds of Conjuguemos lessons:

-  **Vocabulary lists** — term/definition pairs (e.g. `advertir → to warn`)

-  **Verb conjugation charts** — a verb's full conjugation table (`yo`, `tú`, `él/ella/usted`, `nosotros`, `vosotros`, `ellos/ellas/ustedes`)

  

## How It Works

Rosetta Suite uses **two scripts**:

  

1.  **[Vocabulary Fetcher](./VocabFetch.js)**

- Runs on the Conjuguemos lesson reference page (vocab list or verb conjugation chart)

- Extracts every vocab pair and every verb-card conjugation table it can find

- Copies the result to your clipboard as JSON: `{ "vocab": {...}, "conjugations": {...} }`

  

2.  **[Auto Answer](./AutoAnswer.js)**

- Runs on the Conjuguemos graded practice page

- Asks you to paste the JSON from step 1

- Watches the answer box and, when you press Enter on an empty answer, fills in the correct answer — matching either a vocab question (`#question-input`) or a conjugation prompt (`#pronoun-input` + `#verb-input`)


  

## Step-by-Step Usage

1. Open the lesson's reference page (vocab list **or** verb conjugation chart).

2. Run the **Vocab Fetch** script (via console or bookmarklet). You'll see an alert once the dictionary is copied to your clipboard.

3. Open the matching **graded practice** activity.

4. Run the **Auto Answer** script (via console or bookmarklet).

5. Paste the JSON copied in step 2 into the prompt.

6. Press **Enter** on an empty answer box to autofill the correct answer.

7. Press **Enter** again (box now has text) to submit it normally.

  

## Bookmarklets

Instead of opening the console and pasting scripts, you can create **bookmarklets** that run them automatically.

Create a new bookmark and paste the following into the **URL field**.


### Vocabulary Fetcher

```javascript

javascript: fetch("https://raw.githubusercontent.com/Chaos142/RosettaSuite/refs/heads/main/VocabFetch.js?t=" + Date.now()).then(r  =>  r.text()).then(r  =>  eval(r))

```

  

### Auto Answer

```javascript

javascript: fetch("https://raw.githubusercontent.com/Chaos142/RosettaSuite/refs/heads/main/AutoAnswer.js?t=" + Date.now()).then(r  =>  r.text()).then(r  =>  eval(r))

```

  

## Troubleshooting

If something doesn't work, [open an issue](https://github.com/Chaos142/RosettaSuite/issues) or email **chaos@chaowoses.dev**.