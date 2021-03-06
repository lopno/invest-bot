const numberUtils = require('./number');

function isDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]';
}

function getWeekDay(integer) {
  switch (integer) {
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    default: return '';
  }
}

/**
 * Formats date into ISO-8601 formatted string
 * @param date
 * @returns {string}
 */
function formatDateToIso8601(date) {
  return isDate(date)
    ? `${date.getFullYear()}-${numberUtils.padNumber(date.getMonth() + 1, 2)}-${numberUtils.padNumber(date.getDate(), 2)}`
    : null;
}

/**
 * Return string of format dd/MM, d/MM or dd/M
 * Returns string if date is not a date
 * @param date
 * @returns {*}
 */
function formatDateToShortFormat(date) {
  return isDate(date)
    ? `${date.getDate()}/${date.getMonth() + 1}`
    : null;
}

module.exports = {
  isDate,
  getWeekDay,
  formatDateToIso8601,
  formatDateToShortFormat,
};
