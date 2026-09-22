
# Rosetta Suite — Conjuguemos Autofiller

  

**Rosetta Suite** is a small browser script toolkit that automatically fills answers for **Conjuguemos graded practice**, using data scraped from the lesson's reference page.

  

It supports two kinds of Conjuguemos lessons:

-  **Vocabulary lists** — term/definition pairs (e.g. `advertir → to warn`)

-  **Verb conjugation charts** — a verb's full conjugation table (`yo`, `tú`, `él/ella/usted`, `nosotros`, `vosotros`, `ellos/ellas/ustedes`)

  

## How It Works

Rosetta Suite uses **three scripts**:

  

1.  **[Vocabulary Fetcher](./VocabFetch.js)**

- Runs on the Conjuguemos lesson reference page (vocab list or verb conjugation chart)

- Extracts every vocab pair and every verb-card conjugation table it can find

- Copies the result to your clipboard as JSON: `{ "vocab": {...}, "conjugations": {...} }`

  

2.  **[Auto Answer](./AutoAnswer.js)**

- Runs on the Conjuguemos graded practice page

- Asks you to paste the JSON from step 1, then pops up a small UI asking for a **target percent correct**, a **total number of questions**, and a **delay between questions**

- Fully automatic — answers that many questions back-to-back with a deterministic, shuffled mix of right/wrong answers landing on your target percentage, then stops and reports the final tally

- Press **Esc** at any time to stop early

  

3.  **[Auto Answer Manual](./AutoAnswerManual.js)**

- Runs on the Conjuguemos graded practice page, same as Auto Answer

- Asks you to paste the JSON from step 1

- Watches the answer box and, when you press Enter on an empty answer, fills in the correct answer — matching either a vocab question (`#question-input`) or a conjugation prompt (`#pronoun-input` + `#verb-input`)

- Manual/interactive — you press Enter yourself for each question


  

## Step-by-Step Usage

1. Open the lesson's reference page (vocab list **or** verb conjugation chart).

2. Run the **Vocab Fetch** script (via console or bookmarklet). You'll see an alert once the dictionary is copied to your clipboard.

3. Open the matching **graded practice** activity.

4. Run either **Auto Answer** or **Auto Answer Manual** (via console or bookmarklet), depending on how hands-on you want to be:
   - **Auto Answer**: paste the JSON, set a target percent correct, a question count, and a delay in the popup, and it runs the whole batch itself, then stops.
   - **Auto Answer Manual**: paste the JSON, then press **Enter** on an empty answer box to autofill, and **Enter** again to submit — you're still doing the clicking/pacing.

  

## Bookmarklets

Instead of opening the console and pasting scripts, you can create **bookmarklets** that run them automatically.

Create a new bookmark and paste the following into the **URL field**.


### Vocabulary Fetcher

```javascript

javascript: fetch("https://raw.githubusercontent.com/chaowoses/RosettaSuite/refs/heads/main/VocabFetch.js?t=" + Date.now()).then(r  =>  r.text()).then(r  =>  eval(r))

```

  

### Auto Answer

```javascript

javascript: fetch("https://raw.githubusercontent.com/chaowoses/RosettaSuite/refs/heads/main/AutoAnswer.js?t=" + Date.now()).then(r  =>  r.text()).then(r  =>  eval(r))

```

  

## Troubleshooting

If something doesn't work, [open an issue](https://github.com/chaowoses/RosettaSuite/issues) or email **chaos@chaowoses.dev**.