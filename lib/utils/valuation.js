const includes = require('array-includes');
const fundTypes = require('./../constant/fundType');
const valuationApi = require('./../api/valuation');
const fundSquareValuationParser = require('./../parse/fundSquareValuation');
const database = require('../database/database');
const numberUtils = require('../utils/number');

/* global Promise */

function getSite(type) {
  switch (type) {
    case fundTypes.defensive: return valuationApi.getJuneDefensiveSite;
    case fundTypes.moderateShort: return valuationApi.getJuneModerateShortSite;
    case fundTypes.moderate: return valuationApi.getJuneModerateSite;
    case fundTypes.balanced: return valuationApi.getJuneBalancedSite;
    case fundTypes.progressive: return valuationApi.getJuneProgressiveSite;
    case fundTypes.opportunity: return valuationApi.getJuneOpportunitySite;
    case fundTypes.equity: return valuationApi.getJuneEquitySite;
    default: return null;
  }
}

function formatValuation(databaseValuations, fundType) {
  return {
    fundType,
    value: databaseValuations[0][fundType],
    previousValue: databaseValuations[1][fundType],
    change: numberUtils.getPercentageChange(
      databaseValuations[1][fundType], databaseValuations[0][fundType]),
    isPositive: databaseValuations[0][fundType] >= databaseValuations[1][fundType],
    date: databaseValuations[0].date,
  };
}

function isDatabaseValuationGood(databaseValuations, fundType) {
  return databaseValuations[0][fundType] !== null && databaseValuations[0][fundType] !== undefined
    && databaseValuations[1][fundType] !== null && databaseValuations[1][fundType] !== undefined
    && databaseValuations[0].date
    && databaseValuations[0].date.getDay() === new Date().getDay();
}

function getValuation(types) {
  // TODO: maybe we dont need two variables here
  var typesAlreadyInDatabase = []; // eslint-disable-line no-var
  var databaseValuations = []; // eslint-disable-line no-var
  return database.getLatestValuations(2)
    .then((valuations) => {
      // Are there two valuations and is the latest one from today
      // If two valuations save in databaseValuation var
      // If also from today return that instead of getting fundSquareSite
      if (valuations && valuations.length === 2) {
        databaseValuations = types.map(fundType => formatValuation(valuations, fundType));
        typesAlreadyInDatabase =
          types.filter(fundType => isDatabaseValuationGood(valuations, fundType));
      }
      return Promise.all(
        types.map((type) => { return includes(typesAlreadyInDatabase, type)
            ? databaseValuations.find(valuation => valuation.fundType === type)
            : getSite(type)().then(site =>
              fundSquareValuationParser.parseFundSquareValuationSite(site, type));
        })
      );
    })
    .then(valuations =>
      valuations.map((valuation) => {
        // valuation is good -> return valuation
        if (valuation && valuation.value && valuation.previousValue && valuation.change) {
          return valuation;
        }
        // valuation is bad && databaseValuation is good (but outdated) -> return database valuation
        // TODO: add test for bad db data as well. see if we can hit case where we don't find it
        return databaseValuations.find(
          databaseValuation => databaseValuation.fundType === valuation.fundType);
      })
    )
    .then(valuations =>
      Promise.all(valuations.map(valuation =>
        Promise.all([
          valuation,
          !includes(typesAlreadyInDatabase, valuation.fundType)
          && valuation.date.getDay() === new Date().getDay()
          && valuation.value !== null
          && valuation.value !== undefined
            ? database.saveValuation(valuation.date, valuation.fundType, valuation.value)
            : null
        ])
      ))
    )
    .then(results => results.map(result => result[0]));
}

module.exports = {
  getSite,
  getValuation,
};
