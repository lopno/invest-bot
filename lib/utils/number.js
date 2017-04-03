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

module.exports = {
  getRandomNumber,
  padNumber,
};
