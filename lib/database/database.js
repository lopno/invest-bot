const pgp = require('pg-promise')();
const dateUtils = require('../utils/date');
const fundTypes = require('../constant/fundType');

const db = pgp(`${process.env.DATABASE_URL}?ssl=true`);

function getColumnForFundType(fundType) {
  switch (fundType) {
    case fundTypes.defensive: return 'defensive';
    case fundTypes.moderateShort: return 'moderate_short';
    case fundTypes.moderate: return 'moderate';
    case fundTypes.balanced: return 'balanced';
    case fundTypes.progressive: return 'progressive';
    case fundTypes.opportunity: return 'opportunity';
    default: return null;
  }
}

// TODO: ensure that fund types correspond to constant/fundType somehow
function formatRow(row) {
  return row ? {
    date: row.date,
    defensive: row.defensive,
    moderateShort: row.moderate_short,
    moderate: row.moderate,
    balanced: row.balanced,
    progressive: row.progressive,
    opportunity: row.opportunity
  } : null;
}

function getValuation(date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return null;
  }
  const formattedDate = dateUtils.formatDateToIso8601(date);
  return db.oneOrNone('select * from valuation where date=$1;', [formattedDate])
    .then((data) => { // eslint-disable-line arrow-body-style
      return data
        ? formatRow(date)
        : null;
    })
    .catch((error) => {
      throw new Error(`Database error while trying to select valuation for date ${formattedDate}: ${error.message}`);
    });
}

function getLatestValuations(count) {
  const numberOfRows = Number.isInteger(count) && count > 0 && count;

  return numberOfRows
    ? db.manyOrNone('select * from valuation order by date desc limit $1;', [numberOfRows])
      .then(rows => rows.map(formatRow))
    : null;
}

function saveValuation(date, fundType, valuation) {
  if (!dateUtils.isDate(date)) {
    throw new Error(`Invalid date ${date} supplied when trying to update fundType ${fundType} with valuation ${valuation}`);
  }
  const formattedDate = dateUtils.formatDateToIso8601(date);
  const fundColumn = getColumnForFundType(fundType);
  if (!fundColumn) {
    throw new Error(`Invalid fundType ${fundType} supplied when trying to update valuation`);
  }
  return db.tx(t =>
    return t.oneOrNone('select * from valuation where date = $1', [formattedDate])
      .then(valuationData => valuationData
          ? t.none(
        'update valuation set $1~ = $2, updated_at = now() where id = $3',
        [fundColumn, valuation, valuationData.id]
        )
          : t.none(
        'insert into valuation (date, $1) values ($2, $3)',
        [fundColumn, formattedDate, valuation]
      ))
  )
    .catch((error) => {
      throw new Error(`Database error while trying to save valuation for date ${formattedDate}, fundType ${fundType}, valuation ${valuation}: ${error.message}`);
    });
}

module.exports = {
  getValuation,
  saveValuation,
  getLatestValuations
};
