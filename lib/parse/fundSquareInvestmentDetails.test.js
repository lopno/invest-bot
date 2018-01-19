const test = require('ava');
const valuationApi = require('./../api/valuation');
const fundSquareInvestmentParser = require('./fundSquareInvestmentDetails');

test('Should return total assets value given a fund square site', (t) => {
  return valuationApi.getJuneOpportunityPriceSite()
    .then((site) => {
      const valuation = fundSquareInvestmentParser.parseFundSquareInvestmentDetailsSite(site);
      console.log(valuation);
      t.not(valuation.value, undefined, 'expected valuation to have total assets property');
    });
});
