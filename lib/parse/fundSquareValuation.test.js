const test = require('ava');
const valuationApi = require('./../api/valuation');
const fundSquareValuationParser = require('./fundSquareValuation');

test('Should return valuation object given a fund square site', t => valuationApi.getJuneBalancedSite()
    .then((site) => {
      const valuation = fundSquareValuationParser.parseFundSquareValuationSite(site);
      t.not(valuation.value, undefined, 'expected valuation to have value property');
      t.not(valuation.previousValue, undefined, 'expected valuation to have previousValue property');
      t.not(valuation.change, undefined, 'expected valuation to have change property');
      t.not(valuation.isPositive, undefined, 'expected valuation to have isPositive property');
    })
);
