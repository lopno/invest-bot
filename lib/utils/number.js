function getRandomNumber(array) {
  return Math.floor(Math.random() * array.length);
}

/**
 * Pads a number with 0's to a specified length
 * e.g. 13 with length of 4 becomes 0013
 * @param number
 * @param length
 * @returns {string}
 */
function padNumber(number, length) {
  var result = `${number}`; // eslint-disable-line no-var
  while (result.length < length) {
    result = `0${result}`;
  }
  return result;
}

/**
 * Returns the absolute percent-wise change between two numbers
 * @param oldNumber
 * @param newNumber
 * @returns {number}
 */
function getPercentageChange(oldNumber, newNumber) {
  return Math.abs(Math.round((1 - (oldNumber / newNumber)) * 10000) / 100);
}

/**
 * Checks if value is a number
 * @param number
 * @returns {boolean}
 */
function isNumber(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

module.exports = {
  getRandomNumber,
  padNumber,
  getPercentageChange,
  isNumber,
};
