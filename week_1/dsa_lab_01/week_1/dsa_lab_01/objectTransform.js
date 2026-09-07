
function isValidPerson(obj, requiredKeys) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return false;
  // typeof null === "object" and typeof [] === "object" — both need explicit checks
  return requiredKeys.every(key => key in obj);
}

function fullName(person) {
  if (!isValidPerson(person, ['firstName', 'lastName'])) return null;
  return `${person.firstName.trim()} ${person.lastName.trim()}`;
}

console.log(isValidPerson({ firstName: 'A', lastName: 'B' }, ['firstName', 'lastName'])); // true
console.log(isValidPerson(null, ['firstName']));      // false
console.log(isValidPerson([], ['firstName']));        // false
console.log(isValidPerson({}, ['firstName']));        // false

console.log(fullName({ firstName: '  Jo ', lastName: ' Lee  ' })); // "Jo Lee"
console.log(fullName(null));  // null
console.log(fullName([]));    // null

function isAdult(person) {
  if (!isValidPerson(person, ['firstName', 'lastName', 'age', 'minAge'])) {
    return { granted: false, message: 'Invalid input.' };
  }
  const { firstName, lastName, age, minAge } = person;
  if (typeof age !== 'number' || typeof minAge !== 'number') {
    return { granted: false, message: 'Age and minAge must be numbers.' };
  }
  const granted = age >= minAge;
  return {
    granted,
    message: granted
      ? `${firstName} ${lastName} meets the minimum age requirement.`
      : `${firstName} ${lastName} does not meet the minimum age requirement.`
  };
}

console.log(isAdult({ firstName: 'Jo', lastName: 'Lee', age: 20, minAge: 18 }));
// { granted: true, message: 'Jo Lee meets the minimum age requirement.' }

console.log(isAdult({ firstName: 'Sam', lastName: 'Ray', age: 15, minAge: 18 }));
// { granted: false, message: 'Sam Ray does not meet the minimum age requirement.' }

console.log(isAdult(null));
// { granted: false, message: 'Invalid input.' }

console.log(isAdult({}));
// { granted: false, message: 'Invalid input.' }

module.exports = { isValidPerson, fullName, isAdult };
