const fundTypes = require('./../constant/fundType');
const valuationApi = require('./../api/valuation');
const fundSquareValuationParser = require('./../parse/fundSquareInvestmentDetails');

/* global Promise */

function getSite(type) {
  switch (type) {
    case fundTypes.defensive: return valuationApi.getJuneDefensivePriceSite;
    case fundTypes.moderateShort: return valuationApi.getJuneModerateShortPriceSite;
    case fundTypes.moderate: return valuationApi.getJuneModeratePriceSite;
    case fundTypes.balanced: return valuationApi.getJuneBalancedPriceSite;
    case fundTypes.progressive: return valuationApi.getJuneProgressivePriceSite;
    case fundTypes.opportunity: return valuationApi.getJuneOpportunityPriceSite;
    case fundTypes.equity: return valuationApi.getJuneEquityPriceSite;
    default: return null;
  }
}


function getInvestment(types) {
  return Promise.all(
    types.map(type => getSite(type)(
    ).then(site => fundSquareValuationParser.parseFundSquareInvestmentDetailsSite(site, type)))
  ).then(sites =>
    sites.map((invested) => {
      if (invested && invested.assetString && invested.value && invested.date) {
        return invested;
      }
      return invested;
    })
  );
}


module.exports = {
  getSite,
  getInvestment,
};
