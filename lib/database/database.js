const pgp = require('pg-promise')();
const dateUtils = require('../utils/date');

const db = pgp(`${process.env.DATABASE_URL}?ssl=true`);

function getValuation(date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return null;
  }

  const formattedDate = dateUtils.formatDateToIso8601(date);

  return db.oneOrNone('select * from valuation where date=$1', [formattedDate])
    .then((data) => { // eslint-disable-line arrow-body-style
      return data ? {
        date: data.date,
        defensive: data.defensive,
        moderateShort: data.moderate_short,
        moderate: data.moderate,
        balanced: data.balanced,
        progressive: data.progressive,
        opportunity: data.opportunity,
      } : null;
    })
    .catch((error) => {
      throw new Error(`Database error while trying to select valuation for date ${formattedDate}: ${error.message}`);
    });
}

module.exports = {
  getValuation,
};
