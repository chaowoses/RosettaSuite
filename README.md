# Rosetta Suite — Conjuguemos Autofiller  

**Rosetta Suite** is a small browser script toolkit that automatically fills answers for **Conjuguemos graded practice** using the vocabulary from the lesson page. (i would rather write code than do Spanish homework)  

This works by extracting the vocabulary from the Conjuguemos lesson page and using it to autofill answers during graded practice.  

## How It Works
Rosetta Suite uses **two scripts**:
1. **[Vocabulary Fetcher](./VocabFetch.js)**
   - Runs on the Conjuguemos vocabulary chart page
   - Extracts the vocabulary table
   - Converts it into a dictionary


2. **[Practice Autofill](./AutoAnswer.js)**
   - Runs on the Conjuguemos graded practice page
   - Uses the dictionary to automatically fill answers

## Step-by-Step Usage
1. Go to the Vocabulary List Page
2. Run the Vocab Fetch script
3. Open your graded practice
4. Run the Auto Answer script
5. Paste the JSON from the Vocab List script into the prompt
6. Press enter when the box is empty to autofill the correct answer
7. Press enter when the box has text to submit the answer

## Bookmarklets  
Instead of opening the console and pasting scripts, you can create **bookmarklets** that run them automatically.  
Create a new bookmark and paste the following into the **URL field**.  

### Vocabulary Fetcher