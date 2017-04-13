const fundType = require('./../constant/fundType');
const valuationApi = require('./../api/valuation');
const fundSquareValuationParser = require('./../parse/fundSquareValuation');
const database = require('../database/database');

/* global Promise */

function getSite(type) {
  switch (type) {
    case fundType.defensive: return valuationApi.getJuneDefensiveSite;
    case fundType.moderateShort: return valuationApi.getJuneModerateShortSite;
    case fundType.moderate: return valuationApi.getJuneModerateSite;
    case fundType.balanced: return valuationApi.getJuneBalancedSite;
    case fundType.progressive: return valuationApi.getJuneProgressiveSite;
    case fundType.opportunity: return valuationApi.getJuneOpportunitySite;
    default: return null;
  }
}

function getValuation(type) {
  var valueAlreadyInDatabase;
  return database.getLatestValuations(2)
    .then(valuations => {
      // Are there two valuations and is the latest one from today
      if (valuations
        && valuations.length === 2
        && valuations[0][type] !== null && valuations[0][type] !== undefined
        && valuations[1][type] !== null && valuations[1][type] !== undefined
        && valuations[0].date
        && valuations[0].date.getDay() === new Date().getDay()
      ) {
        valueAlreadyInDatabase = true;
        return {
          value: valuations[0][type],
          previousValue: valuations[1][type],
          change: Math.abs(valuations[0][type] - valuations[1][type]),
          isPositive: valuations[0][type] >= valuations[1][type],
          date: valuations[0].date,
        }
      }
      const getSiteFunction = getSite(type);
      return getSiteFunction ? getSiteFunction()
        .then(fundSquareValuationParser.parseFundSquareValuationSite) : Promise.resolve();
    })
    .then((valuation) =>
      Promise.all([
        valuation,
        !valueAlreadyInDatabase && valuation.date.getDay() === new Date().getDay()
          ? database.saveValuation(valuation.date, type, valuation.value)
          : null
      ])
    )
    .then((results) => results[0]);
}

module.exports = {
  getSite,
  getValuation,
};
