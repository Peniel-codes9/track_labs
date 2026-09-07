
# Lab 1 — JavaScript Transformation Toolkit

## What it does

This is a small library of pure utility functions split across four files: string transformations, array transformations, object transformations, and function composition. Every function is pure; no mutation of inputs, no I/O, no console logging as a substitute for actually returning a value.

## Files

- stringTransform.js — capitalize, reverse, isPalindrome, wordCount, charCount
- arrayTransform.js — isNumericArray, doubleArr, filterEven, sum, average
- objectTransform.js — isValidPerson, fullName, isAdult
- functionComposition.js — compose, pipe, plus a demo using reverseAndCapitalize and capitalizeAndReverse

## How to run it

Node 18+ required (I'm running Node 24). From this folder:

node stringTransform.js
node arrayTransform.js
node objectTransform.js
node functionComposition.js
Each file has its own test calls at the bottom that print results straight to the console.

## Design decisions

- **isNumericArray** is the one shared validator used by doubleArr, filterEven, sum, and average. It checks Array.isArray() plus that every single element is a finite number — not just arr[0], since checking only the first element would silently pass broken data like [1, "2", 3].
- **average([])** returns null instead of throwing or returning NaN. I picked null because it lets the function fail predictably without crashing the caller, while still making it obvious "no result" happened.
- **isValidPerson** explicitly rejects null and arrays before checking for required keys, because typeof null === "object" and typeof [] === "object" — a plain typeof obj === 'object' check would wrongly let bothisAdult **isAdult** returns a structured { granted, message } object instead of a sentence, so calling code can check .granted as a real boolean instead of trying to pareverse **reverse** uses [...str].reverse().join('') instead of str.split('').reverse().join(''). split('') breaks on UTF-16 code units, so multi-byte characters like emoji get split in half and come out corrupted. Spreading the string with ... respects full Unicode code points instead.

**wordCount** vs **charCount** answer different questions. wordCount counts whitespace-separated tokens ("words"), collapsing consecutive spaces so extra whitespace doesn't inflate the count. charCount counts individual visible characters, excluding all whitespace. It's "how many letters/symbols," not "how many words." E.g. "hi there" is 2 words but 7 characters.

## Task 16 — complexity answers

**sum(arr) — O(n) time.** It walks the array once via reduce to add everything up. One pass, no nesting, so it scales linearly with the array length.

**isPalindrome(str) — also O(n) time.** Cleaning the string (.replace, .toLowerCase) is O(n), and reversing it is O(n) too. They run one after another, not nested inside each other, so the total is still O(n) — the steps add, they don't multiply.

**Why filterEven allocates O(n) additional space.** .filter() never touches the original array — it builds and returns a brand new array with just the matching elements. Worst case, if every number in the input is even, that new array ends up the same size as the input, so it needs its own O(n) chunk of memory on top of what the original array already used.

## Known limitations

- Validation functions return null or false on bad input rather than throwing — that was a deliberate contract choice, not an oversight.
- No automated test framework (Jest, etc.) is wired up — verification is via the console.log/console.assert calls at the bottom of each file.