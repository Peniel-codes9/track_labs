const { capitalize, reverse } = require('./stringTransform');

const reverseAndCapitalize = compose(capitalize, reverse);
// compose(capitalize, reverse)(x) === capitalize(reverse(x))
// so it reverses first, THEN capitalizes the result

const capitalizeAndReverse = pipe(capitalize, reverse);
// pipe(capitalize, reverse)(x) === reverse(capitalize(x))
// so it capitalizes first, THEN reverses the result

console.log(reverseAndCapitalize('hello world'));  // reverse -> "dlrow olleh", then capitalize -> "Dlrow olleh"
console.log(capitalizeAndReverse('hello world'));  // capitalize -> "Hello world", then reverse -> "dlrow olleH"

console.assert(
  reverseAndCapitalize('hello world') !== capitalizeAndReverse('hello world'),
  'compose and pipe should produce different orderings'
);

function compose(...fns) {
  // right-to-left: compose(f, g)(x) === f(g(x))
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

function pipe(...fns) {
  // left-to-right: pipe(f, g)(x) === g(f(x))
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

module.exports = { compose, pipe };

