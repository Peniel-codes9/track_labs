function capitalize(str) {
  if (typeof str !== 'string') return null; // reject anything that isn't a string
  if (str.length === 0) return str;          // empty string stays empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalize('hello'));     // "Hello"
console.log(capitalize(' hello'));    // " hello" (leading space untouched)
console.log(capitalize(''));          // ""
console.log(capitalize('h'));         // "H"

function reverse(str) {
  if (typeof str !== 'string') return null;
  /* split('').reverse().join('') breaks emoji/multi-byte characters because
   it splits by UTF-16 code unit, not by whole character — an emoji can be
   2 code units, so reversing scrambles it into broken halves.*/
  // Using the spread operator (...) respects full Unicode code points instead.
  return [...str].reverse().join('');
}

console.log(reverse('hello'));   // "olleh"
console.log(reverse(''));        // ""
console.log(reverse('a'));       // "a"

function isPalindrome(str) {
  if (typeof str !== 'string') return false; // always return a boolean, never crash
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ''); // strip punctuation/spaces, lowercase
  return cleaned === [...cleaned].reverse().join('');
}

console.log(isPalindrome('racecar'));                        // true
console.log(isPalindrome('A man, a plan, a canal: Panama'));  // true
console.log(isPalindrome('hello'));                           // false
console.log(isPalindrome(''));                                // true (empty string is technically a palindrome)

function wordCount(str) {
  if (typeof str !== 'string') return 0;
  const trimmed = str.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length; // \s+ collapses multiple spaces into one split point
}

function charCount(str) {
  if (typeof str !== 'string') return 0;
  return str.replace(/\s/g, '').length; // removes all whitespace, keeps punctuation
}

console.log(wordCount('hello world'));        // 2
console.log(wordCount('  hello   world  '));  // 2 (collapses extra spaces)
console.log(wordCount(''));                   // 0
console.log(charCount('hello world'));        // 10 (11 chars minus 1 space)
console.log(charCount('  hi  '));              // 2

module.exports = { capitalize, reverse, isPalindrome, wordCount, charCount };
