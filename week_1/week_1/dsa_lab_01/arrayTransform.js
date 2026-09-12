function isNumericArray(arr) {
  return Array.isArray(arr) && arr.every(el => typeof el === 'number' && Number.isFinite(el));
}

function doubleArr(arr) {
  if (!isNumericArray(arr)) return null;
  return arr.map(n => n * 2); // .map returns a NEW array, original untouched
}

console.log(isNumericArray([1, 2, 3]));      // true
console.log(isNumericArray([1, '2', 3]));    // false
console.log(isNumericArray(['a']));          // false
console.log(isNumericArray(null));           // false
console.log(isNumericArray(undefined));      // false
console.log(isNumericArray({}));             // false
console.log(isNumericArray('123'));          // false
console.log(isNumericArray([]));             // true
console.log(isNumericArray([0, -4, 2.5]));   // true

console.log(doubleArr([1, 2, 3]));  // [2, 4, 6]

function filterEven(arr) {
  if (!isNumericArray(arr)) return null;
  return arr.filter(n => n % 2 === 0); // 0 % 2 === 0, so 0 is included correctly
}

function sum(arr) {
  if (!isNumericArray(arr)) return null;
  return arr.reduce((total, n) => total + n, 0); // starting at 0 means empty array returns 0
}

function average(arr) {
  if (!isNumericArray(arr)) return null;
  if (arr.length === 0) return null; // documented contract: empty array -> null, not NaN
  return sum(arr) / arr.length;
}
console.log(filterEven([0, 2, 3]));   // [0, 2]
console.log(filterEven([1, 3, 5]));   // []

console.log(sum([1, 2, 3]));   // 6
console.log(sum([]));          // 0

console.log(average([2, 4, 6]));  // 4
console.log(average([]));         // null

module.exports = { isNumericArray, doubleArr, filterEven, sum, average };
